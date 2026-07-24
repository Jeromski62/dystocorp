import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/button";
import { Clock } from "@/components/clock";
import { RainCanvas } from "@/components/rain-canvas";
import { corpThemeSlug } from "@/lib/corp-theme";

type CrewRow = {
  id: string;
  name: string;
  credits: number;
  corps: { key: string; name: string } | null;
  captains: { name: string; level: number; current_health: number; health: number } | null;
};

// A fixed semantic palette (green/gold/grey), independent of corp identity —
// see --status-active/--status-injured/--status-out in globals.css.
function crewStatus(captain: CrewRow["captains"]) {
  if (!captain) return { label: "AKTIV", className: "text-status-active" };
  if (captain.current_health <= 0) return { label: "AUSSER GEFECHT", className: "text-status-out" };
  if (captain.current_health < captain.health) return { label: "VERLETZT", className: "text-status-injured" };
  return { label: "AKTIV", className: "text-status-active" };
}

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: player }, { data: memberships }] = await Promise.all([
    supabase.from("players").select("display_name").eq("id", user!.id).maybeSingle(),
    supabase
      .from("campaign_members")
      .select("campaign_id, campaigns(id, name, description, archived_at)")
      .eq("player_id", user!.id)
      .order("joined_at", { ascending: false }),
  ]);

  const latestCampaign = memberships?.find((m) => m.campaigns && !m.campaigns.archived_at)?.campaigns ?? null;
  const campaignIds = (memberships ?? []).map((m) => m.campaign_id);

  const [{ data: latestMissions }, { data: crews }] = await Promise.all([
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
      .select("id, name, credits, corps(key, name), captains(name, level, current_health, health)")
      .eq("player_id", user!.id)
      .order("created_at", { ascending: false }),
  ]);

  const latestMission = latestMissions?.[0] ?? null;
  const crewList = (crews ?? []) as CrewRow[];
  const newestCrew = crewList[0] ?? null;
  const totalCredits = crewList.reduce((sum, c) => sum + c.credits, 0);
  const newestCrewSlug = newestCrew?.corps ? corpThemeSlug(newestCrew.corps.key) : undefined;

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
      <RainCanvas />

      <div className="relative z-[1] flex min-h-screen flex-col">
        <div className="flex flex-wrap items-stretch border-b border-border bg-black/40 font-mono text-[10.5px] tracking-[0.05em] text-text-secondary">
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
          <div className="flex items-end justify-between">
            <h1 className="font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Übersicht</h1>
            <span className="font-mono text-[10px] tracking-[0.08em] text-text-subtle">{"// LAGEZENTRUM_v7.2"}</span>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-3">
            <section className="border border-border bg-black/40 p-4">
              <p className="font-mono text-[9px] tracking-[0.08em] text-text-secondary uppercase">Laufende Kampagne</p>
              {latestCampaign ? (
                <Link href={`/campaigns/${latestCampaign.id}`} className="mt-2 block hover:text-accent">
                  <p className="font-display text-lg font-semibold text-text-default">{latestCampaign.name}</p>
                  {latestCampaign.description ? (
                    <p className="mt-1 font-mono text-[10px] text-text-subtle">{latestCampaign.description}</p>
                  ) : null}
                </Link>
              ) : (
                <Link href="/campaigns" className="mt-2 block font-mono text-xs text-text-secondary hover:text-accent">
                  Noch keine Kampagne — ansehen/beitreten →
                </Link>
              )}
            </section>

            <section className="border border-border bg-black/40 p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9px] tracking-[0.08em] text-text-secondary uppercase">Neueste Mission</p>
                {latestMission ? (
                  <span className="border border-border px-1.5 py-0.5 font-mono text-[8.5px] text-text-secondary uppercase">
                    {latestMission.status}
                  </span>
                ) : null}
              </div>
              {latestMission ? (
                <Link href={`/campaigns/${latestMission.campaign_id}/missions`} className="mt-2 block hover:text-accent">
                  <p className="font-display text-lg font-semibold text-text-default">{latestMission.title}</p>
                  <p className="mt-1 font-mono text-[10px] text-text-subtle">{latestMission.campaigns?.name}</p>
                </Link>
              ) : (
                <p className="mt-2 font-mono text-xs text-text-secondary">Noch keine Mission geplant.</p>
              )}
            </section>

            <section
              data-corp={newestCrewSlug}
              className={`border border-border p-4 ${newestCrewSlug ? "border-t-2 border-t-corp-accent bg-corp-surface/40" : "bg-black/40"}`}
            >
              <p className="font-mono text-[9px] tracking-[0.08em] text-text-secondary uppercase">Neueste Crew</p>
              {newestCrew ? (
                <Link href={`/crews/${newestCrew.id}`} className="mt-2 block hover:opacity-90">
                  <p className="font-display text-lg font-semibold text-text-default">{newestCrew.name}</p>
                  <div className="mt-1.5 flex gap-3.5 font-mono text-[10px] text-text-secondary">
                    {newestCrew.captains ? <span>LV {newestCrew.captains.level}</span> : null}
                    <span className="text-corp-accent">{newestCrew.credits.toLocaleString("de-DE")} CR</span>
                  </div>
                </Link>
              ) : (
                <Link href="/crews/new" className="mt-2 block font-mono text-xs text-text-secondary hover:text-accent">
                  Noch keine Crew — erstellen →
                </Link>
              )}
            </section>
          </div>

          <section className="flex flex-1 flex-col border border-border bg-black/40">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="font-mono text-[10px] tracking-[0.08em] text-text-secondary uppercase">
                Crew-Register // Aktive Einheiten
              </span>
              <span className="font-mono text-[10px] text-text-subtle">{String(crewList.length).padStart(2, "0")} GELISTET</span>
            </div>

            {crewList.length === 0 ? (
              <p className="px-4 py-6 font-mono text-xs text-text-secondary">Noch keine Crew registriert.</p>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid min-w-[640px] grid-cols-[2fr_1.2fr_1.4fr_0.7fr_1fr_1fr] gap-2 border-b border-border px-4 py-2 font-mono text-[9px] tracking-[0.05em] text-text-subtle uppercase">
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
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-corp-accent">
                        <span className="h-1.5 w-1.5 rounded-full bg-corp-accent" />
                        {crew.corps?.name.toUpperCase() ?? "—"}
                      </span>
                      <span className="font-mono text-[11px] text-text-mid">{crew.captains?.name ?? "—"}</span>
                      <span>{crew.captains?.level ?? "—"}</span>
                      <span className="font-mono text-[11px]">{crew.credits.toLocaleString("de-DE")}</span>
                      <span className={`font-mono text-[10px] ${status.className}`}>● {status.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/crews/new">
              <Button variant="cta">＋ Neue Crew</Button>
            </Link>
            <Link href="/campaigns">
              <Button variant="ghost">＋ Kampagne beitreten</Button>
            </Link>
            <span className="flex-1" />
            <Link href="/powers" className="font-mono text-[11px] text-text-secondary hover:text-text-default">
              POWER-DATENBANK →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
