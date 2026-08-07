"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ACCEPTED_PORTRAIT_MIME_TYPES,
  DOSSIER_PORTRAIT_BUCKET,
  MAX_PORTRAIT_BYTES,
  dossierPortraitPath,
  type DossierKind,
} from "@/lib/supabase/dossier-portraits";
import {
  isCampaignLootCategory,
  isSoldierEligibleGear,
  OFFICER_RULES,
  SOLDIER_RULES,
  type ChoosableStat,
  type OfficerRole,
} from "@/lib/stargrave/constants";
import {
  computeActivationNumber,
  computeGearSlotTotal,
  computeStatLine,
  validateArmourLimit,
  validateChosenStatOptions,
  validateGearSlots,
  validatePowerSelection,
  validateReduction,
} from "@/lib/stargrave/compute";

async function requireOwnedCrew(crewId: string) {
  const supabase = await createClient();

  // auth.getUser() and the crew fetch don't depend on each other -- fetch by
  // id alone and check ownership once both are back, instead of waiting for
  // the user id before even starting the crew query.
  const [
    {
      data: { user },
    },
    { data: crew },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("crews")
      .select("id, player_id, credits, campaign_id, wizard_step, setup_completed_at")
      .eq("id", crewId)
      .maybeSingle(),
  ]);
  if (!user) return { error: "Nicht eingeloggt." } as const;
  if (!crew || crew.player_id !== user.id) return { error: "Dieses Team gehört dir nicht." } as const;

  return { supabase, crew } as const;
}

export type SaveOfficerInput = {
  crewId: string;
  role: OfficerRole;
  name: string;
  backgroundId: string;
  chosenStatOptions: ChoosableStat[];
  powerIds: string[];
  reducedPowerIds: string[];
  gearItemIds: string[];
};

