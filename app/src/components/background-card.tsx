"use client";

import { useState } from "react";
import Image from "next/image";

// Ported from Figma "Dysto-Corp-Rough-Concept" BackgroundCard (node 2063:560)
// / grid (node 2063:293). Closed by default -- the accordion only reveals
// flavor_text (nice-to-know, not needed while building); the stat-choice
// summary that used to sit at the bottom of the old card now lives right
// under the title so it's visible without opening anything.
export const BACKGROUND_ICONS: Record<string, string> = {
  biomorph: "/icons/backgrounds/biomorph.svg",
  cyborg: "/icons/backgrounds/cyborg.svg",
  mystic: "/icons/backgrounds/mystic.svg",
  psionicist: "/icons/backgrounds/psionic.svg",
  robotics_expert: "/icons/backgrounds/robotsexpert.svg",
  rogue: "/icons/backgrounds/rogue.svg",
  tekker: "/icons/backgrounds/techer.svg",
  veteran: "/icons/backgrounds/veteran.svg",
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BackgroundCard({
  backgroundKey,
  name,
  bonusBadges,
  chooseCount,
  chooseOptionLabels,
  flavorText,
  selected,
  onSelect,
}: {
  backgroundKey: string;
  name: string;
  bonusBadges: string[];
  chooseCount: number;
  chooseOptionLabels: string[];
  flavorText: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const iconSrc = BACKGROUND_ICONS[backgroundKey];

  return (
    <div
      className={`flex w-full items-start gap-2 border bg-black p-4 transition-colors ${
        selected ? "border-corp-accent" : "border-white/12 hover:border-white/30"
      }`}
    >
      <span className="flex size-12 shrink-0 items-center justify-center bg-black/60">
        {iconSrc ? <Image src={iconSrc} alt="" width={40} height={40} /> : null}
      </span>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <button type="button" onClick={onSelect} className="flex w-full items-center gap-2 text-left">
          <span className="min-w-0 flex-1 font-display text-[24px] font-semibold tracking-[2.4px] text-white uppercase">
            {name}
          </span>
          {bonusBadges.map((label) => (
            <span key={label} className="shrink-0 bg-white/24 px-1.5 py-1 text-[14px] font-semibold tracking-[1.4px] text-white">
              {label}
            </span>
          ))}
        </button>

        <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2">
          <p className="text-[16px] leading-none text-white/60">
            Wähle: <span className="font-bold text-white/80">{chooseCount}</span> von:{" "}
            {chooseOptionLabels.map((label, i) => (
              <span key={label}>
                <span className="font-bold text-white/80">{label}</span>
                {i < chooseOptionLabels.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <ChevronIcon className={`size-6 shrink-0 text-white transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open ? (
          <div className="w-full pt-2">
            <p className="text-[16px] leading-[1.4] text-white/60">{flavorText}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
