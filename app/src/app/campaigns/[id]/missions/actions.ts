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

  const { error } = await supabase.from("missions").update({ status: "ongoing" }).eq("id", missionId);
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
