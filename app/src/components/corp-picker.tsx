import { CorpEmblem } from "@/components/corp-emblem";
import { corpThemeSlug } from "@/lib/corp-theme";

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
    <div className="mx-auto max-w-3xl px-6 py-12">
      {eyebrow ? <p className="text-xs uppercase tracking-widest text-accent">{eyebrow}</p> : null}
      <h1 className="mt-2 text-2xl font-semibold text-text-default">Mega Corp wählen</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Reine Optik/Lore — hat keinen Einfluss auf Stats, Powers oder Gear.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {corps.map((corp) => (
          <article
            key={corp.id}
            data-corp={corpThemeSlug(corp.key)}
            className="rounded-md border border-corp-border bg-bg-surface p-5"
          >
            <div className="flex items-center gap-3">
              <CorpEmblem name={corp.name} />
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-corp-accent">{corp.sector}</p>
                <h2 className="font-display text-lg tracking-[2px] text-text-default">{corp.name}</h2>
              </div>
            </div>
            <p className="mt-3 max-h-40 overflow-y-auto whitespace-pre-line text-sm text-text-secondary">
              {corp.lore_markdown}
            </p>
            <form action={createAction.bind(null, corp.id)} className="mt-4">
              <button
                type="submit"
                className="rounded-md bg-corp-accent px-4 py-2 text-sm font-medium text-corp-on-accent hover:opacity-90"
              >
                Crew bei {corp.name} gründen
              </button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
