import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CopyId } from "./copy-id";
import { EditCampaignForm } from "./edit-campaign-form";
import { corpThemeSlug } from "@/lib/corp-theme";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name, description")
    .eq("id", id)
    .maybeSingle();

  if (!campaign) notFound();

  const { data: members } = await supabase
    .from("campaign_members")
    .select("player_id, players(display_name)");

  const { data: crews } = await supabase
    .from("crews")
    .select(
      "id, name, player_id, credits, experience, corps(key, name), captains(name), first_mates(name)"
    )
    .eq("campaign_id", id);

  const myCrew = crews?.find((c) => c.player_id === user!.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <EditCampaignForm campaignId={campaign.id} name={campaign.name} description={campaign.description} />

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-2">
          Kampagnen-ID zum Einladen:
          <CopyId id={campaign.id} />
        </span>
        <Link href={`/campaigns/${campaign.id}/missions`} className="text-accent hover:underline">
          Missionen →
        </Link>
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Mitspieler</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-sm">
          {(members ?? []).map((m) => (
            <li
              key={m.player_id}
              className="rounded-full border border-border bg-bg-surface px-3 py-1 text-text-default"
            >
              {m.players?.display_name ?? "?"}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Crews</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(crews ?? []).map((crew) => (
            <Link
              key={crew.id}
              href={`/crews/${crew.id}`}
              data-corp={crew.corps ? corpThemeSlug(crew.corps.key) : undefined}
              className="rounded-md border border-corp-border bg-bg-surface p-4 hover:border-corp-accent"
            >
              <p className="font-mono text-xs uppercase tracking-wide text-corp-accent">{crew.corps?.name}</p>
              <p className="mt-1 font-medium text-text-default">{crew.name}</p>
              <p className="mt-1 text-xs text-text-secondary">
                Captain {crew.captains?.name ?? "—"} · First Mate {crew.first_mates?.name ?? "—"}
              </p>
              <p className="mt-2 font-mono text-xs text-text-secondary">
                {crew.credits}cr · {crew.experience} XP
              </p>
            </Link>
          ))}

          {!myCrew ? (
            <Link
              href={`/campaigns/${campaign.id}/new-crew`}
              className="flex flex-col items-center justify-center rounded-md border border-dashed border-border p-4 text-center text-sm text-text-secondary hover:border-accent hover:text-text-default"
            >
              + Eigene Crew erstellen
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
