import Image from "next/image";

// Figma "Dysto-Corp-Rough-Concept" CorpCard (node 2061:116): same 200px-tall
// card shell as CrewCard/CampaignCard, but the whole face is corp branding —
// a dimmed background photo behind a centered logo lockup. The "subcontractor"
// variant (no real corp -- freelance/"Special Purpose Vehicle") has no logo
// asset, so it falls back to a two-line wordmark instead. Background photos
// are pre-composed at 2x (780x400) with Figma's per-variant crop/rotate
// already baked in, so a single object-cover layer works for all variants.
const CORP_CARD_BACKGROUNDS = {
  bionexx: "/corpcards/bionexx.png",
  yugure: "/corpcards/yugure.png",
  subcontractor: "/corpcards/subcontractor.png",
} as const;

const CORP_CARD_LOGOS: Partial<Record<CorpCardVariant, { src: string; width: number; height: number }>> = {
  bionexx: { src: "/corpcards/logo-bionexx.svg", width: 134, height: 142 },
  yugure: { src: "/corpcards/logo-yugure.svg", width: 160, height: 118 },
};

export type CorpCardVariant = keyof typeof CORP_CARD_BACKGROUNDS;

export function CorpCard({ corp, className = "" }: { corp: CorpCardVariant; className?: string }) {
  const logo = CORP_CARD_LOGOS[corp];

  return (
    <div
      data-corp={corp === "subcontractor" ? undefined : corp}
      className={`group relative flex h-[200px] w-full flex-col items-center justify-center overflow-hidden border border-white/12 bg-black p-4 transition-colors hover:border-white/30 ${className}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        {/* eslint-disable-next-line @next/next/no-img-element -- fills an
            absolutely-positioned decorative layer; next/image's fixed
            intrinsic sizing doesn't fit this object-cover/opacity overlay */}
        <img
          src={CORP_CARD_BACKGROUNDS[corp]}
          alt=""
          className="absolute size-full max-w-none scale-100 object-cover opacity-30 transition-transform group-hover:scale-110"
        />
      </div>

      {logo ? (
        <Image src={logo.src} alt="" width={logo.width} height={logo.height} className="relative" />
      ) : (
        <div className="relative flex flex-col items-center gap-1 text-center leading-none text-white">
          <p className="font-display text-[16px] font-semibold tracking-[1.6px] uppercase">Special Purpose</p>
          <p className="font-display text-[32px] font-semibold tracking-[3.2px] uppercase">Sub Contractor</p>
        </div>
      )}
    </div>
  );
}
