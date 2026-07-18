"use client";

import { useState, useTransition } from "react";
import { saveCrewSessionResult } from "./actions";

type ExistingResult = {
  xpDelta: number;
  creditsDelta: number;
  lootNotes: string | null;
  injuryNotes: string | null;
  membersLost: string | null;
};

export function CrewResultForm({
  campaignId,
  sessionLogEntryId,
  crewId,
  crewName,
  existing,
}: {
  campaignId: string;
  sessionLogEntryId: string;
  crewId: string;
  crewName: string;
  existing: ExistingResult | null;
}) {
  const [editing, setEditing] = useState(!existing);
  const [xpDelta, setXpDelta] = useState(existing?.xpDelta ?? 0);
  const [creditsDelta, setCreditsDelta] = useState(existing?.creditsDelta ?? 0);
  const [lootNotes, setLootNotes] = useState(existing?.lootNotes ?? "");
  const [injuryNotes, setInjuryNotes] = useState(existing?.injuryNotes ?? "");
  const [membersLost, setMembersLost] = useState(existing?.membersLost ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveCrewSessionResult({
        campaignId,
        sessionLogEntryId,
        crewId,
        xpDelta,
        creditsDelta,
        lootNotes: lootNotes.trim() || null,
        injuryNotes: injuryNotes.trim() || null,
        membersLost: membersLost.trim() || null,
      });
      if (result.error) setError(result.error);
      else setEditing(false);
    });
  }

  if (!editing && existing) {
    return (
      <div className="rounded-md border border-accent/40 bg-surface-raised p-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">{crewName} (deine Crew)</span>
          <button type="button" onClick={() => setEditing(true)} className="text-xs text-muted hover:text-accent">
            Bearbeiten
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">
          {existing.xpDelta >= 0 ? "+" : ""}
          {existing.xpDelta} XP · {existing.creditsDelta >= 0 ? "+" : ""}
          {existing.creditsDelta}cr
        </p>
        {existing.lootNotes ? <p className="mt-1 text-xs text-muted">Loot: {existing.lootNotes}</p> : null}
        {existing.injuryNotes ? <p className="mt-1 text-xs text-muted">Verletzungen: {existing.injuryNotes}</p> : null}
        {existing.membersLost ? <p className="mt-1 text-xs text-muted">Verluste: {existing.membersLost}</p> : null}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-accent/40 bg-surface-raised p-3">
      <p className="text-sm font-medium text-foreground">Ergebnis für {crewName} (deine Crew)</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <label className="text-xs text-muted">
          XP-Delta
          <input
            type="number"
            value={xpDelta}
            onChange={(e) => setXpDelta(Number(e.target.value))}
            className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </label>
        <label className="text-xs text-muted">
          Credits-Delta
          <input
            type="number"
            value={creditsDelta}
            onChange={(e) => setCreditsDelta(Number(e.target.value))}
            className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </label>
      </div>
      <label className="mt-2 block text-xs text-muted">
        Loot
        <input
          value={lootNotes}
          onChange={(e) => setLootNotes(e.target.value)}
          className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </label>
      <label className="mt-2 block text-xs text-muted">
        Verletzungen
        <input
          value={injuryNotes}
          onChange={(e) => setInjuryNotes(e.target.value)}
          className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </label>
      <label className="mt-2 block text-xs text-muted">
        Verluste (Soldiers etc.)
        <input
          value={membersLost}
          onChange={(e) => setMembersLost(e.target.value)}
          className="mt-0.5 w-full rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </label>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={handleSave}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Speichere…" : "Speichern"}
        </button>
        {existing ? (
          <button type="button" onClick={() => setEditing(false)} className="text-sm text-muted hover:text-foreground">
            Abbrechen
          </button>
        ) : null}
      </div>
    </div>
  );
}