export async function saveOfficer(input: SaveOfficerInput): Promise<{ error?: string }> {
  const supabase = await createClient();
  const rules = OFFICER_RULES[input.role];
  const table = input.role === "captain" ? "captains" : "first_mates";

  // None of these six reads depend on each other's result -- batch them into
  // one round trip instead of the seven sequential ones this used to be.
  const [
    {
      data: { user },
    },
    { data: crew },
    { data: background },
    { data: corePowerRows },
    { data: powerRows },
    { data: gearRows },
    { data: existing },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("crews").select("id, player_id, campaign_id").eq("id", input.crewId).maybeSingle(),
    supabase.from("backgrounds").select("id, fixed_stat_mods, choice_stat_count, choice_stat_options").eq("id", input.backgroundId).maybeSingle(),
    supabase.from("background_core_powers").select("power_id").eq("background_id", input.backgroundId),
    supabase.from("powers").select("id, activation_number").in("id", input.powerIds),
    supabase.from("equipment_items").select("id, key, gear_slots, category").in("id", Array.from(new Set(input.gearItemIds))),
    supabase.from(table).select("id, current_health, health").eq("crew_id", input.crewId).maybeSingle(),
  ]);

  if (!user) return { error: "Nicht eingeloggt." };
  if (!crew || crew.player_id !== user.id) {
    return { error: "Dieses Team gehört dir nicht." };
  }
  if (!background) return { error: "Ungültiger Background." };

  const statError = validateChosenStatOptions(
    input.chosenStatOptions,
    background.choice_stat_options,
    background.choice_stat_count
  );
  if (statError) return { error: statError };

  const corePowerIds = new Set((corePowerRows ?? []).map((r) => r.power_id));

  const powerError = validatePowerSelection(input.powerIds, corePowerIds, rules);
  if (powerError) return { error: powerError };

  const reductionError = validateReduction(input.reducedPowerIds, input.powerIds, rules.maxReductions);
  if (reductionError) return { error: reductionError };

  if (!powerRows || powerRows.length !== input.powerIds.length) {
    return { error: "Eine oder mehrere Powers wurden nicht gefunden." };
  }
  const powerById = new Map(powerRows.map((p) => [p.id, p]));

  const gearById = new Map((gearRows ?? []).map((g) => [g.id, g]));
  if (input.gearItemIds.some((id) => !gearById.has(id))) {
    return { error: "Ein Gear-Item wurde nicht gefunden." };
  }
  if (!crew.campaign_id && input.gearItemIds.some((id) => isCampaignLootCategory(gearById.get(id)!.category))) {
    return { error: "Advanced Weapon/Technology und Alien Artefact sind Campaign Loot -- nur in einer Kampagne verfügbar." };
  }

  const gearSlotTotal = computeGearSlotTotal(
    input.gearItemIds.map((id) => {
      const g = gearById.get(id)!;
      return { key: g.key, gearSlots: g.gear_slots };
    })
  );
  const gearError = validateGearSlots(gearSlotTotal, rules.gearSlots);
  if (gearError) return { error: gearError };

  // Rulebook: "A figure may never wear more than one armour type at the
  // same time" -- Light/Heavy/Combat Armour and Shield all share the
  // "armour" category, so this is a cap of 1 total unit across it.
  const armourCount = input.gearItemIds.filter((id) => gearById.get(id)!.category === "armour").length;
  const armourError = validateArmourLimit(armourCount);
  if (armourError) return { error: armourError };

  const stats = computeStatLine(rules.baseStats, background.fixed_stat_mods as Record<string, number>, input.chosenStatOptions);
  const defaultName = input.role === "captain" ? "Captain" : "First Mate";

  // Preserve accumulated damage when re-saving; only reset current_health if
  // starting health increased (e.g. a stat choice change), never let it exceed the new max.
  const currentHealth = existing
    ? Math.min(existing.current_health + (stats.health - existing.health), stats.health)
    : stats.health;

  const officerRow = {
    id: existing?.id,
    crew_id: input.crewId,
    name: input.name || defaultName,
    background_id: input.backgroundId,
    chosen_stat_options: input.chosenStatOptions,
    level: rules.startLevel,
    move: stats.move,
    fight: stats.fight,
    shoot: stats.shoot,
    armour: stats.armour,
    will: stats.will,
    health: stats.health,
    current_health: currentHealth,
  };

  const basePowerInserts = input.powerIds.map((powerId) => {
    const isCore = corePowerIds.has(powerId);
    const reduced = input.reducedPowerIds.includes(powerId);
    const printed = powerById.get(powerId)!.activation_number;
    const offset = isCore ? rules.coreActivationOffset : rules.nonCoreActivationOffset;
    return {
      power_id: powerId,
      is_core: isCore,
      activation_number: computeActivationNumber(printed, offset, reduced),
      reduced,
    };
  });

  const { data: officer, error: upsertError } = await supabase
    .from(table)
    .upsert(officerRow, { onConflict: "crew_id" })
    .select("id")
    .single();
  if (upsertError || !officer) return { error: upsertError?.message ?? "Speichern fehlgeschlagen." };
  const officerId = officer.id;

  // Delete-then-insert must stay two phases (an overlapping power/gear id
  // would violate the unique constraint if run concurrently), but the two
  // tables within each phase are independent -- batch those.
  const [{ error: deletePowersError }, { error: deleteGearError }] =
    input.role === "captain"
      ? await Promise.all([
          supabase.from("captain_powers").delete().eq("captain_id", officerId),
          supabase.from("captain_gear").delete().eq("captain_id", officerId),
        ])
      : await Promise.all([
          supabase.from("first_mate_powers").delete().eq("first_mate_id", officerId),
          supabase.from("first_mate_gear").delete().eq("first_mate_id", officerId),
        ]);
  if (deletePowersError) return { error: deletePowersError.message };
  if (deleteGearError) return { error: deleteGearError.message };

  const [{ error: powersError }, gearResult] =
    input.role === "captain"
      ? await Promise.all([
          supabase.from("captain_powers").insert(basePowerInserts.map((p) => ({ ...p, captain_id: officerId }))),
          input.gearItemIds.length > 0
            ? supabase
                .from("captain_gear")
                .insert(input.gearItemIds.map((equipmentItemId) => ({ captain_id: officerId, equipment_item_id: equipmentItemId })))
            : Promise.resolve({ error: null }),
        ])
      : await Promise.all([
          supabase.from("first_mate_powers").insert(basePowerInserts.map((p) => ({ ...p, first_mate_id: officerId }))),
          input.gearItemIds.length > 0
            ? supabase
                .from("first_mate_gear")
                .insert(input.gearItemIds.map((equipmentItemId) => ({ first_mate_id: officerId, equipment_item_id: equipmentItemId })))
            : Promise.resolve({ error: null }),
        ]);
  if (powersError) return { error: powersError.message };
  if (gearResult.error) return { error: gearResult.error.message };

  revalidatePath(`/crews/${input.crewId}`);
  return {};
}

