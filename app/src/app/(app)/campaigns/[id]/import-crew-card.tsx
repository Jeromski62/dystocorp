"use client";

import { useState, useTransition } from "react";
import { importCrewIntoCampaign } from "./actions";
import { Button } from "@/components/ui/button";

type Crew = { id: string; name: string; corps: { name: string } | null };

export function ImportCrewCard({ campaignId, crews }: { campaignId: string; crews: Crew[] }) {
  const [open, setOpen] = useState(false);
  const [crewId, setCrewId] = useState(crews[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleImport() {
    if (!crewId) return;
    setError(null);
    startTransition(async () => {
      const result = await importCrewIntoCampaign(campaignId, crewId);
      if (result?.error) setError(result.error);
      else setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center border border-dashed border-border p-4 text-center font-display text-sm font-semibold tracking-[0.06em] text-text-secondary uppercase hover:border-accent hover:text-text-default"
      >
        ＋ Bestehende Crew importieren
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 border border-dashed border-border p-4">
      <label className="font-mono text-[14px] tracking-[0.06em] text-text-secondary uppercase">Crew wählen</label>
      <select
        value={crewId}
        onChange={(e) => setCrewId(e.target.value)}
        className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default focus:border-accent focus:outline-none"
      >
        {crews.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
            {c.corps ? ` · ${c.corps.name}` : ""}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex items-center gap-3">
        <Button type="button" disabled={pending} onClick={handleImport} className="self-start">
          {pending ? "Importiere…" : "Importieren"}
        </Button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-text-secondary hover:text-text-default">
          Abbrechen
        </button>
      </div>
    </div>
  );
}
