"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateDisplayName(name: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Nicht eingeloggt." };

  if (!name.trim()) return { error: "Bitte einen Namen angeben." };

  const { error } = await supabase.from("players").update({ display_name: name.trim() }).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/profile");
  return {};
}
