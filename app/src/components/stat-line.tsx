export type StatColumn = { label: string; value: string; header?: boolean };

// Shared stat block used by both the Officer Builder Dossier and the roster's
// EmployeeCard (Figma node 2091:534 / 2116:608): a row of labeled cells
// (filled grey background, centered) with an optional leading unfilled/bold/
// left-aligned column for Officer Builder's "Start Level", plus a value row
// underneath.
export function StatLine({ columns }: { columns: StatColumn[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-[5px]">
        {columns.map((col) => (
          <div
            key={col.label}
            className={`flex flex-1 items-center py-2 ${col.header ? "justify-start" : "justify-center bg-white/[0.24]"}`}
          >
            <span
              className={`font-display text-sm tracking-[1.6px] text-white uppercase ${col.header ? "font-bold" : "font-semibold"}`}
            >
              {col.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-[5px]">
        {columns.map((col) => (
          <div key={col.label} className="flex flex-1 items-center justify-center">
            <span className="font-display text-sm font-medium tracking-[1.6px] text-white">{col.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
