"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createSessionLogEntry(
  campaignId: string,
  title: string,
  sessionDate: string,
  notes: string | null
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  if (!title.trim()) return { error: "Bitte einen Titel angeben." };

  const { error } = await supabase.from("session_log_entries").insert({
    campaign_id: campaignId,
    title: title.trim(),
    session_date: sessionDate,
    notes,
    created_by: user.id,
  });
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${campaignId}/sessions`);
  return {};
}

export async function saveCrewSessionResult(input: {
  campaignId: string;
  sessionLogEntryId: string;
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
    .eq("session_log_entry_id", input.sessionLogEntryId)
    .eq("crew_id", input.crewId)
    .maybeSingle();

  const xpDiff = input.xpDelta - (existing?.xp_delta ?? 0);
  const creditsDiff = input.creditsDelta - (existing?.credits_delta ?? 0);

  const { error: upsertError } = await supabase.from("crew_session_results").upsert(
    {
      id: existing?.id,
      session_log_entry_id: input.sessionLogEntryId,
      crew_id: input.crewId,
      xp_delta: input.xpDelta,
      credits_delta: input.creditsDelta,
      loot_notes: input.lootNotes,
      injury_notes: input.injuryNotes,
      members_lost: input.membersLost,
    },
    { onConflict: "session_log_entry_id,crew_id" }
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

  revalidatePath(`/campaigns/${input.campaignId}/sessions`);
  revalidatePath(`/crews/${input.crewId}`);
  return {};
}
