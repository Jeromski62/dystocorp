// Ported from Figma "Dysto-Corp-Rough-Concept" Stepper (node 2063:153):
// 36px badge + uppercase label per step, joined by connector bars that grow
// to fill the row so the stepper always spans the full container width.
// "done" gets a green check badge, "current" a filled-white badge with a
// bold step number, "open" (not yet completed) the same white badge but at
// 40% opacity on the whole step -- badge, label and the connector leading
// into the *next* step all fade together. Labels are dropped below `md` --
// only the numbered/checked badges survive on narrow screens.
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden>
      <path fill="black" d="M16.4833 22.0917L12.7167 18.3417L14.1167 16.925L16.4833 19.2917L21.8833 13.9083L23.2833 15.3083L16.4833 22.0917Z" />
    </svg>
  );
}

export type StepStatus = "done" | "current" | "open";

export function Stepper({
  steps,
}: {
  steps: { label: string; status: StepStatus; onClick?: () => void; disabled?: boolean }[];
}) {
  return (
    <ol className="flex w-full items-center gap-2">
      {steps.map((step, i) => (
        <li key={i} className={`flex items-center gap-2 ${i < steps.length - 1 ? "flex-1" : "shrink-0"}`}>
          <button
            type="button"
            disabled={step.disabled}
            onClick={step.onClick}
            className={`flex shrink-0 items-center gap-2 p-2 ${step.status === "open" ? "opacity-40" : ""} ${
              step.disabled ? "cursor-not-allowed" : ""
            }`}
          >
            {step.status === "done" ? (
              <span className="flex size-9 shrink-0 items-center justify-center bg-[#11FF70]">
                <CheckIcon className="size-9" />
              </span>
            ) : (
              <span className="flex size-9 shrink-0 items-center justify-center bg-white font-display text-[16px] font-bold tracking-[1.6px] text-black">
                {i + 1}
              </span>
            )}
            <span className="hidden font-display text-[16px] font-semibold tracking-[1.6px] text-white uppercase md:inline">
              {step.label}
            </span>
          </button>
          {i < steps.length - 1 ? (
            <span aria-hidden className={`h-0.5 flex-1 bg-white ${step.status === "done" ? "" : "opacity-40"}`} />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
