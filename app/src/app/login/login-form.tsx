"use client";

import { useActionState } from "react";
import { signInWithMagicLink } from "@/lib/supabase/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInWithMagicLink, undefined);

  if (state?.success) {
    return (
      <p className="w-full border border-border bg-bg-input px-4 py-3 font-mono text-[15px] tracking-[0.06em] text-text-default">
        LINK VERSCHICKT — POSTEINGANG PRÜFEN
      </p>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-3">
      <p className="font-mono text-[14px] tracking-[0.1em] text-text-secondary">SICHERE_KENNUNG // EMAIL</p>
      <input
        type="email"
        name="email"
        required
        placeholder="du@beispiel.com"
        className="border border-border bg-bg-input px-4 py-3.5 font-mono text-base text-text-default placeholder:text-text-subtle focus:border-accent focus:outline-none"
      />
      {state?.error ? <p className="font-mono text-xs text-danger">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-1.5 flex h-11 items-center justify-center bg-cta-bg px-4 font-display text-[19px] font-semibold tracking-[0.08em] text-cta-foreground uppercase transition-[background-color,box-shadow] [box-shadow:0_0_0_1px_rgba(255,255,255,0.9),0_0_26px_rgba(255,255,255,0.22)] hover:bg-cta-bg-hover hover:[box-shadow:0_0_0_1px_#fff,0_0_36px_rgba(255,255,255,0.42)] disabled:opacity-50"
      >
        {pending ? "Sende Link…" : "Magic Link senden"}
      </button>
    </form>
  );
}
