import { createClient } from "@/lib/supabase/server";

export type CombatantGearItem = { id: string; name: string; category: string; damageModifier: string | null };

export type CombatantKind = "captain" | "first_mate" | "soldier";

export type PlayCombatant = {
  kind: CombatantKind;
  id: string;
  crewId: string;
  crewName: string;
  name: string;
  shoot: number;
  fight: number;
  armour: number;
  health: number;
  currentHealth: number;
  isRobot: boolean;
  isStunned: boolean;
  weaponJammed: boolean;
  lostEyeStacks: number;
  gear: CombatantGearItem[];
};

function lostEyeStacksFrom(permanentInjuries: unknown): number {
  if (!Array.isArray(permanentInjuries)) return 0;
  const entry = permanentInjuries.find(
    (i) => typeof i === "object" && i !== null && (i as Record<string, unknown>).injury_type_key === "lost_eye"
  ) as { stacks?: number } | undefined;
  return entry?.stacks ?? 0;
}

function toGearItem(e: { id: string; name: string; category: string; damage_modifier: string | null } | null): CombatantGearItem | null {
  if (!e) return null;
  return { id: e.id, name: e.name, category: e.category, damageModifier: e.damage_modifier };
}

export async function loadPlayModeData(missionId: string) {
  const supabase = await createClient();

  const { data: mission } = await supabase
    .from("missions")
    .select("id, campaign_id, title, subtitle, status, report_text, job_board_mission_id, job_board_missions(setup_text)")
    .eq("id", missionId)
    .maybeSingle();
  if (!mission) return null;

  const roundStateColumns = "mission_id, phase, round_number, active_crew_id, end_round_requested_by, end_round_requested_at";
  const { data: existingRoundState } = await supabase
    .from("mission_round_state")
    .select(roundStateColumns)
    .eq("mission_id", missionId)
    .maybeSingle();

  let roundState = existingRoundState;
  if (!roundState) {
    const { data: inserted, error: insertError } = await supabase
      .from("mission_round_state")
      .insert({ mission_id: missionId })
      .select(roundStateColumns)
      .single();
    if (insertError) {
      const { data: refetched } = await supabase
        .from("mission_round_state")
        .select(roundStateColumns)
        .eq("mission_id", missionId)
        .single();
      roundState = refetched;
    } else {
      roundState = inserted;
    }
  }
  if (!roundState) return null;

  const { data: participants } = await supabase
    .from("mission_participants")
    .select("crew_id, crews(id, name, player_id)")
    .eq("mission_id", missionId);

  const crews = (participants ?? []).map((p) => p.crews).filter((c): c is NonNullable<typeof c> => c !== null);

  const perCrew = await Promise.all(
    crews.map(async (crew): Promise<PlayCombatant[]> => {
      const [{ data: captain }, { data: firstMate }, { data: soldiers }] = await Promise.all([
        supabase
          .from("captains")
          .select(
            "id, name, shoot, fight, armour, health, current_health, is_stunned, weapon_jammed, permanent_injuries, captain_gear(equipment_items(id, name, category, damage_modifier))"
          )
          .eq("crew_id", crew.id)
          .maybeSingle(),
        supabase
          .from("first_mates")
          .select(
            "id, name, shoot, fight, armour, health, current_health, is_stunned, weapon_jammed, permanent_injuries, first_mate_gear(equipment_items(id, name, category, damage_modifier))"
          )
          .eq("crew_id", crew.id)
          .maybeSingle(),
        supabase
          .from("soldiers")
          .select(
            "id, name, is_robot, current_health, is_stunned, weapon_jammed, permanent_injuries, soldier_types(name, shoot, fight, armour, health, soldier_type_gear(equipment_items(id, name, category, damage_modifier))), bonus_gear:equipment_items(id, name, category, damage_modifier)"
          )
          .eq("crew_id", crew.id)
          .order("sort_order"),
      ]);

      const combatants: PlayCombatant[] = [];

      if (captain) {
        combatants.push({
          kind: "captain",
          id: captain.id,
          crewId: crew.id,
          crewName: crew.name,
          name: captain.name,
          shoot: captain.shoot,
          fight: captain.fight,
          armour: captain.armour,
          health: captain.health,
          currentHealth: captain.current_health,
          isRobot: false,
          isStunned: captain.is_stunned,
          weaponJammed: captain.weapon_jammed,
          lostEyeStacks: lostEyeStacksFrom(captain.permanent_injuries),
          gear: (captain.captain_gear ?? []).map((g) => toGearItem(g.equipment_items)).filter((g): g is CombatantGearItem => g !== null),
        });
      }

      if (firstMate) {
        combatants.push({
          kind: "first_mate",
          id: firstMate.id,
          crewId: crew.id,
          crewName: crew.name,
          name: firstMate.name,
          shoot: firstMate.shoot,
          fight: firstMate.fight,
          armour: firstMate.armour,
          health: firstMate.health,
          currentHealth: firstMate.current_health,
          isRobot: false,
          isStunned: firstMate.is_stunned,
          weaponJammed: firstMate.weapon_jammed,
          lostEyeStacks: lostEyeStacksFrom(firstMate.permanent_injuries),
          gear: (firstMate.first_mate_gear ?? [])
            .map((g) => toGearItem(g.equipment_items))
            .filter((g): g is CombatantGearItem => g !== null),
        });
      }

      for (const soldier of soldiers ?? []) {
        if (!soldier.soldier_types) continue;
        const gear: CombatantGearItem[] = [];
        for (const g of soldier.soldier_types.soldier_type_gear ?? []) {
          const item = toGearItem(g.equipment_items);
          if (item) gear.push(item);
        }
        const bonusItem = toGearItem(soldier.bonus_gear);
        if (bonusItem) gear.push(bonusItem);

        combatants.push({
          kind: "soldier",
          id: soldier.id,
          crewId: crew.id,
          crewName: crew.name,
          name: soldier.name ?? soldier.soldier_types.name,
          shoot: soldier.soldier_types.shoot,
          fight: soldier.soldier_types.fight,
          armour: soldier.soldier_types.armour,
          health: soldier.soldier_types.health,
          currentHealth: soldier.current_health,
          isRobot: soldier.is_robot,
          isStunned: soldier.is_stunned,
          weaponJammed: soldier.weapon_jammed,
          lostEyeStacks: lostEyeStacksFrom(soldier.permanent_injuries),
          gear,
        });
      }

      return combatants;
    })
  );

  const [{ data: combatLog }, { data: crewSessionResults }] = await Promise.all([
    supabase
      .from("mission_combat_log")
      .select(
        "id, round_number, shooter_crew_id, target_crew_id, target_died, damage, result, attack_type, shooter_kind, target_kind, created_at"
      )
      .eq("mission_id", missionId)
      .order("created_at", { ascending: false }),
    supabase
      .from("crew_session_results")
      .select("id, crew_id, xp_delta, credits_delta, loot_notes, injury_notes, members_lost")
      .eq("mission_id", missionId),
  ]);

  return {
    mission,
    roundState,
    crews,
    combatants: perCrew.flat(),
    combatLog: combatLog ?? [],
    crewSessionResults: crewSessionResults ?? [],
  };
}

export type PlayModeData = NonNullable<Awaited<ReturnType<typeof loadPlayModeData>>>;
