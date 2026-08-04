"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";

export type CombatantKind = "captain" | "first_mate" | "soldier";

// -- Round Sequence container (PRD Phase 2, steps 8-11) --------------------
// Deliberately minimal: no activation-order/action-economy enforcement
// (that's the separate, still-unwritten Round Sequence detail PRD). All of
// these only touch `mission_round_state`, which is Realtime-subscribed on
// the client (use-realtime-row.ts) -- no revalidatePath needed, every
// subscriber (including the caller) picks up the change from the broadcast.

export async function startRoundSequence(missionId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { error } = await supabase
    .from("mission_round_state")
    .update({ phase: "round", round_number: 1 })
    .eq("mission_id", missionId);
  if (error) return { error: error.message };
  return {};
}

export async function setActiveCrew(missionId: string, crewId: string | null): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("mission_round_state").update({ active_crew_id: crewId }).eq("mission_id", missionId);
  if (error) return { error: error.message };
  return {};
}

export async function requestEndRound(missionId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { error } = await supabase
    .from("mission_round_state")
    .update({ end_round_requested_by: user.id, end_round_requested_at: new Date().toISOString() })
    .eq("mission_id", missionId);
  if (error) return { error: error.message };
  return {};
}

export async function cancelEndRoundRequest(missionId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("mission_round_state")
    .update({ end_round_requested_by: null, end_round_requested_at: null })
    .eq("mission_id", missionId);
  if (error) return { error: error.message };
  return {};
}

export async function confirmEndRound(missionId: string): Promise<{ error?: string }> {
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

  const { error } = await supabase
    .from("mission_round_state")
    .update({
      round_number: state.round_number + 1,
      end_round_requested_by: null,
      end_round_requested_at: null,
    })
    .eq("mission_id", missionId);
  if (error) return { error: error.message };
  return {};
}

export async function markLastRound(missionId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("mission_round_state").update({ phase: "debrief" }).eq("mission_id", missionId);
  if (error) return { error: error.message };
  return {};
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
  campaignId: string;
}): Promise<{ error?: string }> {
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

  revalidatePath(`/campaigns/${input.campaignId}/missions/${input.missionId}/play`);
  return {};
}

export async function adjustCombatantHealth(input: {
  missionId: string;
  crewId: string;
  kind: CombatantKind;
  id: string;
  delta: number;
  campaignId: string;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("adjust_combatant_health", {
    p_mission_id: input.missionId,
    p_crew_id: input.crewId,
    p_kind: input.kind,
    p_id: input.id,
    p_delta: input.delta,
  });
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${input.campaignId}/missions/${input.missionId}/play`);
  return {};
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

export async function resolveShootingAction(input: ResolveShootingActionInput): Promise<{ error?: string }> {
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

  revalidatePath(`/campaigns/${input.campaignId}/missions/${input.missionId}/play`);
  return {};
}
