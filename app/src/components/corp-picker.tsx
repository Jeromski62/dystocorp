import { corpThemeSlug } from "@/lib/corp-theme";
import { CorpCard, type CorpCardVariant } from "@/components/corp-card";

type Corp = { id: string; key: string; name: string; sector: string; lore_markdown: string };

export function CorpPicker({
  eyebrow,
  corps,
  createAction,
}: {
  eyebrow?: string;
  corps: Corp[];
  createAction: (corpId: string) => Promise<void>;
}) {
  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-3xl px-6 py-12">
      {eyebrow ? <p className="text-xs uppercase tracking-widest text-accent">{eyebrow}</p> : null}
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Mega Corp wählen</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Reine Optik/Lore — hat keinen Einfluss auf Stats, Powers oder Gear.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {corps.map((corp) => (
          <form key={corp.id} action={createAction.bind(null, corp.id)}>
            <button type="submit" className="block w-full appearance-none text-left">
              <CorpCard corp={corpThemeSlug(corp.key) as CorpCardVariant} />
            </button>
          </form>
        ))}
      </div>
    </div>
    </div>
  );
}
