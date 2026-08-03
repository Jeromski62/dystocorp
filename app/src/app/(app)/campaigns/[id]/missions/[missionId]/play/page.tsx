import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadPlayModeData } from "./load-play-data";
import { PlayModeShell } from "./play-mode-shell";

export default async function PlayModePage({
  params,
}: {
  params: Promise<{ id: string; missionId: string }>;
}) {
  const { id: campaignId, missionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const data = await loadPlayModeData(missionId);
  if (!data) notFound();
  if (data.mission.campaign_id !== campaignId) notFound();
  if (data.mission.status !== "ongoing") {
    redirect(`/campaigns/${campaignId}/missions`);
  }

  return <PlayModeShell data={data} currentUserId={user.id} />;
}
