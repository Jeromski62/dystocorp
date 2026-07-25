import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Clock } from "@/components/clock";
import { StarmapCanvas } from "@/components/starmap-canvas";
import { corpThemeSlug } from "@/lib/corp-theme";
import { crewStatus } from "@/lib/crew-status";
import { CrewCard } from "@/components/crew-card";
import { CampaignCard } from "@/components/campaign-card";
import { MissionPreviewCard } from "@/components/mission-preview-card";

type CrewRow = {
  id: string;
  name: string;
  credits: number;
  experience: number;
  corps: { key: string; name: string } | null;
  captains: { name: string; level: number; current_health: number; health: number } | null;
  soldiers: { count: number }[];
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: player }, { data: memberships }] = await Promise.all([
    supabase.from("players").select("display_name").eq("id", user!.id).maybeSingle(),
    supabase
      .from("campaign_members")
      .select("campaign_id, campaigns(id, name, description, archived_at, crews(corps(key, name)))")
      .eq("player_id", user!.id)
      .order("joined_at", { ascending: false }),
  ]);

  const latestCampaign = memberships?.find((m) => m.campaigns && !m.campaigns.archived_at)?.campaigns ?? null;
  const campaignIds = (memberships ?? []).map((m) => m.campaign_id);
  const latestCampaignCorps = (() => {
    const seen = new Map<string, { key: string; slug: string; name: string }>();
    for (const crew of latestCampaign?.crews ?? []) {
      if (!crew.corps) continue;
      const slug = corpThemeSlug(crew.corps.key);
      if (!seen.has(slug)) seen.set(slug, { key: crew.corps.key, slug, name: crew.corps.name });
    }
    return Array.from(seen.values());
  })();

  const [{ data: latestMissions }, { data: crews }] = await Promise.all([
    campaignIds.length > 0
      ? supabase
          .from("missions")
          .select("id, title, subtitle, status, campaign_id, campaigns(name)")
          .in("campaign_id", campaignIds)
          .order("created_at", { ascending: false })
          .limit(1)
      : Promise.resolve({
          data: [] as { id: string; title: string; subtitle: string | null; status: string; campaign_id: string; campaigns: { name: string } | null }[],
        }),
    supabase
      .from("crews")
      .select("id, name, credits, experience, corps(key, name), captains(name, level, current_health, health), soldiers(count)")
      .eq("player_id", user!.id)
      .order("created_at", { ascending: false }),
  ]);

  const latestMission = latestMissions?.[0] ?? null;
  const crewList = (crews ?? []) as CrewRow[];
  const newestCrew = crewList[0] ?? null;
  const totalCredits = crewList.reduce((sum, c) => sum + c.credits, 0);
  const newestCrewSlug = newestCrew?.corps ? corpThemeSlug(newestCrew.corps.key) : undefined;
  const newestCrewUnitCount = newestCrew?.soldiers?.[0]?.count ?? 0;

  if (!latestCampaign && !newestCrew) {
    return (
      <div className="hud-grid flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl tracking-[0.1em] text-text-default">Willkommen bei DystoCorp</p>
        <p className="max-w-sm font-mono text-xs leading-relaxed text-text-secondary">
          Leg deine erste Crew an oder tritt einer Kampagne bei, um loszulegen.
        </p>
        <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
          <Link href="/crews/new">
            <Button variant="cta" className="w-full">
              ＋ Erste Crew erstellen
            </Button>
          </Link>
          <Link href="/campaigns">
            <Button variant="ghost" className="w-full">
              Kampagnen ansehen
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hud-grid relative min-h-screen overflow-hidden">
      <StarmapCanvas className="z-0" />

      <div className="relative z-[1] flex min-h-screen flex-col">
        <div className="flex flex-wrap items-stretch border-b border-border bg-black/40 font-mono text-[14px] tracking-[0.05em] text-text-secondary">
          <span className="border-r border-border px-4 py-2 text-text-default">SYS_OP_1.09</span>
          <span className="border-r border-border px-4 py-2 text-accent">[ONLINE]</span>
          <span className="border-r border-border px-4 py-2">{(player?.display_name || user!.email)?.toUpperCase()}</span>
          {newestCrew?.corps ? (
            <span className="border-r border-border px-4 py-2 text-corp-accent" data-corp={newestCrewSlug}>
              {newestCrew.corps.name.toUpperCase()}
            </span>
          ) : null}
          <span className="border-r border-border px-4 py-2">{totalCredits.toLocaleString("de-DE")} CR</span>
          <span className="flex-1" />
          <Clock className="px-4 py-2" />
        </div>

        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-6 py-8 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h1 className="font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Übersicht</h1>
              <span className="font-mono text-[14px] tracking-[0.08em] text-text-subtle">{"// LAGEZENTRUM_v7.2"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/campaigns">
                <Button variant="ghost">＋ Kampagne beitreten</Button>
              </Link>
              <Link href="/crews/new">
                <Button variant="cta">＋ Team Einstellen</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-3">
            <section className="pt-4">
              <p className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Laufende Kampagne</p>
              {latestCampaign ? (
                <div className="mt-2">
                  <CampaignCard href={`/campaigns/${latestCampaign.id}`} name={latestCampaign.name} corps={latestCampaignCorps} />
                </div>
              ) : (
                <Link href="/campaigns" className="mt-2 block font-mono text-xs text-text-secondary hover:text-accent">
                  Noch keine Kampagne — ansehen/beitreten →
                </Link>
              )}
            </section>

            <section className="flex flex-col pt-4">
              <p className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Nächste Mission</p>
              {latestMission ? (
                <div className="mt-2">
                  <MissionPreviewCard
                    href={`/campaigns/${latestMission.campaign_id}/missions`}
                    title={latestMission.title}
                    subtitle={latestMission.subtitle}
                    campaignName={latestMission.campaigns?.name}
                    status={latestMission.status}
                  />
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="font-mono text-xs text-text-secondary">Noch keine Mission geplant.</p>
                </div>
              )}
            </section>

            <section className="flex flex-col pt-4">
              <p className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Neueste Crew</p>
              {newestCrew ? (
                <div className="mt-2 flex-1">
                  <CrewCard
                    href={`/crews/${newestCrew.id}`}
                    corpSlug={newestCrewSlug}
                    corpName={newestCrew.corps?.name}
                    teamName={newestCrew.name}
                    metaLine={newestCrew.captains?.name ?? "Kein Captain"}
                    fte={newestCrewUnitCount}
                    xp={newestCrew.experience}
                    cr={newestCrew.credits}
                    fill
                  />
                </div>
              ) : (
                <Link href="/crews/new" className="mt-2 block font-mono text-xs text-text-secondary hover:text-accent">
                  Noch keine Crew — erstellen →
                </Link>
              )}
            </section>
          </div>

          <section className="flex flex-1 flex-col border border-border bg-black/60">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
                Crew-Register // Aktive Einheiten
              </span>
              <span className="font-mono text-[14px] text-text-subtle">{String(crewList.length).padStart(2, "0")} GELISTET</span>
            </div>

            {crewList.length === 0 ? (
              <p className="px-4 py-6 font-mono text-xs text-text-secondary">Noch keine Crew registriert.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid min-w-[640px] grid-cols-[2fr_1.2fr_1.4fr_0.7fr_1fr_1fr] gap-2 border-b border-border px-4 py-2 font-mono text-[14px] tracking-[0.05em] text-text-subtle uppercase">
                  <span>Crew</span>
                  <span>Corp</span>
                  <span>Captain</span>
                  <span>Lvl</span>
                  <span>Credits</span>
                  <span>Status</span>
                </div>
                {crewList.map((crew) => {
                  const slug = crew.corps ? corpThemeSlug(crew.corps.key) : undefined;
                  const status = crewStatus(crew.captains);
                  return (
                    <Link
                      key={crew.id}
                      href={`/crews/${crew.id}`}
                      data-corp={slug}
                      className="grid min-w-[640px] grid-cols-[2fr_1.2fr_1.4fr_0.7fr_1fr_1fr] items-center gap-2 border-b border-border/60 px-4 py-2.5 text-sm text-text-default last:border-b-0 hover:bg-corp-accent/[0.06]"
                    >
                      <span className="font-medium tracking-[0.02em]">{crew.name}</span>
                      <span className="flex items-center gap-1.5 font-mono text-[15px] text-corp-accent">
                        <span className="h-1.5 w-1.5 rounded-full bg-corp-accent" />
                        {crew.corps?.name.toUpperCase() ?? "—"}
                      </span>
                      <span className="font-mono text-[15px] text-text-mid">{crew.captains?.name ?? "—"}</span>
                      <span>{crew.captains?.level ?? "—"}</span>
                      <span className="font-mono text-[15px]">{crew.credits.toLocaleString("de-DE")}</span>
                      <span className={`font-mono text-[14px] ${status.className}`}>● {status.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <div className="flex justify-end">
            <Link href="/powers" className="font-mono text-[15px] text-text-secondary hover:text-text-default">
              POWER-DATENBANK →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
