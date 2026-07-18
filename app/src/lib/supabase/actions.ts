"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInWithMagicLink(_prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Bitte eine E-Mail-Adresse angeben." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function confirmMagicLink(formData: FormData) {
  const token_hash = String(formData.get("token_hash") ?? "");
  const type = String(formData.get("type") ?? "") as EmailOtpType;
  const next = String(formData.get("next") ?? "/campaigns");

  if (!token_hash || !type) {
    redirect("/auth/auth-code-error");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) {
    redirect("/auth/auth-code-error");
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
