"use client";

import { useActionState } from "react";
import { signInWithMagicLink } from "@/lib/supabase/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInWithMagicLink, undefined);

  if (state?.success) {
    return (
      <p className="w-full border border-border bg-bg-input px-4 py-3 font-mono text-[11px] tracking-[0.06em] text-text-default">
        LINK VERSCHICKT — POSTEINGANG PRÜFEN
      </p>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-3">
      <p className="font-mono text-[10.5px] tracking-[0.1em] text-text-secondary">SICHERE_KENNUNG // EMAIL</p>
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
        className="mt-1.5 bg-cta-bg px-4 py-4 font-display text-[17px] font-semibold tracking-[0.08em] text-cta-foreground uppercase transition-[background-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] [box-shadow:0_0_0_1px_rgba(255,255,255,0.9),0_0_26px_rgba(255,255,255,0.22)] hover:bg-cta-bg-hover hover:[box-shadow:0_0_0_1px_#fff,0_0_36px_rgba(255,255,255,0.42)] disabled:opacity-50"
      >
        {pending ? "Sende Link…" : "Magic Link senden"}
      </button>
    </form>
  );
}
