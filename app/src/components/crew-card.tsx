import Link from "next/link";
import type { ReactNode } from "react";
import { CorpEmblem } from "@/components/corp-emblem";

// Shared crew-card shell (icon + name + status header, corp-accent-topped
// border) used everywhere a crew is listed as a card — Meine Crews, a
// campaign's Teilnehmende Crews. Each caller passes its own meta line(s)
// as children, since the fields worth showing differ slightly by context
// (e.g. campaign name vs. captain/first mate names) — the layout itself
// stays identical.
export function CrewCard({
  href,
  corpSlug,
  corpName,
  name,
  status,
  children,
}: {
  href: string;
  corpSlug?: string;
  corpName: string | null | undefined;
  name: string;
  status?: { label: string; className: string };
  children?: ReactNode;
}) {
  return (
    <Link
      href={href}
      data-corp={corpSlug}
      className={`block border p-4 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        corpSlug
          ? "border-corp-accent/30 border-t-2 border-t-corp-accent bg-corp-surface hover:border-corp-accent/60"
          : "border-border bg-bg-surface hover:border-accent"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <CorpEmblem name={corpName ?? "?"} slug={corpSlug} size={40} />
          <div>
            <p className="font-mono text-[11px] tracking-wide text-corp-accent uppercase">{corpName ?? "—"}</p>
            <p className="font-display text-lg font-semibold text-text-default uppercase">{name}</p>
          </div>
        </div>
        {status ? <span className={`shrink-0 font-mono text-[14px] ${status.className}`}>● {status.label}</span> : null}
      </div>
      {children ? <div className="mt-3 font-mono text-[13px] text-text-secondary">{children}</div> : null}
    </Link>
  );
}
