import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCrew } from "./actions";

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
      <h1 className="mt-2 text-2xl font-semibold text-foreground">Mega Corp wählen</h1>
      <p className="mt-2 text-sm text-muted">
        Reine Optik/Lore — hat keinen Einfluss auf Stats, Powers oder Gear.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {(corps ?? []).map((corp) => (
          <article key={corp.id} className="rounded-md border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-wide text-accent">{corp.sector}</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{corp.name}</h2>
            <p className="mt-3 max-h-40 overflow-y-auto whitespace-pre-line text-sm text-muted">
              {corp.lore_markdown}
            </p>
            <form action={createCrew.bind(null, campaignId, corp.id)} className="mt-4">
              <button
                type="submit"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
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
