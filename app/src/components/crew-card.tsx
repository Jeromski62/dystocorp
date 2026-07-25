import Link from "next/link";
import type { ReactNode } from "react";
import { CorpEmblem } from "@/components/corp-emblem";

// Background photo per corp — Figma "Dysto-Corp-Rough-Concept" Team Cards
// (node 2039:282). Neutral/no-corp always falls back to the "Special
// Purpose Vehicle" freelance variant, same as CorpEmblem's "n/a" tile.
const CORP_BACKGROUNDS: Record<string, string> = {
  yugure: "/teamcards/yugure.png",
  bionexx: "/teamcards/bionexx.png",
};

function corpBackground(slug: string | undefined): string {
  return (slug && CORP_BACKGROUNDS[slug]) || "/teamcards/freelance.png";
}

// Shared crew-card shell, ported skeleton-for-skeleton from the Figma Team
// Card component: corp-accent-bordered box with a dimmed photo background,
// an icon+corp-name+team-name header, one meta line, and a fixed FTE/XP/CR
// stat footer. --corp-accent/--corp-bg fall back to neutral (white border,
// no corp) outside a [data-corp] scope, so corpSlug={undefined} alone
// reproduces the design's neutral "Special Purpose Vehicle" card.
export function CrewCard({
  href,
  corpSlug,
  corpName,
  teamName,
  metaLine,
  fte,
  xp,
  cr,
}: {
  href: string;
  corpSlug?: string;
  corpName: string | null | undefined;
  teamName: string;
  metaLine: ReactNode;
  fte: number;
  xp: number;
  cr: number;
}) {
  return (
    <Link
      href={href}
      data-corp={corpSlug}
      className="relative flex h-[160px] w-full flex-col gap-2 overflow-hidden border border-corp-accent p-4 transition-colors hover:border-corp-accent/60"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        {/* eslint-disable-next-line @next/next/no-img-element -- fills an
            absolutely-positioned decorative layer; next/image's fixed
            intrinsic sizing doesn't fit this object-cover/opacity overlay */}
        <img src={corpBackground(corpSlug)} alt="" className="absolute size-full max-w-none object-cover opacity-60" />
      </div>

      <div className="relative flex w-full shrink-0 items-center gap-4">
        <CorpEmblem name={corpName ?? "?"} slug={corpSlug} size={48} />
        <div className="flex min-w-0 flex-1 flex-col leading-none">
          <p className="w-full font-display text-[16px] font-medium tracking-[1.6px] text-corp-accent uppercase">
            {corpName ?? "Special Purpose Vehicle"}
          </p>
          <p className="w-full truncate font-display text-[24px] font-semibold tracking-[2.4px] text-text-default uppercase">
            {teamName}
          </p>
        </div>
      </div>

      <div className="relative flex min-h-0 w-full flex-1 flex-col justify-between pl-[64px]">
        <div className="truncate font-mono text-[14px] tracking-[1.4px] text-white/70">{metaLine}</div>
        <div className="flex items-start gap-2">
          <StatBadge label="FTE" value={fte} />
          <StatBadge label="XP" value={xp} />
          <StatBadge label="CR" value={cr.toLocaleString("de-DE")} />
        </div>
      </div>
    </Link>
  );
}

// Per Figma redesign (node 2046:490): white 24%-alpha wash chip, no border,
// full-opacity white text -- replaces the old dimmed border+font-mono style.
function StatBadge({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex shrink-0 items-center bg-white/24 px-1.5 py-1 text-[14px] font-semibold tracking-[1.4px] text-white">
      {label}: {value}
    </div>
  );
}
