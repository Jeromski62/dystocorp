"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCampaign(_prevState: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) {
    return { error: "Bitte einen Namen für die Kampagne angeben." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({ name, description, created_by: user.id })
    .select("id")
    .single();

  if (error || !campaign) {
    return { error: error?.message ?? "Kampagne konnte nicht erstellt werden." };
  }

  const { error: memberError } = await supabase
    .from("campaign_members")
    .insert({ campaign_id: campaign.id, player_id: user.id });

  if (memberError) {
    return { error: memberError.message };
  }

  redirect(`/campaigns/${campaign.id}`);
}

export async function joinCampaign(_prevState: unknown, formData: FormData) {
  const campaignId = String(formData.get("campaign_id") ?? "").trim();
  if (!campaignId) {
    return { error: "Bitte eine Kampagnen-ID angeben." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("campaign_members")
    .insert({ campaign_id: campaignId, player_id: user.id });

  if (error) {
    return { error: "Kampagne nicht gefunden oder Beitritt fehlgeschlagen." };
  }

  redirect(`/campaigns/${campaignId}`);
}
