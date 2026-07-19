"use client";

import { useActionState } from "react";
import { joinCampaign } from "./actions";

export function JoinCampaignForm() {
  const [state, action, pending] = useActionState(joinCampaign, undefined);

  return (
    <form action={action} className="mt-3 flex flex-col gap-2">
      <input
        type="text"
        name="campaign_id"
        required
        placeholder="Kampagnen-ID"
        className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
      />
      {state?.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md border border-border px-3 py-2 text-sm font-medium text-text-default hover:border-accent disabled:opacity-50"
      >
        {pending ? "Trete bei…" : "Beitreten"}
      </button>
    </form>
  );
}
