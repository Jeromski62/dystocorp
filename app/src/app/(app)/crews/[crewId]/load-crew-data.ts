import { createClient } from "@/lib/supabase/server";
import { SOLDIER_RULES } from "@/lib/stargrave/constants";
import { corpThemeSlug } from "@/lib/corp-theme";

// Shared data loader for the three crew-detail surfaces (wizard, read-only
// view, edit/page.tsx) -- they all need the same officer/soldier/ship join,
// just render it differently depending on ownership and setup progress.
//
// Every query here runs in a single Promise.all batch (no query depends on
// another's result), and powers/gear/core-power links ride along as nested
// selects on their parent row instead of separate round trips -- this was
// 17 sequential-ish Supabase requests before, now 9 concurrent ones.
export async function loadCrewDetail(crewId: string) {
  const supabase = await createClient();

  const [
    {
      data: { user },
    },
    { data: crew },
    { data: backgrounds },
    { data: powers },
    { data: equipment },
    { data: soldierTypes },
    { data: captain },
    { data: firstMate },
    { data: soldiers },
    { data: shipUpgradeTypes },
    { data: crewShipUpgrades },
    { data: holdItems },
    { data: firstNames },
    { data: lastNames },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("crews")
      .select(
        "id, name, player_id, campaign_id, credits, experience, ship_name, wizard_step, setup_completed_at, corps(key, name)"
      )
      .eq("id", crewId)
      .maybeSingle(),
    supabase
      .from("backgrounds")
      .select("id, key, name, flavor_text, fixed_stat_mods, choice_stat_count, choice_stat_options, background_core_powers(power_id)"),
    supabase.from("powers").select("id, name, activation_number, strain, full_text").order("name"),
    supabase
      .from("equipment_items")
      .select("id, key, name, category, gear_slots, cost_cr, effect_text, restrictions, base_weapon_type")
      .order("category, name"),
    supabase
      .from("soldier_types")
      .select(
        "id, name, table_type, move, fight, shoot, armour, will, health, cost_cr, soldier_type_gear(quantity, equipment_items(name, key, category))"
      ),
    supabase
      .from("captains")
      .select(
        "id, name, background_id, chosen_stat_options, level, move, fight, shoot, armour, will, health, current_health, portrait_path, captain_powers(power_id, is_core, reduced), captain_gear(equipment_item_id)"
      )
      .eq("crew_id", crewId)
      .maybeSingle(),
    supabase
      .from("first_mates")
      .select(
        "id, name, background_id, chosen_stat_options, move, fight, shoot, armour, will, health, current_health, portrait_path, first_mate_powers(power_id, is_core, reduced), first_mate_gear(equipment_item_id)"
      )
      .eq("crew_id", crewId)
      .maybeSingle(),
    supabase
      .from("soldiers")
      .select(
        "id, name, is_robot, current_health, bonus_gear_item_id, portrait_path, soldier_types(id, name, table_type, move, fight, shoot, armour, will, health, cost_cr), bonus_gear:equipment_items(id, name)"
      )
      .eq("crew_id", crewId)
      .order("sort_order"),
    supabase.from("ship_upgrade_types").select("id, key, name, cost_cr, effect_text, max_purchases"),
    supabase
      .from("crew_ship_upgrades")
      .select("id, ship_upgrade_type_id, target_note, ship_upgrade_types(id, key, name, cost_cr, effect_text, max_purchases)")
      .eq("crew_id", crewId),
    supabase
      .from("ship_hold_items")
      .select("id, equipment_item_id, custom_name, quantity, notes, equipment_items(id, name)")
      .eq("crew_id", crewId),
    supabase.from("character_first_names").select("name"),
    supabase.from("character_last_names").select("name"),
  ]);

  if (!crew) return null;

  const isOwner = crew.player_id === user?.id;
  const corpSlug = crew.corps ? corpThemeSlug(crew.corps.key) : undefined;

  const gearByType: Record<string, { name: string; quantity: number }[]> = {};
  const weaponContextByType: Record<string, { weaponKeys: string[]; hasDeck: boolean; hasPicks: boolean }> = {};
  for (const t of soldierTypes ?? []) {
    for (const g of t.soldier_type_gear ?? []) {
      if (!g.equipment_items) continue;
      (gearByType[t.id] ??= []).push({ name: g.equipment_items.name, quantity: g.quantity });

      const ctx = (weaponContextByType[t.id] ??= { weaponKeys: [], hasDeck: false, hasPicks: false });
      if (g.equipment_items.category === "weapon") ctx.weaponKeys.push(g.equipment_items.key);
      if (g.equipment_items.key === "deck") ctx.hasDeck = true;
      if (g.equipment_items.key === "picks") ctx.hasPicks = true;
    }
  }

  const typedBackgrounds = (backgrounds ?? []).map((b) => ({
    ...b,
    fixed_stat_mods: (b.fixed_stat_mods ?? {}) as Record<string, number>,
  }));
  const typedSoldierTypes = (soldierTypes ?? []).map((t) => ({
    ...t,
    table_type: t.table_type as "standard" | "specialist",
  }));

  const corePowersByBackground: Record<string, string[]> = {};
  for (const b of backgrounds ?? []) {
    corePowersByBackground[b.id] = (b.background_core_powers ?? []).map((link) => link.power_id);
  }

  const maxSpecialists = (crewShipUpgrades ?? []).some((u) => u.ship_upgrade_types?.key === "extra_quarters")
    ? SOLDIER_RULES.maxSpecialistsDefault + 1
    : SOLDIER_RULES.maxSpecialistsDefault;

  const captainBackgroundName = captain ? typedBackgrounds.find((b) => b.id === captain.background_id)?.name ?? null : null;
  const firstMateBackgroundName = firstMate ? typedBackgrounds.find((b) => b.id === firstMate.background_id)?.name ?? null : null;

  const typedSoldiers = (soldiers ?? [])
    .filter((s) => s.soldier_types !== null)
    .map((s) => ({
      ...s,
      soldier_types: { ...s.soldier_types!, table_type: s.soldier_types!.table_type as "standard" | "specialist" },
    }));

  const typedCrewShipUpgrades = (crewShipUpgrades ?? []).filter((u) => u.ship_upgrade_types !== null) as (Omit<
    NonNullable<typeof crewShipUpgrades>[number],
    "ship_upgrade_types"
  > & { ship_upgrade_types: NonNullable<NonNullable<typeof crewShipUpgrades>[number]["ship_upgrade_types"]> })[];

  return {
    crew,
    isOwner,
    corpSlug,
    backgrounds: typedBackgrounds,
    corePowersByBackground,
    powers: powers ?? [],
    equipment: equipment ?? [],
    soldierTypes: typedSoldierTypes,
    captain,
    captainPowers: captain?.captain_powers ?? [],
    captainGear: captain?.captain_gear ?? [],
    captainBackgroundName,
    firstMate,
    firstMatePowers: firstMate?.first_mate_powers ?? [],
    firstMateGear: firstMate?.first_mate_gear ?? [],
    firstMateBackgroundName,
    soldiers: typedSoldiers,
    shipUpgradeTypes: shipUpgradeTypes ?? [],
    crewShipUpgrades: typedCrewShipUpgrades,
    holdItems: holdItems ?? [],
    gearByType,
    weaponContextByType,
    maxSpecialists,
    firstNames: (firstNames ?? []).map((n) => n.name),
    lastNames: (lastNames ?? []).map((n) => n.name),
  };
}

export type CrewDetail = NonNullable<Awaited<ReturnType<typeof loadCrewDetail>>>;
