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
