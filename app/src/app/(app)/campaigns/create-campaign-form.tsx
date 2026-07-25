"use client";

import { useActionState } from "react";
import { createCampaign } from "./actions";
import { Button } from "@/components/ui/button";

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
      <Button type="submit" variant="cta" disabled={pending} className="self-start">
        {pending ? "Erstelle…" : "Kampagne erstellen"}
      </Button>
    </form>
  );
}