export async function addSoldier(
  crewId: string,
  soldierTypeId: string,
  isRobot: boolean,
  name: string | null
): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  const [{ data: soldierType }, { data: existingSoldiers }, { data: extraQuarters }] = await Promise.all([
    supabase.from("soldier_types").select("id, table_type, cost_cr, health").eq("id", soldierTypeId).maybeSingle(),
    supabase.from("soldiers").select("id, soldier_types(table_type)").eq("crew_id", crewId),
    supabase
      .from("crew_ship_upgrades")
      .select("id, ship_upgrade_types!inner(key)")
      .eq("crew_id", crewId)
      .eq("ship_upgrade_types.key", "extra_quarters")
      .maybeSingle(),
  ]);
  if (!soldierType) return { error: "Ungültiger Soldier-Typ." };
  const soldiers = existingSoldiers ?? [];

  if (soldiers.length >= SOLDIER_RULES.maxSoldiers) {
    return { error: `Team hat bereits die maximalen ${SOLDIER_RULES.maxSoldiers} Soldiers.` };
  }

  if (soldierType.table_type === "specialist") {
    const maxSpecialists = extraQuarters ? SOLDIER_RULES.maxSpecialistsDefault + 1 : SOLDIER_RULES.maxSpecialistsDefault;
    const specialistCount = soldiers.filter((s) => s.soldier_types?.table_type === "specialist").length;
    if (specialistCount >= maxSpecialists) {
      return { error: `Team hat bereits die maximalen ${maxSpecialists} Specialists.` };
    }
  }

  if (soldierType.cost_cr > crew.credits) {
    return { error: `Nicht genug Credits (${crew.credits}cr verfügbar, ${soldierType.cost_cr}cr benötigt).` };
  }

  const { error: insertError } = await supabase.from("soldiers").insert({
    crew_id: crewId,
    soldier_type_id: soldierTypeId,
    is_robot: isRobot,
    current_health: soldierType.health,
    name: name?.trim() || null,
  });
  if (insertError) return { error: insertError.message };

  const { error: creditError } = await supabase
    .from("crews")
    .update({ credits: crew.credits - soldierType.cost_cr })
    .eq("id", crewId);
  if (creditError) return { error: creditError.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function removeSoldier(crewId: string, soldierId: string): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  const { data: soldier } = await supabase
    .from("soldiers")
    .select("id, soldier_types(cost_cr)")
    .eq("id", soldierId)
    .eq("crew_id", crewId)
    .maybeSingle();
  if (!soldier) return { error: "Soldier nicht gefunden." };

  const { error } = await supabase.from("soldiers").delete().eq("id", soldierId).eq("crew_id", crewId);
  if (error) return { error: error.message };

  const refund = soldier.soldier_types?.cost_cr ?? 0;
  if (refund > 0) {
    const { error: creditError } = await supabase
      .from("crews")
      .update({ credits: crew.credits + refund })
      .eq("id", crewId);
    if (creditError) return { error: creditError.message };
  }

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function setSoldierRobot(
  crewId: string,
  soldierId: string,
  isRobot: boolean
): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase } = owned;

  const { error } = await supabase
    .from("soldiers")
    .update({ is_robot: isRobot })
    .eq("id", soldierId)
    .eq("crew_id", crewId);
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function setSoldierName(crewId: string, soldierId: string, name: string): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase } = owned;

  const { error } = await supabase
    .from("soldiers")
    .update({ name: name.trim() || null })
    .eq("id", soldierId)
    .eq("crew_id", crewId);
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function setSoldierBonusGear(
  crewId: string,
  soldierId: string,
  equipmentItemId: string | null
): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  if (equipmentItemId && !crew.campaign_id) {
    return {
      error: "Der Bonus-Slot ist Campaign Loot -- nur für Teams verfügbar, die in einer Kampagne mitspielen.",
    };
  }

  if (equipmentItemId) {
    const [{ data: item }, { data: soldier }] = await Promise.all([
      supabase.from("equipment_items").select("category, restrictions, base_weapon_type").eq("id", equipmentItemId).maybeSingle(),
      supabase.from("soldiers").select("soldier_type_id").eq("id", soldierId).eq("crew_id", crewId).maybeSingle(),
    ]);
    if (!item || !soldier) return { error: "Ungültige Auswahl." };

    const { data: startingGear } = await supabase
      .from("soldier_type_gear")
      .select("equipment_items(key, category)")
      .eq("soldier_type_id", soldier.soldier_type_id);

    const context = { weaponKeys: [] as string[], hasDeck: false, hasPicks: false };
    for (const g of startingGear ?? []) {
      if (!g.equipment_items) continue;
      if (g.equipment_items.category === "weapon") context.weaponKeys.push(g.equipment_items.key);
      if (g.equipment_items.key === "deck") context.hasDeck = true;
      if (g.equipment_items.key === "picks") context.hasPicks = true;
    }

    if (!isSoldierEligibleGear(item, context)) {
      return {
        error:
          "Diese Ausrüstung ist für diesen Soldier nicht erlaubt (nur Campaign Loot, passender Waffentyp, kein Alien Artefact).",
      };
    }
  }

  const { error } = await supabase
    .from("soldiers")
    .update({ bonus_gear_item_id: equipmentItemId })
    .eq("id", soldierId)
    .eq("crew_id", crewId);
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

