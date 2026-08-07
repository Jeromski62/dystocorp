// Figma "Dysto-Corp-Rough-Concept" Dossier redesign (node 2150:807): a
// segmented health bar (one tick per HP point) with the label/value row
// above it. Read-only callers (crew read view) omit `onAdjust` and get just
// the label + bar; Play Mode's roster tile passes it to get the -/+ buttons
// wired to the same manual HP correction the round HUD already had.
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
          <span className="font-display text-sm font-semibold tracking-[1.4px] text-text-default">
            {currentHealth} / {health}
          </span>
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
