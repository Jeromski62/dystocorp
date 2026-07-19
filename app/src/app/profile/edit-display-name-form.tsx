"use client";

import { useState, useTransition } from "react";
import { updateDisplayName } from "./actions";

export function EditDisplayNameForm({ name }: { name: string }) {
  const [nameValue, setNameValue] = useState(name);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateDisplayName(nameValue);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="display-name" className="text-xs uppercase tracking-wide text-text-secondary">
        Anzeigename
      </label>
      <input
        id="display-name"
        value={nameValue}
        onChange={(e) => {
          setNameValue(e.target.value);
          setSaved(false);
        }}
        className="max-w-sm rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-default focus:border-accent focus:outline-none"
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending || !nameValue.trim()}
          onClick={handleSave}
          className="self-start rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Speichere…" : "Speichern"}
        </button>
        {saved ? <span className="text-sm text-accent">Gespeichert.</span> : null}
      </div>
    </div>
  );
}
