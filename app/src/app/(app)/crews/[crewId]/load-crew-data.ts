import { createClient } from "@/lib/supabase/server";
import { SOLDIER_RULES } from "@/lib/stargrave/constants";
import { corpThemeSlug } from "@/lib/corp-theme";

// Shared data loader for the three crew-detail surfaces (wizard, read-only
// view, edit/page.tsx) -- they all need the same officer/soldier/ship join,
// just render it differently depending on ownership and setup progress.
export async function loadCrewDetail(crewId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: crew } = await supabase
    .from("crews")
    .select(
      "id, name, player_id, campaign_id, credits, experience, ship_name, wizard_step, setup_completed_at, corps(key, name)"
    )
    .eq("id", crewId)
    .maybeSingle();

  if (!crew) return null;

  const isOwner = crew.player_id === user?.id;
  const corpSlug = crew.corps ? corpThemeSlug(crew.corps.key) : undefined;

  const [
    { data: backgrounds },
    { data: corePowerLinks },
    { data: powers },
    { data: equipment },
    { data: soldierTypes },
    { data: captain },
    { data: captainPowers },
    { data: captainGear },
    { data: firstMate },
    { data: firstMatePowers },
    { data: firstMateGear },
    { data: soldiers },
    { data: shipUpgradeTypes },
    { data: crewShipUpgrades },
    { data: holdItems },
    { data: soldierTypeGear },
  ] = await Promise.all([
    supabase.from("backgrounds").select("id, name, flavor_text, fixed_stat_mods, choice_stat_count, choice_stat_options"),
    supabase.from("background_core_powers").select("background_id, power_id"),
    supabase.from("powers").select("id, name, activation_number, strain, full_text").order("name"),
    supabase
      .from("equipment_items")
      .select("id, key, name, category, gear_slots, cost_cr, effect_text, restrictions, base_weapon_type")
      .order("category, name"),
    supabase.from("soldier_types").select("id, name, table_type, move, fight, shoot, armour, will, health, cost_cr"),
    supabase
      .from("captains")
      .select("id, name, background_id, chosen_stat_options, level, move, fight, shoot, armour, will, health, current_health")
      .eq("crew_id", crewId)
      .maybeSingle(),
    supabase.from("captain_powers").select("power_id, is_core, reduced, captains!inner(crew_id)").eq("captains.crew_id", crewId),
    supabase.from("captain_gear").select("equipment_item_id, captains!inner(crew_id)").eq("captains.crew_id", crewId),
    supabase
      .from("first_mates")
      .select("id, name, background_id, chosen_stat_options, move, fight, shoot, armour, will, health, current_health")
      .eq("crew_id", crewId)
      .maybeSingle(),
    supabase
      .from("first_mate_powers")
      .select("power_id, is_core, reduced, first_mates!inner(crew_id)")
      .eq("first_mates.crew_id", crewId),
    supabase.from("first_mate_gear").select("equipment_item_id, first_mates!inner(crew_id)").eq("first_mates.crew_id", crewId),
    supabase
      .from("soldiers")
      .select(
        "id, name, is_robot, current_health, bonus_gear_item_id, soldier_types(id, name, table_type, move, fight, shoot, armour, will, health, cost_cr), bonus_gear:equipment_items(id, name)"
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
    supabase.from("soldier_type_gear").select("soldier_type_id, quantity, equipment_items(name, key, category)"),
  ]);

  const gearByType: Record<string, { name: string; quantity: number }[]> = {};
  const weaponContextByType: Record<string, { weaponKeys: string[]; hasDeck: boolean; hasPicks: boolean }> = {};
  for (const g of soldierTypeGear ?? []) {
    if (!g.equipment_items) continue;
    (gearByType[g.soldier_type_id] ??= []).push({ name: g.equipment_items.name, quantity: g.quantity });

    const ctx = (weaponContextByType[g.soldier_type_id] ??= { weaponKeys: [], hasDeck: false, hasPicks: false });
    if (g.equipment_items.category === "weapon") ctx.weaponKeys.push(g.equipment_items.key);
    if (g.equipment_items.key === "deck") ctx.hasDeck = true;
    if (g.equipment_items.key === "picks") ctx.hasPicks = true;
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
  for (const link of corePowerLinks ?? []) {
    (corePowersByBackground[link.background_id] ??= []).push(link.power_id);
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
    captainPowers: captainPowers ?? [],
    captainGear: captainGear ?? [],
    captainBackgroundName,
    firstMate,
    firstMatePowers: firstMatePowers ?? [],
    firstMateGear: firstMateGear ?? [],
    firstMateBackgroundName,
    soldiers: typedSoldiers,
    shipUpgradeTypes: shipUpgradeTypes ?? [],
    crewShipUpgrades: typedCrewShipUpgrades,
    holdItems: holdItems ?? [],
    gearByType,
    weaponContextByType,
    maxSpecialists,
  };
}

export type CrewDetail = NonNullable<Awaited<ReturnType<typeof loadCrewDetail>>>;
