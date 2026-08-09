"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";

export type CombatantKind = "captain" | "first_mate" | "soldier";

const TABLE_FOR_KIND: Record<CombatantKind, "captains" | "first_mates" | "soldiers"> = {
  captain: "captains",
  first_mate: "first_mates",
  soldier: "soldiers",
};

export type CombatantStateRow = { id: string; current_health: number; is_stunned: boolean; weapon_jammed: boolean };

// -- Round Sequence container (PRD Phase 2, steps 8-11) --------------------
// Deliberately minimal: no activation-order/action-economy enforcement
// (that's the separate, still-unwritten Round Sequence detail PRD).
//
// Each of these returns the updated row so the *acting* client can apply it
// to its own local state immediately (see useRealtimeRow) instead of
// depending entirely on the Realtime broadcast round-tripping back to
// itself -- that broadcast is still what delivers the update to the other
// player, but waiting on it for your own click made a successful write look
// like a no-op if the broadcast was slow (or, if Realtime were ever
// misconfigured, made it look completely broken).
export type RoundStateRow = {
  mission_id: string;
  phase: string;
  round_number: number;
  end_round_requested_by: string | null;
  end_round_requested_at: string | null;
};

const ROUND_STATE_COLUMNS = "mission_id, phase, round_number, end_round_requested_by, end_round_requested_at";

export async function startRoundSequence(missionId: string): Promise<{ error?: string; data?: RoundStateRow }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { data, error } = await supabase
    .from("mission_round_state")
    .update({ phase: "round", round_number: 1 })
    .eq("mission_id", missionId)
    .select(ROUND_STATE_COLUMNS)
    .single();
  if (error) return { error: error.message };
  return { data };
}

export async function requestEndRound(missionId: string): Promise<{ error?: string; data?: RoundStateRow }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { data, error } = await supabase
    .from("mission_round_state")
    .update({ end_round_requested_by: user.id, end_round_requested_at: new Date().toISOString() })
    .eq("mission_id", missionId)
    .select(ROUND_STATE_COLUMNS)
    .single();
  if (error) return { error: error.message };
  return { data };
}

export async function cancelEndRoundRequest(missionId: string): Promise<{ error?: string; data?: RoundStateRow }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mission_round_state")
    .update({ end_round_requested_by: null, end_round_requested_at: null })
    .eq("mission_id", missionId)
    .select(ROUND_STATE_COLUMNS)
    .single();
  if (error) return { error: error.message };
  return { data };
}

export async function confirmEndRound(missionId: string): Promise<{ error?: string; data?: RoundStateRow }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { data: state } = await supabase
    .from("mission_round_state")
    .select("round_number, end_round_requested_by")
    .eq("mission_id", missionId)
    .maybeSingle();
  if (!state?.end_round_requested_by) return { error: "Niemand hat das Rundenende angefragt." };
  if (state.end_round_requested_by === user.id) {
    return { error: "Das Rundenende muss von der anderen Person bestätigt werden." };
  }

  const { data, error } = await supabase
    .from("mission_round_state")
    .update({
      round_number: state.round_number + 1,
      end_round_requested_by: null,
      end_round_requested_at: null,
    })
    .eq("mission_id", missionId)
    .select(ROUND_STATE_COLUMNS)
    .single();
  if (error) return { error: error.message };
  return { data };
}

