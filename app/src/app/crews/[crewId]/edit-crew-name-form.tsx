"use client";

import { useState, useTransition } from "react";
import { updateCrewName } from "./actions";

export function EditCrewNameForm({ crewId, name }: { crewId: string; name: string }) {
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateCrewName(crewId, nameValue);
      if (result.error) setError(result.error);
      else setEditing(false);
    });
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="font-display text-2xl tracking-[2.5px] text-text-default">{name}</h1>
        <button type="button" onClick={() => setEditing(true)} className="text-xs text-text-secondary hover:text-corp-accent">
          Bearbeiten
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        autoFocus
        className="rounded-md border border-corp-border bg-corp-surface px-3 py-2 text-lg font-semibold text-text-default focus:border-corp-accent focus:outline-none"
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={handleSave}
          className="self-start rounded-md bg-corp-accent px-3 py-1.5 text-sm font-medium text-corp-on-accent hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Speichere…" : "Speichern"}
        </button>
        <button
          type="button"
          onClick={() => {
            setEditing(false);
            setNameValue(name);
          }}
          className="text-sm text-text-secondary hover:text-text-default"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}
