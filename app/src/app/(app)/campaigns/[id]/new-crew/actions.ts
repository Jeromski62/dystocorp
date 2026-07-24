"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCrew(campaignId: string | null, corpId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: crew, error } = await supabase
    .from("crews")
    .insert({ campaign_id: campaignId, player_id: user.id, corp_id: corpId })
    .select("id")
    .single();

  if (error || !crew) {
    redirect(campaignId ? `/campaigns/${campaignId}?error=crew-exists` : "/crews?error=crew-exists");
  }

  redirect(`/crews/${crew.id}`);
}
