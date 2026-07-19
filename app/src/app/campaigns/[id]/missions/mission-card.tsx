"use client";

import { useState, useTransition } from "react";
import { startMission, submitMissionReport, updateMission } from "./actions";
import { CrewMissionResultForm } from "./crew-mission-result-form";

type MissionStatus = "planned" | "ongoing" | "report";

type Mission = {
  id: string;
  title: string;
  description: string | null;
  status: MissionStatus;
  report_text: string | null;
  session_date: string | null;
};

type Crew = { id: string; name: string; player_id: string };

type CrewResult = {
  id: string;
  crew_id: string;
  xp_delta: number;
  credits_delta: number;
  loot_notes: string | null;
  injury_notes: string | null;
  members_lost: string | null;
};

const STATUS_LABEL: Record<MissionStatus, string> = {
  planned: "Geplant",
  ongoing: "Läuft",
  report: "Abgeschlossen",
};

export function MissionCard({
  campaignId,
  mission,
  crews,
  myCrew,
  results,
}: {
  campaignId: string;
  mission: Mission;
  crews: Crew[];
  myCrew: Crew | null;
  results: CrewResult[];
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(mission.title);
  const [description, setDescription] = useState(mission.description ?? "");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState(mission.report_text ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function saveEdit() {
    setError(null);
    startTransition(async () => {
      const result = await updateMission(mission.id, campaignId, title, description.trim() || null);
      if (result.error) setError(result.error);
      else setEditing(false);
    });
  }

  function handleStartMission() {
    startTransition(async () => {
      await startMission(mission.id, campaignId);
    });
  }

  function saveReport() {
    setError(null);
    startTransition(async () => {
      const result = await submitMissionReport(mission.id, campaignId, reportText);
      if (result.error) setError(result.error);
      else setReportOpen(false);
    });
  }

  const badgeClass =
    mission.status === "ongoing"
      ? "bg-accent text-accent-foreground"
      : mission.status === "report"
        ? "border border-border text-text-secondary"
        : "border border-accent/40 text-accent";

  const myResult = myCrew ? (results.find((r) => r.crew_id === myCrew.id) ?? null) : null;
  const otherResults = results.filter((r) => r.crew_id !== myCrew?.id);
  const crewById = new Map(crews.map((c) => [c.id, c]));

  return (
    <article className="rounded-md border border-border bg-bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!editing ? <h2 className="font-semibold text-text-default">{mission.title}</h2> : null}
          <span className={`rounded-sm px-2 py-[3px] font-mono text-[11px] ${badgeClass}`}>{STATUS_LABEL[mission.status]}</span>
          {mission.session_date ? <span className="font-mono text-[11px] text-text-secondary">{mission.session_date}</span> : null}
        </div>
        {!editing ? (
          <button type="button" onClick={() => setEditing(true)} className="text-xs text-text-secondary hover:text-accent">
            Bearbeiten
          </button>
        ) : null}
      </div>

      {editing ? (
        <div className="mt-2 flex flex-col gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default focus:border-accent focus:outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was steht an? (optional)"
            rows={2}
            className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={saveEdit}
              className="self-start rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
            >
              {pending ? "Speichere…" : "Speichern"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setTitle(mission.title);
                setDescription(mission.description ?? "");
              }}
              className="text-sm text-text-secondary hover:text-text-default"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : mission.description ? (
        <p className="mt-2 whitespace-pre-line text-sm text-text-secondary">{mission.description}</p>
      ) : null}

      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}

      {mission.status === "planned" && !editing ? (
        <button
          type="button"
          disabled={pending}
          onClick={handleStartMission}
          className="mt-3 rounded-md border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
        >
          Spiel beginnt
        </button>
      ) : null}

      {mission.status === "ongoing" && !editing ? (
        reportOpen ? (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Wie ist es gelaufen?"
              rows={4}
              className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pending || !reportText.trim()}
                onClick={saveReport}
                className="self-start rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
              >
                {pending ? "Speichere…" : "Bericht speichern"}
              </button>
              <button type="button" onClick={() => setReportOpen(false)} className="text-sm text-text-secondary hover:text-text-default">
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="mt-3 rounded-md border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent hover:text-accent-foreground"
          >
            Bericht schreiben
          </button>
        )
      ) : null}

      {mission.status === "report" && !editing ? (
        reportOpen ? (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={4}
              className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default focus:border-accent focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                disabled={pending || !reportText.trim()}
                onClick={saveReport}
                className="self-start rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
              >
                {pending ? "Speichere…" : "Speichern"}
              </button>
              <button type="button" onClick={() => setReportOpen(false)} className="text-sm text-text-secondary hover:text-text-default">
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <p className="whitespace-pre-line text-sm text-text-default">{mission.report_text}</p>
            <button type="button" onClick={() => setReportOpen(true)} className="mt-2 text-xs text-text-secondary hover:text-accent">
              Bericht bearbeiten
            </button>
          </div>
        )
      ) : null}

      {mission.status !== "planned" ? (
        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Crew-Ergebnisse</h3>
          {myCrew ? (
            <CrewMissionResultForm
              campaignId={campaignId}
              missionId={mission.id}
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
          ) : null}
          {otherResults.map((r) => (
            <div key={r.id} className="rounded-md border border-border bg-bg-raised p-3 text-sm">
              <span className="font-medium text-text-default">{crewById.get(r.crew_id)?.name ?? "?"}</span>
              <p className="mt-1 text-xs text-text-secondary">
                {r.xp_delta >= 0 ? "+" : ""}
                {r.xp_delta} XP · {r.credits_delta >= 0 ? "+" : ""}
                {r.credits_delta}cr
              </p>
              {r.loot_notes ? <p className="mt-1 text-xs text-text-secondary">Loot: {r.loot_notes}</p> : null}
              {r.injury_notes ? <p className="mt-1 text-xs text-text-secondary">Verletzungen: {r.injury_notes}</p> : null}
              {r.members_lost ? <p className="mt-1 text-xs text-text-secondary">Verluste: {r.members_lost}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}
