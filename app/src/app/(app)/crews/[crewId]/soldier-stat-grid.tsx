const STAT_COLUMNS = ["move", "fight", "shoot", "armour", "will", "health"] as const;
const STAT_LABELS: Record<(typeof STAT_COLUMNS)[number], string> = {
  move: "MOVE",
  fight: "FIGHT",
  shoot: "SHOOT",
  armour: "ARM",
  will: "WILL",
  health: "HP",
};

type Stats = Record<(typeof STAT_COLUMNS)[number], number>;

// Full six-stat line (MOVE/FIGHT/SHOOT/ARM/WILL/HP), same layout convention
// as CaptainDossier's stat grid — reused wherever a soldier's or soldier
// type's full statline needs to be shown (recruiter, roster, read-only view).
export function SoldierStatGrid({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {STAT_COLUMNS.map((stat) => (
        <div key={stat}>
          <p className="font-mono text-[14px] text-text-subtle">{STAT_LABELS[stat]}</p>
          <p className="font-display text-base font-bold text-text-default">
            {stat === "fight" || stat === "shoot" || stat === "will" ? `+${stats[stat]}` : stats[stat]}
          </p>
        </div>
      ))}
    </div>
  );
}

export function GearTags({ items }: { items: { name: string; quantity: number }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[14px] text-text-secondary">
      {items.map((g, i) => (
        <span key={i} className="border border-corp-border px-1.5 py-0.5">
          {g.name}
          {g.quantity > 1 ? ` ×${g.quantity}` : ""}
        </span>
      ))}
    </div>
  );
}
