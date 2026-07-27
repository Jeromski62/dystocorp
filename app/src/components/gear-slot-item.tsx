// Ported from Figma "Dysto-Corp-Rough-Concept" Slot Item (node 2091:755).
// One cell per equipped item, spanning as many of the parent grid's columns
// as the item's gear_slots value (1-3) -- a Carbine (2 slots) reads visually
// wider than a Knife (1 slot). Pass no `label` to render the "empty"
// placeholder cell, which is always 1 slot wide (an unused slot is never
// merged with its neighbours). An occupied cell is clickable (reopens the
// gear picker sheet) and gets a hover state; the empty placeholder is inert
// -- nothing to edit there yet.
const SPAN_CLASS = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
} as const;

export function GearSlotItem({ size, label, onClick }: { size: 1 | 2 | 3; label?: string; onClick?: () => void }) {
  const isEmpty = !label;
  const className = `flex items-center justify-center overflow-hidden border-t border-r border-l p-4 transition-colors ${SPAN_CLASS[size]} ${
    isEmpty ? "border-border" : "border-white/52 hover:border-accent"
  }`;
  const content = (
    <span
      className={`font-display text-sm font-semibold tracking-[1.6px] uppercase whitespace-nowrap ${
        isEmpty ? "text-white/32" : "text-white"
      }`}
    >
      {isEmpty ? "Empty" : label}
    </span>
  );

  if (isEmpty) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