// Combat log/session results (Debrief) come from the initial page load and
// are no longer kept fresh incidentally by a revalidatePath on every health/
// status/shooting action during the round (see adjustCombatantHealth et al.
// above) -- so this transition, which fires once per mission rather than
// once per click, has to revalidate explicitly instead.
export async function markLastRound(campaignId: string, missionId: string): Promise<{ error?: string; data?: RoundStateRow }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mission_round_state")
    .update({ phase: "debrief" })
    .eq("mission_id", missionId)
    .select(ROUND_STATE_COLUMNS)
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/campaigns/${campaignId}/missions/${missionId}/play`);
  return { data };
}

// -- Combatant status (manual clear, since full activation bookkeeping is
// out of scope) --------------------------------------------------------

export async function setCombatantStatus(input: {
  missionId: string;
  crewId: string;
  kind: CombatantKind;
  id: string;
  isStunned: boolean;
  weaponJammed: boolean;
}): Promise<{ error?: string; row?: CombatantStateRow }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_combatant_status", {
    p_mission_id: input.missionId,
    p_crew_id: input.crewId,
    p_kind: input.kind,
    p_id: input.id,
    p_is_stunned: input.isStunned,
    p_weapon_jammed: input.weaponJammed,
  });
  if (error) return { error: error.message };

  const { data: row, error: selectError } = await supabase
    .from(TABLE_FOR_KIND[input.kind])
    .select("id, current_health, is_stunned, weapon_jammed")
    .eq("id", input.id)
    .single();
  if (selectError) return { error: selectError.message };
  return { row };
}

export async function adjustCombatantHealth(input: {
  missionId: string;
  crewId: string;
  kind: CombatantKind;
  id: string;
  delta: number;
}): Promise<{ error?: string; row?: CombatantStateRow }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("adjust_combatant_health", {
    p_mission_id: input.missionId,
    p_crew_id: input.crewId,
    p_kind: input.kind,
    p_id: input.id,
    p_delta: input.delta,
  });
  if (error) return { error: error.message };

  const { data: row, error: selectError } = await supabase
    .from(TABLE_FOR_KIND[input.kind])
    .select("id, current_health, is_stunned, weapon_jammed")
    .eq("id", input.id)
    .single();
  if (selectError) return { error: selectError.message };
  return { row };
}

// -- Aim Assist resolution --------------------------------------------------

export type ResolveShootingActionInput = {
  campaignId: string;
  missionId: string;
  roundNumber: number;
  shooterCrewId: string;
  shooterKind: CombatantKind;
  shooterId: string;
  targetCrewId: string | null;
  targetKind: CombatantKind | null;
  targetId: string | null;
  attackType: "standard" | "flamethrower" | "grenade_fragmentation";
  weaponEquipmentItemId: string | null;
  rollDetails: Json;
  result: "hit" | "miss";
  damage: number | null;
  targetBecomesStunned: boolean;
  targetBecomesWounded: boolean;
  targetDied: boolean;
  shooterWeaponJammed: boolean;
};

export type ResolveShootingActionResult = {
  error?: string;
  shooter?: { kind: CombatantKind; row: CombatantStateRow };
  target?: { kind: CombatantKind; row: CombatantStateRow } | null;
};

export async function resolveShootingAction(input: ResolveShootingActionInput): Promise<ResolveShootingActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { error } = await supabase.rpc("apply_shooting_resolution", {
    p_mission_id: input.missionId,
    p_round_number: input.roundNumber,
    p_shooter_crew_id: input.shooterCrewId,
    p_shooter_kind: input.shooterKind,
    p_shooter_id: input.shooterId,
    p_target_crew_id: input.targetCrewId,
    p_target_kind: input.targetKind,
    p_target_id: input.targetId,
    p_attack_type: input.attackType,
    p_weapon_equipment_item_id: input.weaponEquipmentItemId,
    p_roll_details: input.rollDetails,
    p_result: input.result,
    p_damage: input.damage,
    p_target_becomes_stunned: input.targetBecomesStunned,
    p_target_becomes_wounded: input.targetBecomesWounded,
    p_target_died: input.targetDied,
    p_shooter_weapon_jammed: input.shooterWeaponJammed,
  });
  if (error) return { error: error.message };

  const { data: shooterRow, error: shooterSelectError } = await supabase
    .from(TABLE_FOR_KIND[input.shooterKind])
    .select("id, current_health, is_stunned, weapon_jammed")
    .eq("id", input.shooterId)
    .single();
  if (shooterSelectError) return { error: shooterSelectError.message };

  let target: ResolveShootingActionResult["target"] = null;
  if (input.targetId && input.targetKind) {
    const { data: targetRow, error: targetSelectError } = await supabase
      .from(TABLE_FOR_KIND[input.targetKind])
      .select("id, current_health, is_stunned, weapon_jammed")
      .eq("id", input.targetId)
      .single();
    if (targetSelectError) return { error: targetSelectError.message };
    target = { kind: input.targetKind, row: targetRow };
  }

  return { shooter: { kind: input.shooterKind, row: shooterRow }, target };
}
