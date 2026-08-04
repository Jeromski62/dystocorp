import Image from "next/image";

// Vector glyphs (dark navy fill, meant to sit on the corp-accent tile) per
// the Figma "Dysto-Corp-Rough-Concept" Team Cards reference — replaces the
// earlier cropped-PNG-lockup approach.
const CORP_ICONS: Record<string, string> = {
  yugure: "/corps/yugure.svg",
  bionexx: "/corps/bionexx.svg",
  soma: "/corps/soma.svg",
};

// Solid corp-accent tile with the corp's glyph when we know the slug; falls
// back to a neutral "n/a" tile otherwise (Figma's "Special Purpose Vehicle"
// state — a crew with no specific corp, or corp data that failed to load).
// Self-scopes `data-corp` so the tile always carries its own corp's colour
// even though teams themselves render in the neutral theme (see
// crews/[crewId]/layout.tsx) -- the icon is the one place that's still
// meant to read as branded at a glance.
export function CorpEmblem({ name, slug, size = 48 }: { name: string; slug?: string; size?: number }) {
  const iconSrc = slug ? CORP_ICONS[slug] : undefined;

  if (iconSrc) {
    return (
      <div
        data-corp={slug}
        className="flex flex-shrink-0 items-center justify-center bg-corp-accent"
        style={{ width: size, height: size, padding: size * 0.18 }}
      >
        <Image src={iconSrc} alt={name} width={size} height={size} className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center bg-[#ababab] font-display font-semibold text-black"
      style={{ width: size, height: size, fontSize: size * 0.29 }}
    >
      n/a
    </div>
  );
}