const DOSSIER_TABLES: Record<DossierKind, "captains" | "first_mates" | "soldiers"> = {
  captain: "captains",
  first_mate: "first_mates",
  soldier: "soldiers",
};

export async function uploadDossierPortrait(
  crewId: string,
  kind: DossierKind,
  dossierId: string,
  formData: FormData
): Promise<{ error?: string; portraitPath?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase } = owned;

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Keine Datei erhalten." };
  if (!ACCEPTED_PORTRAIT_MIME_TYPES.includes(file.type as (typeof ACCEPTED_PORTRAIT_MIME_TYPES)[number])) {
    return { error: "Nur PNG, JPEG oder WebP erlaubt." };
  }
  if (file.size > MAX_PORTRAIT_BYTES) {
    return { error: "Bild ist größer als 5 MB." };
  }

  const table = DOSSIER_TABLES[kind];
  const { data: dossier } = await supabase
    .from(table)
    .select("id, portrait_path")
    .eq("id", dossierId)
    .eq("crew_id", crewId)
    .maybeSingle();
  if (!dossier) return { error: "Dossier nicht gefunden." };

  // Best-effort cleanup of the previous portrait -- a leftover orphaned
  // object isn't worth failing the upload over.
  if (dossier.portrait_path) {
    await supabase.storage.from(DOSSIER_PORTRAIT_BUCKET).remove([dossier.portrait_path]);
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || (file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg");
  const path = dossierPortraitPath(crewId, kind, dossierId, extension);

  const { error: uploadError } = await supabase.storage
    .from(DOSSIER_PORTRAIT_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return { error: uploadError.message };

  const { error: updateError } = await supabase.from(table).update({ portrait_path: path }).eq("id", dossierId).eq("crew_id", crewId);
  if (updateError) return { error: updateError.message };

  revalidatePath(`/crews/${crewId}`);
  return { portraitPath: path };
}

export async function removeDossierPortrait(crewId: string, kind: DossierKind, dossierId: string): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase } = owned;

  const table = DOSSIER_TABLES[kind];
  const { data: dossier } = await supabase
    .from(table)
    .select("id, portrait_path")
    .eq("id", dossierId)
    .eq("crew_id", crewId)
    .maybeSingle();
  if (!dossier) return { error: "Dossier nicht gefunden." };
  if (!dossier.portrait_path) return {};

  const { error: removeError } = await supabase.storage.from(DOSSIER_PORTRAIT_BUCKET).remove([dossier.portrait_path]);
  if (removeError) return { error: removeError.message };

  const { error } = await supabase.from(table).update({ portrait_path: null }).eq("id", dossierId).eq("crew_id", crewId);
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

// Advances the crew-creation wizard's persisted frontier past `fromStep`
// (1=Captain, 2=First Mate, 3=Soldiers, 4=Ship). wizard_step only ever moves
// forward -- re-confirming an earlier step (after navigating back) is a
// no-op past the already-reached frontier. Completing step 4 finalizes the
// crew, after which it always opens in the read-only view.
export async function advanceWizardStep(crewId: string, fromStep: number): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  if (crew.setup_completed_at) return {};

  const nextStep = Math.min(4, Math.max(crew.wizard_step, fromStep + 1));
  const { error } = await supabase
    .from("crews")
    .update({
      wizard_step: nextStep,
      ...(fromStep >= 4 ? { setup_completed_at: new Date().toISOString() } : {}),
    })
    .eq("id", crewId);
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function deleteCrew(crewId: string): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  const { error } = await supabase.from("crews").delete().eq("id", crewId);
  if (error) return { error: error.message };

  revalidatePath("/crews");
  revalidatePath("/");
  if (crew.campaign_id) revalidatePath(`/campaigns/${crew.campaign_id}`);
  redirect("/crews");
}

