"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OFFICER_RULES, SOLDIER_RULES, type ChoosableStat, type OfficerRole } from "@/lib/stargrave/constants";
import {
  computeActivationNumber,
  computeGearSlotTotal,
  computeStatLine,
  validateChosenStatOptions,
  validateGearSlots,
  validatePowerSelection,
  validateReduction,
} from "@/lib/stargrave/compute";

async function requireOwnedCrew(crewId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." } as const;

  const { data: crew } = await supabase
    .from("crews")
    .select("id, credits, campaign_id")
    .eq("id", crewId)
    .eq("player_id", user.id)
    .maybeSingle();
  if (!crew) return { error: "Diese Crew gehört dir nicht." } as const;

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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { data: crew } = await supabase
    .from("crews")
    .select("id, player_id")
    .eq("id", input.crewId)
    .maybeSingle();
  if (!crew || crew.player_id !== user.id) {
    return { error: "Diese Crew gehört dir nicht." };
  }

  const rules = OFFICER_RULES[input.role];

  const { data: background } = await supabase
    .from("backgrounds")
    .select("id, fixed_stat_mods, choice_stat_count, choice_stat_options")
    .eq("id", input.backgroundId)
    .maybeSingle();
  if (!background) return { error: "Ungültiger Background." };

  const statError = validateChosenStatOptions(
    input.chosenStatOptions,
    background.choice_stat_options,
    background.choice_stat_count
  );
  if (statError) return { error: statError };

  const { data: corePowerRows } = await supabase
    .from("background_core_powers")
    .select("power_id")
    .eq("background_id", input.backgroundId);
  const corePowerIds = new Set((corePowerRows ?? []).map((r) => r.power_id));

  const powerError = validatePowerSelection(input.powerIds, corePowerIds, rules);
  if (powerError) return { error: powerError };

  const reductionError = validateReduction(input.reducedPowerIds, input.powerIds, rules.maxReductions);
  if (reductionError) return { error: reductionError };

  const { data: powerRows } = await supabase
    .from("powers")
    .select("id, activation_number")
    .in("id", input.powerIds);
  if (!powerRows || powerRows.length !== input.powerIds.length) {
    return { error: "Eine oder mehrere Powers wurden nicht gefunden." };
  }
  const powerById = new Map(powerRows.map((p) => [p.id, p]));

  const { data: gearRows } = await supabase
    .from("equipment_items")
    .select("id, key, gear_slots")
    .in("id", Array.from(new Set(input.gearItemIds)));
  const gearById = new Map((gearRows ?? []).map((g) => [g.id, g]));
  if (input.gearItemIds.some((id) => !gearById.has(id))) {
    return { error: "Ein Gear-Item wurde nicht gefunden." };
  }

  const gearSlotTotal = computeGearSlotTotal(
    input.gearItemIds.map((id) => {
      const g = gearById.get(id)!;
      return { key: g.key, gearSlots: g.gear_slots };
    })
  );
  const gearError = validateGearSlots(gearSlotTotal, rules.gearSlots);
  if (gearError) return { error: gearError };

  const stats = computeStatLine(rules.baseStats, background.fixed_stat_mods as Record<string, number>, input.chosenStatOptions);
  const defaultName = input.role === "captain" ? "Captain" : "First Mate";

  const table = input.role === "captain" ? "captains" : "first_mates";
  const { data: existing } = await supabase
    .from(table)
    .select("id, current_health, health")
    .eq("crew_id", input.crewId)
    .maybeSingle();

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
    return {
      power_id: powerId,
      is_core: isCore,
      activation_number: computeActivationNumber(printed, isCore, rules.nonCoreActivationOffset, reduced),
      reduced,
    };
  });

  let officerId: string;
  if (input.role === "captain") {
    const { data: officer, error: upsertError } = await supabase
      .from("captains")
      .upsert(officerRow, { onConflict: "crew_id" })
      .select("id")
      .single();
    if (upsertError || !officer) return { error: upsertError?.message ?? "Speichern fehlgeschlagen." };
    officerId = officer.id;

    await supabase.from("captain_powers").delete().eq("captain_id", officerId);
    const { error: powersError } = await supabase
      .from("captain_powers")
      .insert(basePowerInserts.map((p) => ({ ...p, captain_id: officerId })));
    if (powersError) return { error: powersError.message };

    await supabase.from("captain_gear").delete().eq("captain_id", officerId);
    if (input.gearItemIds.length > 0) {
      const { error: gearError } = await supabase
        .from("captain_gear")
        .insert(input.gearItemIds.map((equipmentItemId) => ({ captain_id: officerId, equipment_item_id: equipmentItemId })));
      if (gearError) return { error: gearError.message };
    }
  } else {
    const { data: officer, error: upsertError } = await supabase
      .from("first_mates")
      .upsert(officerRow, { onConflict: "crew_id" })
      .select("id")
      .single();
    if (upsertError || !officer) return { error: upsertError?.message ?? "Speichern fehlgeschlagen." };
    officerId = officer.id;

    await supabase.from("first_mate_powers").delete().eq("first_mate_id", officerId);
    const { error: powersError } = await supabase
      .from("first_mate_powers")
      .insert(basePowerInserts.map((p) => ({ ...p, first_mate_id: officerId })));
    if (powersError) return { error: powersError.message };

    await supabase.from("first_mate_gear").delete().eq("first_mate_id", officerId);
    if (input.gearItemIds.length > 0) {
      const { error: gearError } = await supabase
        .from("first_mate_gear")
        .insert(input.gearItemIds.map((equipmentItemId) => ({ first_mate_id: officerId, equipment_item_id: equipmentItemId })));
      if (gearError) return { error: gearError.message };
    }
  }

  revalidatePath(`/crews/${input.crewId}`);
  return {};
}

