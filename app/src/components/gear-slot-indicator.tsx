// Ported from Figma "Dysto-Corp-Rough-Concept" item slot indicator
// (node 2091:764). Always exactly 1 slot wide, one per raw slot unit --
// unlike GearSlotItem it never merges into wider cells, so it reads as a
// per-unit capacity strip underneath items that may themselves span
// multiple columns.
export function GearSlotIndicator({ filled }: { filled: boolean }) {
  return <div className={`h-2 border-t-4 bg-black ${filled ? "border-white" : "border-border"}`} />;
}
