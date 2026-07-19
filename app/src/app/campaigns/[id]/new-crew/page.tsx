import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCrew } from "./actions";
import { CorpEmblem } from "@/components/corp-emblem";
import { corpThemeSlug } from "@/lib/corp-theme";

export default async function NewCrewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: campaignId } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name")
    .eq("id", campaignId)
    .maybeSingle();

  if (!campaign) notFound();

  const { data: corps } = await supabase
    .from("corps")
    .select("id, key, name, sector, lore_markdown")
    .order("sort_order");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-xs uppercase tracking-widest text-accent">{campaign.name}</p>
      <h1 className="mt-2 text-2xl font-semibold text-text-default">Mega Corp wählen</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Reine Optik/Lore — hat keinen Einfluss auf Stats, Powers oder Gear.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {(corps ?? []).map((corp) => (
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
            <form action={createCrew.bind(null, campaignId, corp.id)} className="mt-4">
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
