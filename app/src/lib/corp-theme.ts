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
