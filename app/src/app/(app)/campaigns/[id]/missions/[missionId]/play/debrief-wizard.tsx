"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CrewMissionResultForm } from "../../crew-mission-result-form";
import { submitMissionReport } from "../../actions";

type Crew = { id: string; name: string; player_id: string };

type CombatLogEntry = {
  id: string;
  round_number: number;
  shooter_crew_id: string;
  target_crew_id: string | null;
  target_died: boolean;
  damage: number | null;
  result: string;
  attack_type: string;
  shooter_kind: string;
  target_kind: string | null;
  created_at: string;
};

type CrewSessionResult = {
  id: string;
  crew_id: string;
  xp_delta: number;
  credits_delta: number;
  loot_notes: string | null;
  injury_notes: string | null;
  members_lost: string | null;
};

// Phase 3 + 4 combined (PRD: both run "per player individually", so one
// screen covers both) -- reuses the existing crew_session_results model via
// CrewMissionResultForm and the existing submitMissionReport action rather
// than introducing new schema, per the confirmed scope decision.
export function DebriefWizard({
  campaignId,
  missionId,
  missionTitle,
  reportText,
  crews,
  currentUserId,
  combatLog,
  crewSessionResults,
}: {
  campaignId: string;
  missionId: string;
  missionTitle: string;
  reportText: string | null;
  crews: Crew[];
  currentUserId: string;
  combatLog: CombatLogEntry[];
  crewSessionResults: CrewSessionResult[];
}) {
  const myCrew = crews.find((c) => c.player_id === currentUserId) ?? null;
  const crewById = new Map(crews.map((c) => [c.id, c]));

  const achievements = myCrew ? combatLog.filter((l) => l.shooter_crew_id === myCrew.id && l.target_died) : [];
  const losses = myCrew ? combatLog.filter((l) => l.target_crew_id === myCrew.id && l.target_died) : [];

  const myResult = myCrew ? (crewSessionResults.find((r) => r.crew_id === myCrew.id) ?? null) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h2 className="font-display text-sm tracking-[2px] text-text-secondary uppercase">Debrief -- {missionTitle}</h2>
      <p className="mt-1 text-xs text-text-subtle">Loot, Mission-Outcome und Bericht laufen pro Spieler einzeln.</p>

      {myCrew ? (
        <section className="mt-6">
          <h3 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Gefallene Gegner"}</h3>
          {achievements.length === 0 ? (
            <p className="mt-2 text-sm text-text-subtle">Keine erledigten Figuren dieser Runde protokolliert.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1 text-sm text-text-default">
              {achievements.map((a) => (
                <li key={a.id}>
                  Runde {a.round_number}: {a.target_kind} von {crewById.get(a.target_crew_id ?? "")?.name ?? "?"} erledigt ({a.damage} Schaden)
                </li>
              ))}
            </ul>
          )}

          <h3 className="mt-4 font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Eigene Verluste"}</h3>
          {losses.length === 0 ? (
            <p className="mt-2 text-sm text-text-subtle">Keine eigenen Verluste protokolliert.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1 text-sm text-text-default">
              {losses.map((l) => (
                <li key={l.id}>
                  Runde {l.round_number}: eigener {l.target_kind} gefallen
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <section className="mt-6">
        <h3 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Loot & Mission-Outcome"}</h3>
        {myCrew ? (
          <div className="mt-2">
            <CrewMissionResultForm
              campaignId={campaignId}
              missionId={missionId}
              crewId={myCrew.id}
              crewName={myCrew.name}
              existing={
                myResult
                  ? {
                      xpDelta: myResult.xp_delta,
                      creditsDelta: myResult.credits_delta,
                      lootNotes: myResult.loot_notes,
                      injuryNotes: myResult.injury_notes,
                      membersLost: myResult.members_lost,
                    }
                  : null
              }
            />
          </div>
        ) : (
          <p className="mt-2 text-sm text-text-subtle">Kein eigenes Team an dieser Mission beteiligt.</p>
        )}
      </section>

      <LoreStep campaignId={campaignId} missionId={missionId} initialText={reportText} />

      <Link href={`/campaigns/${campaignId}/missions`} className="mt-6 inline-block text-xs text-text-secondary hover:text-corp-accent">
        ← Zurück zu Missionen
      </Link>
    </div>
  );
}

function LoreStep({ campaignId, missionId, initialText }: { campaignId: string; missionId: string; initialText: string | null }) {
  const [reportText, setReportText] = useState(initialText ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(!!initialText);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await submitMissionReport(missionId, campaignId, reportText);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <section className="mt-6">
      <h3 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Lore"}</h3>
      <textarea
        value={reportText}
        onChange={(e) => {
          setReportText(e.target.value);
          setSaved(false);
        }}
        placeholder="Wie ist es gelaufen?"
        rows={5}
        className="mt-2 w-full rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
      />
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      <Button type="button" disabled={pending || !reportText.trim()} onClick={handleSave} className="mt-2">
        {pending ? "Speichere…" : saved ? "Gespeichert" : "Bericht speichern & Mission abschließen"}
      </Button>
    </section>
  );
}
