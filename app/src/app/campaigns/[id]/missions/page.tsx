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

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name")
    .eq("id", campaignId)
    .maybeSingle();
  if (!campaign) notFound();

  const { data: missions } = await supabase
    .from("missions")
    .select("id, title, description, status, report_text, created_at")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  const sorted = [...(missions ?? [])].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

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

      <div className="mt-8 flex flex-col gap-4">
        {sorted.map((mission) => (
          <MissionCard
            key={mission.id}
            campaignId={campaignId}
            mission={{ ...mission, status: mission.status as "planned" | "ongoing" | "report" }}
          />
        ))}
      </div>
    </div>
  );
}
