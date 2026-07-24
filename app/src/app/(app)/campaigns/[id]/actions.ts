"use server";

import { revalidatePath } from "next/cache";
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
