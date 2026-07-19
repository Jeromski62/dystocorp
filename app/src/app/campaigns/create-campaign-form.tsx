"use client";

import { useActionState } from "react";
import { createCampaign } from "./actions";

export function CreateCampaignForm() {
  const [state, action, pending] = useActionState(createCampaign, undefined);

  return (
    <form action={action} className="mt-3 flex flex-col gap-2">
      <input
        type="text"
        name="name"
        required
        placeholder="Kampagnenname"
        className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
      />
      <textarea
        name="description"
        placeholder="Beschreibung (optional)"
        rows={2}
        className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
      />
      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Erstelle…" : "Kampagne erstellen"}
      </button>
    </form>
  );
}
