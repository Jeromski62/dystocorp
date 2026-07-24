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

// rgb() triplets for RainCanvas's `tint` prop, keyed by design-system slug —
// matches --corp-accent in globals.css (Yūgure red / BioNexx green).
const CORP_RAIN_TINTS: Record<string, string> = {
  yugure: "251,59,78",
  bionexx: "83,211,125",
};

export function corpRainTint(slug: string | undefined): string {
  return (slug && CORP_RAIN_TINTS[slug]) || "170,196,224";
}
