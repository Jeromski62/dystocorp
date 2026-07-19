// Derives FIT/INJURED/OUT from current vs. starting health -- the schema has
// no separate "games remaining" or death flag, so this is a simplified
// 3-state version of the styleguide's FIT/INJURED/OUT-n/DEAD badge set.
export function StatusBadge({ currentHealth, health }: { currentHealth: number; health: number }) {
  const base = "font-mono text-[11px] px-2 py-[3px] rounded-sm";

  if (currentHealth <= 0) {
    return <span className={`${base} border border-status-out text-text-secondary`}>OUT</span>;
  }
  if (currentHealth < health) {
    return <span className={`${base} border border-status-injured text-status-injured`}>INJURED</span>;
  }
  return <span className={`${base} bg-corp-accent text-corp-on-accent`}>FIT</span>;
}