export async function updateCrewName(crewId: string, name: string): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  if (!name.trim()) return { error: "Bitte einen Namen angeben." };

  const { error } = await supabase.from("crews").update({ name: name.trim() }).eq("id", crewId);
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  revalidatePath("/crews");
  if (crew.campaign_id) revalidatePath(`/campaigns/${crew.campaign_id}`);
  return {};
}

export async function updateShipName(crewId: string, shipName: string): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase } = owned;

  const { error } = await supabase.from("crews").update({ ship_name: shipName }).eq("id", crewId);
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function addShipUpgrade(
  crewId: string,
  shipUpgradeTypeId: string,
  targetNote: string | null
): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  const [{ data: upgradeType }, { count }] = await Promise.all([
    supabase.from("ship_upgrade_types").select("id, cost_cr, max_purchases").eq("id", shipUpgradeTypeId).maybeSingle(),
    supabase
      .from("crew_ship_upgrades")
      .select("id", { count: "exact", head: true })
      .eq("crew_id", crewId)
      .eq("ship_upgrade_type_id", shipUpgradeTypeId),
  ]);
  if (!upgradeType) return { error: "Ungültiges Ship-Upgrade." };
  if ((count ?? 0) >= upgradeType.max_purchases) {
    return { error: "Dieses Upgrade wurde bereits maximal oft gekauft." };
  }

  if (upgradeType.cost_cr > crew.credits) {
    return { error: `Nicht genug Credits (${crew.credits}cr verfügbar, ${upgradeType.cost_cr}cr benötigt).` };
  }

  const { error: insertError } = await supabase.from("crew_ship_upgrades").insert({
    crew_id: crewId,
    ship_upgrade_type_id: shipUpgradeTypeId,
    target_note: targetNote,
  });
  if (insertError) return { error: insertError.message };

  const { error: creditError } = await supabase
    .from("crews")
    .update({ credits: crew.credits - upgradeType.cost_cr })
    .eq("id", crewId);
  if (creditError) return { error: creditError.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function removeShipUpgrade(crewId: string, crewShipUpgradeId: string): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  const { data: upgrade } = await supabase
    .from("crew_ship_upgrades")
    .select("id, ship_upgrade_types(cost_cr)")
    .eq("id", crewShipUpgradeId)
    .eq("crew_id", crewId)
    .maybeSingle();
  if (!upgrade) return { error: "Upgrade nicht gefunden." };

  const { error } = await supabase
    .from("crew_ship_upgrades")
    .delete()
    .eq("id", crewShipUpgradeId)
    .eq("crew_id", crewId);
  if (error) return { error: error.message };

  const refund = upgrade.ship_upgrade_types?.cost_cr ?? 0;
  if (refund > 0) {
    const { error: creditError } = await supabase
      .from("crews")
      .update({ credits: crew.credits + refund })
      .eq("id", crewId);
    if (creditError) return { error: creditError.message };
  }

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function addShipHoldItem(
  crewId: string,
  equipmentItemId: string | null,
  customName: string | null,
  quantity: number,
  notes: string | null
): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase } = owned;

  if (!equipmentItemId && !customName) {
    return { error: "Bitte ein Item aus dem Katalog wählen oder einen Namen eingeben." };
  }

  const { error } = await supabase.from("ship_hold_items").insert({
    crew_id: crewId,
    equipment_item_id: equipmentItemId,
    custom_name: customName,
    quantity,
    notes,
  });
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}

export async function removeShipHoldItem(crewId: string, itemId: string): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase } = owned;

  const { error } = await supabase.from("ship_hold_items").delete().eq("id", itemId).eq("crew_id", crewId);
  if (error) return { error: error.message };

  revalidatePath(`/crews/${crewId}`);
  return {};
}
