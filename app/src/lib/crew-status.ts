// A fixed semantic palette (green/gold/grey), independent of corp identity —
// see --status-active/--status-injured/--status-out in globals.css.
export function crewStatus(captain: { current_health: number; health: number } | null | undefined) {
  if (!captain) return { label: "AKTIV", className: "text-status-active" };
  if (captain.current_health <= 0) return { label: "AUSSER GEFECHT", className: "text-status-out" };
  if (captain.current_health < captain.health) return { label: "VERLETZT", className: "text-status-injured" };
  return { label: "AKTIV", className: "text-status-active" };
}
