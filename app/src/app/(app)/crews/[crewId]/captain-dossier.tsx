const STAT_COLUMNS = ["move", "fight", "shoot", "armour", "will", "health"] as const;
const STAT_LABELS: Record<(typeof STAT_COLUMNS)[number], string> = {
  move: "MOVE",
  fight: "FIGHT",
  shoot: "SHOOT",
  armour: "ARM",
  will: "WILL",
  health: "HP",
};

type Captain = {
  name: string;
  level: number;
  move: number;
  fight: number;
  shoot: number;
  armour: number;
  will: number;
  health: number;
  current_health: number;
};

// Read-only summary of the captain's current combat stats, shown above the
// edit-mode tabs (Captain/First Mate/Soldiers/Ship) — a snapshot, not a form.
export function CaptainDossier({ captain, backgroundName }: { captain: Captain; backgroundName: string | null }) {
  const healthPct = Math.max(0, Math.min(100, (captain.current_health / captain.health) * 100));

  return (
    <div className="border border-corp-accent/28 border-t-2 border-t-corp-accent bg-corp-surface p-4">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Captain-Dossier</span>
        <span className="font-mono text-[14px] text-corp-accent">LV {captain.level}</span>
      </div>
      <p className="mt-2 font-display text-xl font-semibold tracking-[0.05em] text-text-default">{captain.name}</p>
      {backgroundName ? <p className="mt-0.5 font-mono text-[14px] text-text-subtle">{backgroundName}</p> : null}

      <div className="mt-3 flex items-baseline justify-between font-mono text-[14px] text-text-secondary uppercase">
        <span>Health</span>
        <span>
          {captain.current_health} / {captain.health}
        </span>
      </div>
      <div className="mt-1 h-[7px] border border-corp-accent/22 bg-black/40">
        <div className="h-full bg-corp-accent" style={{ width: `${healthPct}%` }} />
      </div>

      <div className="mt-3.5 grid grid-cols-6 gap-2">
        {STAT_COLUMNS.map((stat) => (
          <div key={stat}>
            <p className="font-mono text-[14px] text-text-subtle">{STAT_LABELS[stat]}</p>
            <p className="font-display text-base font-bold text-text-default">
              {stat === "fight" || stat === "shoot" || stat === "will" ? `+${captain[stat]}` : captain[stat]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
