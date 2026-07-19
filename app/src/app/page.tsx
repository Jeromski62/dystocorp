import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("campaign_members")
    .select("campaign_id, campaigns(id, name, description)")
    .eq("player_id", user!.id)
    .order("joined_at", { ascending: false });

  const latestCampaign = memberships?.[0]?.campaigns ?? null;
  const campaignIds = (memberships ?? []).map((m) => m.campaign_id);

  const [{ data: latestMissions }, { data: newestCrews }] = await Promise.all([
    campaignIds.length > 0
      ? supabase
          .from("missions")
          .select("id, title, status, campaign_id, campaigns(name)")
          .in("campaign_id", campaignIds)
          .order("created_at", { ascending: false })
          .limit(1)
      : Promise.resolve({ data: [] as { id: string; title: string; status: string; campaign_id: string; campaigns: { name: string } | null }[] }),
    supabase
      .from("crews")
      .select("id, name, credits, experience, corps(name), campaigns(name)")
      .eq("player_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const latestMission = latestMissions?.[0] ?? null;
  const newestCrew = newestCrews?.[0] ?? null;

  if (!latestCampaign && !newestCrew) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl tracking-[2.5px] text-text-default">Willkommen bei DystoCorp</p>
        <p className="text-sm text-text-secondary">
          Leg deine erste Crew an oder tritt einer Kampagne bei, um loszulegen.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/crews/new" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90">
            Erste Crew erstellen
          </Link>
          <Link href="/campaigns" className="rounded-md border border-border px-4 py-2 text-sm text-text-default hover:border-accent">
            Kampagnen ansehen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text-default">Übersicht</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <section className="rounded-md border border-border bg-bg-surface p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Laufende Kampagne</h2>
          {latestCampaign ? (
            <Link href={`/campaigns/${latestCampaign.id}`} className="mt-2 block hover:text-accent">
              <p className="font-medium text-text-default">{latestCampaign.name}</p>
              {latestCampaign.description ? (
                <p className="mt-1 text-xs text-text-secondary">{latestCampaign.description}</p>
              ) : null}
            </Link>
          ) : (
            <Link href="/campaigns" className="mt-2 block text-sm text-text-secondary hover:text-accent">
              Noch keine Kampagne — ansehen/beitreten →
            </Link>
          )}
        </section>

        <section className="rounded-md border border-border bg-bg-surface p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Neueste Mission</h2>
          {latestMission ? (
            <Link href={`/campaigns/${latestMission.campaign_id}/missions`} className="mt-2 block hover:text-accent">
              <p className="font-medium text-text-default">{latestMission.title}</p>
              <p className="mt-1 text-xs text-text-secondary">{latestMission.campaigns?.name}</p>
            </Link>
          ) : (
            <p className="mt-2 text-sm text-text-secondary">Noch keine Mission geplant.</p>
          )}
        </section>

        <section className="rounded-md border border-border bg-bg-surface p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Neueste Crew</h2>
          {newestCrew ? (
            <Link href={`/crews/${newestCrew.id}`} className="mt-2 block hover:text-accent">
              <p className="font-medium text-text-default">{newestCrew.name}</p>
              <p className="mt-1 text-xs text-text-secondary">
                {newestCrew.campaigns?.name ?? "Ohne Kampagne"} · {newestCrew.credits}cr
              </p>
            </Link>
          ) : (
            <Link href="/crews/new" className="mt-2 block text-sm text-text-secondary hover:text-accent">
              Noch keine Crew — erstellen →
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
