"use client";

import { useState, useTransition } from "react";
import { createMission } from "./actions";
import { Button } from "@/components/ui/button";

const MISSION_TITLE_MAX_LENGTH = 30;

export function NewMissionForm({ campaignId }: { campaignId: string }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createMission(campaignId, title, subtitle.trim() || null, description.trim() || null);
      if (result.error) setError(result.error);
      else {
        setTitle("");
        setSubtitle("");
        setDescription("");
      }
    });
  }

  return (
    <div className="rounded-md border border-border bg-bg-surface p-4">
      <h2 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Nächste Mission planen"}</h2>
      <div className="mt-3 flex flex-col gap-2">
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titel"
            maxLength={MISSION_TITLE_MAX_LENGTH}
            className="w-full rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
          />
          <p className="mt-1 text-right font-mono text-[11px] text-text-subtle">
            {title.length}/{MISSION_TITLE_MAX_LENGTH}
          </p>
        </div>
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Untertitel (optional)"
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
