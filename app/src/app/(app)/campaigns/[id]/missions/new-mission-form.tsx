"use client";

import { useState, useTransition } from "react";
import { createMission } from "./actions";
import { Button } from "@/components/button";

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
      <h2 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Nächste Mission planen"}</h2>
      <div className="mt-3 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Was steht an? (optional)"
          rows={2}
          className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="button" disabled={pending || !title.trim()} onClick={handleSubmit} className="self-start">
          {pending ? "Speichere…" : "Mission anlegen"}
        </Button>
      </div>
    </div>
  );
}
