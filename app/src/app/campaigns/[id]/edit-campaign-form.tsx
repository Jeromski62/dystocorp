"use client";

import { useState, useTransition } from "react";
import { updateCampaign } from "./actions";

export function EditCampaignForm({
  campaignId,
  name,
  description,
}: {
  campaignId: string;
  name: string;
  description: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [descriptionValue, setDescriptionValue] = useState(description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateCampaign(campaignId, nameValue, descriptionValue.trim() || null);
      if (result.error) setError(result.error);
      else setEditing(false);
    });
  }

  if (!editing) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-text-default">{name}</h1>
          <button type="button" onClick={() => setEditing(true)} className="text-xs text-text-secondary hover:text-accent">
            Bearbeiten
          </button>
        </div>
        {description ? <p className="mt-1 text-sm text-text-secondary">{description}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        className="rounded-md border border-border bg-bg-surface px-3 py-2 text-lg font-semibold text-text-default focus:border-accent focus:outline-none"
      />
      <textarea
        value={descriptionValue}
        onChange={(e) => setDescriptionValue(e.target.value)}
        placeholder="Beschreibung (optional)"
        rows={2}
        className="rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={handleSave}
          className="self-start rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Speichere…" : "Speichern"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setNameValue(name);
            setDescriptionValue(description ?? "");
          }}
          className="text-sm text-text-secondary hover:text-text-default"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}
