"use client";

import { useActionState } from "react";
import { signInWithMagicLink } from "@/lib/supabase/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInWithMagicLink, undefined);

  if (state?.success) {
    return (
      <p className="rounded-md border border-border bg-bg-surface px-4 py-3 text-sm text-text-default">
        Link verschickt — check deinen Posteingang.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input
        type="email"
        name="email"
        required
        placeholder="du@beispiel.com"
        className="rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
      />
      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Sende Link…" : "Login-Link senden"}
      </button>
    </form>
  );
}
