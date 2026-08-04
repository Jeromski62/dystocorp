import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Clock } from "@/components/clock";
import { corpThemeSlug } from "@/lib/corp-theme";
import { CampaignCard } from "@/components/campaign-card";
import { MissionPreviewCard } from "@/components/mission-preview-card";
import { PageHeader } from "@/components/page-header";
import { CorpCard, type CorpCardVariant } from "@/components/corp-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { JoinCampaignForm } from "@/app/(app)/campaigns/join-campaign-form";
import { TeamRegister } from "./team-register";

type CrewRow = {
  id: string;
  name: string;
  credits: number;
  campaign_id: string | null;
  corps: { key: string; name: string } | null;
  captains: { name: string; level: number } | null;
  campaigns: { id: string; name: string } | null;
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

  const [{ data: latestMissions }, { data: crews }, { data: corps }] = await Promise.all([
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
      .select("id, name, credits, campaign_id, corps(key, name), captains(name, level), campaigns(id, name)")
      .eq("player_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase.from("corps").select("id, key").order("sort_order"),
  ]);

  const latestMission = latestMissions?.[0] ?? null;
  const crewList = (crews ?? []) as CrewRow[];
  const newestCrew = crewList[0] ?? null;
  const totalCredits = crewList.reduce((sum, c) => sum + c.credits, 0);

  const crewCampaignIds = Array.from(new Set(crewList.map((c) => c.campaign_id).filter((id): id is string => id !== null)));
  const { data: pendingMissions } =
    crewCampaignIds.length > 0
      ? await supabase.from("missions").select("campaign_id").in("campaign_id", crewCampaignIds).eq("status", "planned")
      : { data: [] as { campaign_id: string }[] };
  const pendingCampaignIds = new Set((pendingMissions ?? []).map((m) => m.campaign_id));

  const teamRegisterCrews = crewList.map((crew) => ({
    id: crew.id,
    name: crew.name,
    credits: crew.credits,
    corps: crew.corps,
    captains: crew.captains,
    campaign: crew.campaigns,
    hasPendingMission: crew.campaign_id !== null && pendingCampaignIds.has(crew.campaign_id),
  }));

  if (!latestCampaign && !newestCrew) {
    return (
      <div className="hud-grid flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-display text-2xl tracking-[0.1em] text-text-default">Willkommen bei DystoCorp</p>
        <p className="max-w-sm font-mono text-xs leading-relaxed text-text-secondary">
          Leg dein erstes Team an oder tritt einer Kampagne bei, um loszulegen.
        </p>
        <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
          <Link href="/crews/new">
            <Button variant="cta" className="w-full">
              ＋ Erstes Team erstellen
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
    <div className="hud-grid flex min-h-screen flex-col">
      <div className="flex flex-wrap items-stretch border-b border-border bg-black/40 font-mono text-[14px] tracking-[0.05em] text-text-secondary">
        <span className="border-r border-border px-4 py-2 text-text-default">SYS_OP_1.09</span>
        <span className="border-r border-border px-4 py-2 text-accent">[ONLINE]</span>
        <span className="border-r border-border px-4 py-2">{(player?.display_name || user!.email)?.toUpperCase()}</span>
        {newestCrew?.corps ? (
          <span className="border-r border-border px-4 py-2 text-accent">{newestCrew.corps.name.toUpperCase()}</span>
        ) : null}
        <span className="border-r border-border px-4 py-2">{totalCredits.toLocaleString("de-DE")} CR</span>
        <span className="flex-1" />
        <Clock className="px-4 py-2" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-6 py-8 md:px-10">
        <PageHeader
          title="Übersicht"
          meta="Lagezentrum // v7.2"
          secondary={
            <Dialog>
              <DialogTrigger render={<Button variant="ghost">Kampagne beitreten</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kampagne beitreten</DialogTitle>
                  <DialogDescription>Lass dir die Kampagnen-ID von einem Mitspieler geben (auf der Kampagnen-Seite sichtbar).</DialogDescription>
                </DialogHeader>
                <JoinCampaignForm />
              </DialogContent>
            </Dialog>
          }
          cta={
            <Link href="/crews/new">
              <Button variant="cta">＋ Team Einstellen</Button>
            </Link>
          }
        />

        <div className="grid gap-3.5 sm:grid-cols-2">
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
        </div>

        <section className="flex flex-1 flex-col border border-border bg-black/60">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
              Team-Register // Aktive Einheiten
            </span>
            <span className="font-mono text-[14px] text-text-subtle">{String(crewList.length).padStart(2, "0")} GELISTET</span>
          </div>

          {crewList.length === 0 ? (
            <p className="px-4 py-6 font-mono text-xs text-text-secondary">Noch kein Team registriert.</p>
          ) : (
            <TeamRegister crews={teamRegisterCrews} />
          )}
        </section>

        {corps && corps.length > 0 ? (
          <section>
            <p className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Mega Corps</p>
            <div className="mt-2 grid gap-3.5 sm:grid-cols-2">
              {corps.map((corp) => (
                <Link key={corp.id} href={`/intel/corporations/${corp.id}`}>
                  <CorpCard corp={corpThemeSlug(corp.key) as CorpCardVariant} />
                </Link>
              ))}
              <Link href="/intel/corporations/subcontractor">
                <CorpCard corp="subcontractor" />
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
