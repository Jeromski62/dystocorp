"use client";

import Link from "next/link";
import { useRealtimeRow } from "@/lib/supabase/use-realtime-row";
import { SetupScreen } from "./setup-screen";
import { RoundHud } from "./round-hud";
import { DebriefWizard } from "./debrief-wizard";
import type { PlayModeData } from "./load-play-data";

type RoundStateRow = {
  mission_id: string;
  phase: string;
  round_number: number;
  active_crew_id: string | null;
  end_round_requested_by: string | null;
  end_round_requested_at: string | null;
};

export function PlayModeShell({
  data,
  currentUserId,
}: {
  data: PlayModeData;
  currentUserId: string;
}) {
  const { mission, roundState: initialRoundState, crews, combatants, combatLog, crewSessionResults } = data;
  const roundState = useRealtimeRow<RoundStateRow>(
    "mission_round_state",
    { column: "mission_id", value: mission.id },
    initialRoundState as RoundStateRow
  );

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 pt-6">
        <Link href={`/campaigns/${mission.campaign_id}/missions`} className="font-mono text-xs text-text-secondary hover:text-corp-accent">
          ← Missionen
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[0.05em] text-text-default uppercase">{mission.title}</h1>
        {mission.subtitle ? <p className="font-mono text-sm text-text-secondary">{mission.subtitle}</p> : null}
      </div>

      {roundState.phase === "setup" ? (
        <SetupScreen missionId={mission.id} setupText={mission.job_board_missions?.setup_text ?? null} />
      ) : null}

      {roundState.phase === "round" ? (
        <RoundHud
          campaignId={mission.campaign_id}
          missionId={mission.id}
          roundState={roundState}
          crews={crews}
          combatants={combatants}
          currentUserId={currentUserId}
        />
      ) : null}

      {roundState.phase === "debrief" ? (
        <DebriefWizard
          campaignId={mission.campaign_id}
          missionId={mission.id}
          missionTitle={mission.title}
          reportText={mission.report_text}
          crews={crews}
          currentUserId={currentUserId}
          combatLog={combatLog}
          crewSessionResults={crewSessionResults}
        />
      ) : null}
    </div>
  );
}
