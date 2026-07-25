"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateCampaign(
  campaignId: string,
  name: string,
  description: string | null
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  if (!name.trim()) return { error: "Bitte einen Namen angeben." };

  const { error } = await supabase
    .from("campaigns")
    .update({ name: name.trim(), description })
    .eq("id", campaignId);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath("/campaigns");
  return {};
}

export async function setCampaignArchived(campaignId: string, archived: boolean): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { error } = await supabase
    .from("campaigns")
    .update({ archived_at: archived ? new Date().toISOString() : null })
    .eq("id", campaignId);
  if (error) return { error: error.message };

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath("/campaigns");
  return {};
}

export async function importCrewIntoCampaign(campaignId: string, crewId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { data: crew } = await supabase.from("crews").select("id, player_id, campaign_id").eq("id", crewId).maybeSingle();
  if (!crew || crew.player_id !== user.id) return { error: "Team nicht gefunden." };
  if (crew.campaign_id) return { error: "Dieses Team gehört bereits zu einer Kampagne." };

  const { error } = await supabase.from("crews").update({ campaign_id: campaignId }).eq("id", crewId);
  if (error) {
    return { error: error.code === "23505" ? "Du hast bereits ein Team in dieser Kampagne." : error.message };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath("/crews");
  revalidatePath("/");
  return {};
}

export async function deleteCampaign(campaignId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  const { error } = await supabase.from("campaigns").delete().eq("id", campaignId);
  if (error) return { error: error.message };

  revalidatePath("/campaigns");
  revalidatePath("/crews");
  revalidatePath("/");
  redirect("/campaigns");
}
