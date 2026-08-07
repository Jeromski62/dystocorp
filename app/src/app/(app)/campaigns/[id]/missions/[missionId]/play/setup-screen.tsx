"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startRoundSequence, type RoundStateRow } from "./actions";

export function SetupScreen({
  missionId,
  setupText,
  onRoundStateChange,
}: {
  missionId: string;
  setupText: string | null;
  onRoundStateChange: (row: RoundStateRow) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStart() {
    setError(null);
    startTransition(async () => {
      const result = await startRoundSequence(missionId);
      if (result.error) setError(result.error);
      else if (result.data) onRoundStateChange(result.data);
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h2 className="font-display text-sm tracking-[2px] text-text-secondary uppercase">Tisch & Umgebung aufbauen</h2>
      {setupText ? (
        <p className="mt-3 whitespace-pre-line text-sm text-text-default">{setupText}</p>
      ) : (
        <p className="mt-3 text-sm text-text-subtle">Diese Mission hat keinen Job aus dem Job Board zugewiesen -- baut den Tisch nach eigenem Ermessen auf.</p>
      )}
      {error ? <p className="mt-3 font-mono text-sm text-danger">{error}</p> : null}
      <Button type="button" disabled={pending} onClick={handleStart} className="mt-6">
        {pending ? "Startet…" : "Erste Runde starten"}
      </Button>
    </div>
  );
}
