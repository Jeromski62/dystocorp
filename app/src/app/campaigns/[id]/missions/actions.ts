"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createMission(
  campaignId: string,
  title: string,
  description: string | null
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  if (!title.trim()) return { error: "Bitte einen Titel angeben." };

  const { error } = await supabase.from("missions").insert({
    campaign_id: campaignId,
    title: title.trim(),
    description,
    created_by: user.id,
  });
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${campaignId}/missions`);
  return {};
}

export async function updateMission(
  missionId: string,
  campaignId: string,
  title: string,
  description: string | null
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  if (!title.trim()) return { error: "Bitte einen Titel angeben." };

  const { error } = await supabase
    .from("missions")
    .update({ title: title.trim(), description })
    .eq("id", missionId);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${campaignId}/missions`);
  return {};
}

export async function startMission(missionId: string, campaignId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { error } = await supabase
    .from("missions")
    .update({ status: "ongoing", session_date: new Date().toISOString().slice(0, 10) })
    .eq("id", missionId);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${campaignId}/missions`);
  return {};
}

export async function submitMissionReport(
  missionId: string,
  campaignId: string,
  reportText: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  if (!reportText.trim()) return { error: "Bitte einen Bericht eingeben." };

  const { error } = await supabase
    .from("missions")
    .update({ status: "report", report_text: reportText.trim() })
    .eq("id", missionId);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${campaignId}/missions`);
  return {};
}

export async function saveCrewMissionResult(input: {
  campaignId: string;
  missionId: string;
  crewId: string;
  xpDelta: number;
  creditsDelta: number;
  lootNotes: string | null;
  injuryNotes: string | null;
  membersLost: string | null;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { data: crew } = await supabase
    .from("crews")
    .select("id, credits, experience, player_id")
    .eq("id", input.crewId)
    .maybeSingle();
  if (!crew || crew.player_id !== user.id) return { error: "Diese Crew gehört dir nicht." };

  const { data: existing } = await supabase
    .from("crew_session_results")
    .select("id, xp_delta, credits_delta")
    .eq("mission_id", input.missionId)
    .eq("crew_id", input.crewId)
    .maybeSingle();

  const xpDiff = input.xpDelta - (existing?.xp_delta ?? 0);
  const creditsDiff = input.creditsDelta - (existing?.credits_delta ?? 0);

  const { error: upsertError } = await supabase.from("crew_session_results").upsert(
    {
      id: existing?.id,
      mission_id: input.missionId,
      crew_id: input.crewId,
      xp_delta: input.xpDelta,
      credits_delta: input.creditsDelta,
      loot_notes: input.lootNotes,
      injury_notes: input.injuryNotes,
      members_lost: input.membersLost,
    },
    { onConflict: "mission_id,crew_id" }
  );
  if (upsertError) return { error: upsertError.message };

  const { error: creditError } = await supabase
    .from("crews")
    .update({
      experience: crew.experience + xpDiff,
      credits: crew.credits + creditsDiff,
    })
    .eq("id", input.crewId);
  if (creditError) return { error: creditError.message };

  revalidatePath(`/campaigns/${input.campaignId}/missions`);
  revalidatePath(`/crews/${input.crewId}`);
  return {};
}