export async function addSoldier(
  crewId: string,
  soldierTypeId: string,
  isRobot: boolean
): Promise<{ error?: string }> {
  const owned = await requireOwnedCrew(crewId);
  if ("error" in owned) return owned;
  const { supabase, crew } = owned;

  const { data: soldierType } = await supabase
    .from("soldier_types")
    .select("id, table_type, cost_cr, health")
    .eq("id", soldierTypeId)
    .maybeSingle();
  if (!soldierType) return { error: "Ungültiger Soldier-Typ." };

  const { data: existingSoldiers } = await supabase
    .from("soldiers")
    .select("id, soldier_types(table_type)")
    .eq("crew_id", crewId);
  const soldiers = existingSoldiers ?? [];

  if (soldiers.length >= SOLDIER_RULES.maxSoldiers) {
    return { error: `Crew hat bereits die maximalen ${SOLDIER_RULES.maxSoldiers} Soldiers.` };
  }

  if (soldierType.table_type === "specialist") {
    const { data: extraQuarters } = await supabase
      .from("crew_ship_upgrades")
      .select("id, ship_upgrade_types!inner(key)")
      .eq("crew_id", crewId)
      .eq("ship_upgrade_types.key", "extra_quarters")
      .maybeSingle();
    const maxSpecialists = extraQuarters ? SOLDIER_RULES.maxSpecialistsDefault + 1 : SOLDIER_RULES.maxSpecialistsDefault;
    const specialistCount = soldiers.filter((s) => s.soldier_types?.table_type === "specialist").length;
    if (specialistCount >= maxSpecialists) {
      return { error: `Crew hat bereits die maximalen ${maxSpecialists} Specialists.` };
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
  const { supabase } = owned;

  const { error } = await supabase.from("soldiers").delete().eq("id", soldierId).eq("crew_id", crewId);
  if (error) return { error: error.message };

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

  const { data: upgradeType } = await supabase
    .from("ship_upgrade_types")
    .select("id, cost_cr, max_purchases")
    .eq("id", shipUpgradeTypeId)
    .maybeSingle();
  if (!upgradeType) return { error: "Ungültiges Ship-Upgrade." };

  const { count } = await supabase
    .from("crew_ship_upgrades")
    .select("id", { count: "exact", head: true })
    .eq("crew_id", crewId)
    .eq("ship_upgrade_type_id", shipUpgradeTypeId);
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
  const { supabase } = owned;

  const { error } = await supabase
    .from("crew_ship_upgrades")
    .delete()
    .eq("id", crewShipUpgradeId)
    .eq("crew_id", crewId);
  if (error) return { error: error.message };

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
