import type { ReactNode } from "react";

// Ported from Figma "Dysto-Corp-Rough-Concept" Page Header (node 2067:211).
// Actions always sit top-aligned with the title block (items-start)
// regardless of whether `meta`/`description` are present, so the CTA no
// longer jumps up/down depending on which page you're on. `meta` is the
// Figma subtitle slot -- a short, tracked-out label (e.g. a result count) --
// while `description` covers the longer body-copy sentence most pages
// already had under the title, kept in the existing plain style since
// forcing full sentences into that all-caps tracking would hurt readability.
export function PageHeader({
  title,
  meta,
  description,
  cta,
  secondary,
  className = "",
}: {
  title: string;
  meta?: ReactNode;
  description?: ReactNode;
  cta?: ReactNode;
  secondary?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-4 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-display text-[24px] font-semibold tracking-[4.8px] text-text-default uppercase leading-none">
            {title}
          </h1>
          {meta ? (
            <span className="font-display text-[16px] font-medium tracking-[3.2px] text-white/50 uppercase leading-none">
              {meta}
            </span>
          ) : null}
        </div>
        {description ? <p className="text-sm text-text-secondary">{description}</p> : null}
      </div>

      {cta || secondary ? (
        <div className="flex shrink-0 items-start gap-3">
          {secondary}
          {cta}
        </div>
      ) : null}
    </div>
  );
}
