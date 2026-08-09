"use client";

import { useState } from "react";

// Figma "Dysto-Corp-Rough-Concept" Dossier redesign (node 2150:807): a
// segmented health bar (one tick per HP point) with the label/value row
// above it. Read-only callers (crew read view) omit `onAdjust` and get just
// the label + bar; Play Mode's roster tile passes it to get the -/+ buttons
// wired to the same manual HP correction the round HUD already had, plus a
// click-to-edit exact value (still goes through `onAdjust` as a computed
// delta -- there's no separate "set absolute value" action).
export function HealthTracker({
  health,
  currentHealth,
  onAdjust,
  disabled = false,
}: {
  health: number;
  currentHealth: number;
  onAdjust?: (delta: number) => void;
  disabled?: boolean;
}) {
  const segments = Math.max(1, health);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function commitDraft() {
    setEditing(false);
    if (!onAdjust) return;
    const parsed = Number.parseInt(draft, 10);
    if (Number.isNaN(parsed)) return;
    const target = Math.max(0, Math.min(health, parsed));
    if (target !== currentHealth) onAdjust(target - currentHealth);
  }

  return (
    <div className="flex items-start gap-2">
      {onAdjust ? (
        <button
          type="button"
          disabled={disabled || currentHealth <= 0}
          onClick={() => onAdjust(-1)}
          aria-label="HP verringern"
          className="flex size-[34px] shrink-0 items-center justify-center border border-corp-border font-display text-2xl text-text-default hover:border-corp-accent hover:text-corp-accent disabled:opacity-30"
        >
          −
        </button>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Health</span>
          {editing ? (
            <input
              type="number"
              min={0}
              max={health}
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitDraft}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitDraft();
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-14 border border-corp-accent bg-bg-body px-1 text-right font-display text-sm font-semibold tracking-[1.4px] text-text-default"
            />
          ) : onAdjust ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setDraft(String(currentHealth));
                setEditing(true);
              }}
              aria-label="Health-Wert direkt eingeben"
              className="font-display text-sm font-semibold tracking-[1.4px] text-text-default hover:text-corp-accent disabled:opacity-30"
            >
              {currentHealth} / {health}
            </button>
          ) : (
            <span className="font-display text-sm font-semibold tracking-[1.4px] text-text-default">
              {currentHealth} / {health}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-[2px]">
          {Array.from({ length: segments }, (_, i) => (
            <div key={i} className={`h-[4px] min-w-px flex-1 ${i < currentHealth ? "bg-corp-accent" : "bg-corp-accent/20"}`} />
          ))}
        </div>
      </div>

      {onAdjust ? (
        <button
          type="button"
          disabled={disabled || currentHealth >= health}
          onClick={() => onAdjust(1)}
          aria-label="HP erhöhen"
          className="flex size-[34px] shrink-0 items-center justify-center border border-corp-border font-display text-2xl text-text-default hover:border-corp-accent hover:text-corp-accent disabled:opacity-30"
        >
          +
        </button>
      ) : null}
    </div>
  );
}
