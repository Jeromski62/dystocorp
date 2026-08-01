// Maps our DB corp `key` to the design system's `data-corp` slug. Cosmetic only:
// the lore doc spells it "BioNex Connect" (single x), the design system's
// stylesheet slug is "bionexx" -- neither the DB key nor displayed name changes.
const CORP_THEME_SLUGS: Record<string, string> = {
  yugure: "yugure",
  bionex_connect: "bionexx",
};

export function corpThemeSlug(corpKey: string): string {
  return CORP_THEME_SLUGS[corpKey] ?? corpKey;
}

// Background photo per corp — Figma "Dysto-Corp-Rough-Concept" Team Cards
// (node 2039:282). Neutral/no-corp always falls back to the "Special
// Purpose Vehicle" freelance variant, same as CorpEmblem's "n/a" tile.
const CORP_BACKGROUNDS: Record<string, string> = {
  yugure: "/teamcards/yugure.png",
  bionexx: "/teamcards/bionexx.png",
};

export function corpBackground(slug: string | undefined): string {
  return (slug && CORP_BACKGROUNDS[slug]) || "/teamcards/freelance.png";
}

// Full-bleed corp photo for wide banner headers (Hire Team Header etc).
// teamcards/* (corpBackground above) intentionally leaves ~40% of the frame
// transparent on the left for the CrewCard's icon+name overlay -- stretched
// across a full-width banner that transparent band dominates and the photo
// reads as missing. corpcards/* is pre-composed full-bleed (no transparent
// panel), so it's the right source for anything wider than a card.
const CORP_HEADER_BACKGROUNDS: Record<string, string> = {
  yugure: "/corpcards/yugure.png",
  bionexx: "/corpcards/bionexx.png",
};

export function corpHeaderBackground(slug: string | undefined): string {
  return (slug && CORP_HEADER_BACKGROUNDS[slug]) || "/corpcards/subcontractor.png";
}
