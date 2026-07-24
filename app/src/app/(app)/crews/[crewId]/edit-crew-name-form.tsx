"use client";

import { useState, useTransition } from "react";
import { updateCrewName } from "./actions";
import { Button } from "@/components/button";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      <Input
        value={nameValue}
        onChange={(e) => setNameValue(e.target.value)}
        autoFocus
        className="h-auto border-corp-border bg-corp-surface px-3 py-2 text-lg font-semibold text-text-default focus-visible:border-corp-accent focus-visible:ring-corp-accent/50"
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex items-center gap-3">
        <Button type="button" disabled={pending} onClick={handleSave} className="self-start">
          {pending ? "Speichere…" : "Speichern"}
        </Button>
        <ShadcnButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditing(false);
            setNameValue(name);
          }}
        >
          Abbrechen
        </ShadcnButton>
      </div>
    </div>
  );
}
