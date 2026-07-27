// Ported from Figma "Dysto-Corp-Rough-Concept" Slot Item (node 2091:755).
// One cell per equipped item, spanning as many of the parent grid's columns
// as the item's gear_slots value (1-3) -- a Carbine (2 slots) reads visually
// wider than a Knife (1 slot). Pass no `label` to render the "empty"
// placeholder cell, which is always 1 slot wide (an unused slot is never
// merged with its neighbours).
const SPAN_CLASS = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
} as const;

export function GearSlotItem({ size, label }: { size: 1 | 2 | 3; label?: string }) {
  const isEmpty = !label;
  return (
    <div
      className={`flex items-center justify-center overflow-hidden border-t border-r border-l p-4 ${SPAN_CLASS[size]} ${
        isEmpty ? "border-border" : "border-white/52"
      }`}
    >
      <span
        className={`font-display text-sm font-semibold tracking-[1.6px] uppercase whitespace-nowrap ${
          isEmpty ? "text-white/32" : "text-white"
        }`}
      >
        {isEmpty ? "Empty" : label}
      </span>
    </div>
  );
}
