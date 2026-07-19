import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewMissionForm } from "./new-mission-form";
import { MissionCard } from "./mission-card";

const STATUS_ORDER: Record<string, number> = { ongoing: 0, planned: 1, report: 2 };

export default async function MissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: campaignId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name")
    .eq("id", campaignId)
    .maybeSingle();
  if (!campaign) notFound();

  const [{ data: missions }, { data: crews }] = await Promise.all([
    supabase
      .from("missions")
      .select("id, title, description, status, report_text, session_date, created_at")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false }),
    supabase.from("crews").select("id, name, player_id").eq("campaign_id", campaignId),
  ]);

  const missionIds = (missions ?? []).map((m) => m.id);
  const { data: allResults } =
    missionIds.length > 0
      ? await supabase
          .from("crew_session_results")
          .select("id, mission_id, crew_id, xp_delta, credits_delta, loot_notes, injury_notes, members_lost")
          .in("mission_id", missionIds)
      : { data: [] };

  const myCrew = (crews ?? []).find((c) => c.player_id === user!.id) ?? null;

  const resultsByMission = new Map<string, typeof allResults>();
  for (const r of allResults ?? []) {
    const list = resultsByMission.get(r.mission_id) ?? [];
    list.push(r);
    resultsByMission.set(r.mission_id, list);
  }

  const sorted = [...(missions ?? [])].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  const current = sorted.filter((m) => m.status !== "report");
  const history = sorted.filter((m) => m.status === "report");

  function renderCard(mission: (typeof sorted)[number]) {
    return (
      <MissionCard
        key={mission.id}
        campaignId={campaignId}
        mission={{ ...mission, status: mission.status as "planned" | "ongoing" | "report" }}
        crews={crews ?? []}
        myCrew={myCrew}
        results={resultsByMission.get(mission.id) ?? []}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href={`/campaigns/${campaignId}`} className="text-xs text-text-secondary hover:text-accent">
        ← {campaign.name}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-text-default">Missionen</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Plant die nächste Mission, markiert sie als laufend, sobald ihr spielt, und schreibt danach den Bericht.
      </p>

      <div className="mt-6">
        <NewMissionForm campaignId={campaignId} />
      </div>

      <div className="mt-8 flex flex-col gap-4">{current.map(renderCard)}</div>

      {history.length > 0 ? (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Verlauf</h2>
          <div className="mt-4 flex flex-col gap-4">{history.map(renderCard)}</div>
        </div>
      ) : null}
    </div>
  );
}
