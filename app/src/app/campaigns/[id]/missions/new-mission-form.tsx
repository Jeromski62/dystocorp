"use client";

import { useState, useTransition } from "react";
import { createMission } from "./actions";

export function NewMissionForm({ campaignId }: { campaignId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createMission(campaignId, title, description.trim() || null);
      if (result.error) setError(result.error);
      else {
        setTitle("");
        setDescription("");
      }
    });
  }

  return (
    <div className="rounded-md border border-border bg-bg-surface p-4">
      <h2 className="text-sm font-semibold text-text-default">Nächste Mission planen</h2>
      <div className="mt-3 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Was steht an? (optional)"
          rows={2}
          className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button
          type="button"
          disabled={pending || !title.trim()}
          onClick={handleSubmit}
          className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Speichere…" : "Mission anlegen"}
        </button>
      </div>
    </div>
  );
}
