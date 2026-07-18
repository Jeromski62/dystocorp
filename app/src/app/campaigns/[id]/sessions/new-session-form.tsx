"use client";

import { useState, useTransition } from "react";
import { createSessionLogEntry } from "./actions";

export function NewSessionForm({ campaignId }: { campaignId: string }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createSessionLogEntry(campaignId, title, date, notes.trim() || null);
      if (result.error) setError(result.error);
      else {
        setTitle("");
        setNotes("");
      }
    });
  }

  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-foreground">Neuer Spielabend</h2>
      <div className="mt-3 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel (z.B. Missionsname)"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notizen / Mission Report (optional)"
          rows={3}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button
          type="button"
          disabled={pending || !title.trim()}
          onClick={handleSubmit}
          className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Speichere…" : "Session anlegen"}
        </button>
      </div>
    </div>
  );
}
