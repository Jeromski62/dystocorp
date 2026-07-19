import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CopyId } from "./copy-id";
import { EditCampaignForm } from "./edit-campaign-form";

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
      "id, name, player_id, credits, experience, corps(name), captains(name), first_mates(name)"
    )
    .eq("campaign_id", id);

  const myCrew = crews?.find((c) => c.player_id === user!.id);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <EditCampaignForm campaignId={campaign.id} name={campaign.name} description={campaign.description} />

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-2">
          Kampagnen-ID zum Einladen:
          <CopyId id={campaign.id} />
        </span>
        <Link href={`/campaigns/${campaign.id}/sessions`} className="text-accent hover:underline">
          Session-Log →
        </Link>
      </div>

      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Mitspieler</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-sm">
          {(members ?? []).map((m) => (
            <li
              key={m.player_id}
              className="rounded-full border border-border bg-surface px-3 py-1 text-foreground"
            >
              {m.players?.display_name ?? "?"}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Crews</h2>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {(crews ?? []).map((crew) => (
            <Link
              key={crew.id}
              href={`/crews/${crew.id}`}
              className="rounded-md border border-border bg-surface p-4 hover:border-accent"
            >
              <p className="text-xs uppercase tracking-wide text-accent">{crew.corps?.name}</p>
              <p className="mt-1 font-medium text-foreground">{crew.name}</p>
              <p className="mt-1 text-xs text-muted">
                Captain {crew.captains?.name ?? "—"} · First Mate {crew.first_mates?.name ?? "—"}
              </p>
              <p className="mt-2 text-xs text-muted">
                {crew.credits}cr · {crew.experience} XP
              </p>
            </Link>
          ))}

          {!myCrew ? (
            <Link
              href={`/campaigns/${campaign.id}/new-crew`}
              className="flex flex-col items-center justify-center rounded-md border border-dashed border-border p-4 text-center text-sm text-muted hover:border-accent hover:text-foreground"
            >
              + Eigene Crew erstellen
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}
