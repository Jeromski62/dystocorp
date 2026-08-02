"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { startMission, submitMissionReport, updateMission } from "./actions";
import { CrewMissionResultForm } from "./crew-mission-result-form";
import { Button } from "@/components/ui/button";
import { JobSelect, type Job } from "./job-select";

type MissionStatus = "planned" | "ongoing" | "report";

type Mission = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  status: MissionStatus;
  report_text: string | null;
  session_date: string | null;
  job_board_mission_id: string | null;
  job_board_missions: { id: string; title: string } | null;
};

const MISSION_TITLE_MAX_LENGTH = 30;

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
  jobs,
}: {
  campaignId: string;
  mission: Mission;
  crews: Crew[];
  myCrew: Crew | null;
  results: CrewResult[];
  jobs: Job[];
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(mission.title);
  const [subtitle, setSubtitle] = useState(mission.subtitle ?? "");
  const [description, setDescription] = useState(mission.description ?? "");
  const [jobId, setJobId] = useState(mission.job_board_mission_id ?? "");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState(mission.report_text ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function saveEdit() {
    setError(null);
    startTransition(async () => {
      const result = await updateMission(
        mission.id,
        campaignId,
        title,
        subtitle.trim() || null,
        description.trim() || null,
        jobId || null
      );
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
      ? "border border-status-active/40 text-status-active"
      : mission.status === "report"
        ? "border border-border text-text-secondary"
        : "border border-corp-accent/40 text-corp-accent";

  const myResult = myCrew ? (results.find((r) => r.crew_id === myCrew.id) ?? null) : null;
  const otherResults = results.filter((r) => r.crew_id !== myCrew?.id);
  const crewById = new Map(crews.map((c) => [c.id, c]));

  return (
    <article className="border border-border bg-bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {!editing ? (
            <div>
              <h2 className="font-display text-lg font-semibold tracking-[0.03em] text-text-default uppercase">{mission.title}</h2>
              {mission.subtitle ? <p className="font-mono text-[14px] text-text-secondary">{mission.subtitle}</p> : null}
            </div>
          ) : null}
          <span className={`px-2 py-[3px] font-mono text-[14px] tracking-[0.05em] uppercase ${badgeClass}`}>
            {STATUS_LABEL[mission.status]}
          </span>
          {mission.session_date ? <span className="font-mono text-[15px] text-text-secondary">{mission.session_date}</span> : null}
        </div>
        {!editing ? (
          <button type="button" onClick={() => setEditing(true)} className="text-xs text-text-secondary hover:text-corp-accent">
            Bearbeiten
          </button>
        ) : null}
      </div>

      {editing ? (
        <div className="mt-2 flex flex-col gap-2">
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MISSION_TITLE_MAX_LENGTH}
              className="w-full rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default focus:border-corp-accent focus:outline-none"
            />
            <p className="mt-1 text-right font-mono text-[11px] text-text-subtle">
              {title.length}/{MISSION_TITLE_MAX_LENGTH}
            </p>
          </div>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Untertitel (optional)"
            className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was steht an? (optional)"
            rows={2}
            className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
          />
          <JobSelect jobs={jobs} value={jobId} onChange={setJobId} />
          <div className="flex gap-2">
            <Button type="button" disabled={pending} onClick={saveEdit} className="self-start">
              {pending ? "Speichere…" : "Speichern"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setTitle(mission.title);
                setSubtitle(mission.subtitle ?? "");
                setDescription(mission.description ?? "");
                setJobId(mission.job_board_mission_id ?? "");
              }}
              className="text-sm text-text-secondary hover:text-text-default"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <>
          {mission.description ? <p className="mt-2 whitespace-pre-line text-sm text-text-secondary">{mission.description}</p> : null}
          {mission.job_board_missions ? (
            <Link href={`/jobs/${mission.job_board_missions.id}`} className="mt-2 inline-block text-xs text-corp-accent hover:underline">
              Job: {mission.job_board_missions.title} →
            </Link>
          ) : null}
        </>
      )}

      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}

      {mission.status === "planned" && !editing ? (
        <Button type="button" disabled={pending} onClick={handleStartMission} className="mt-3">
          Spiel beginnt
        </Button>
      ) : null}

      {mission.status === "ongoing" && !editing ? (
        reportOpen ? (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Wie ist es gelaufen?"
              rows={4}
              className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
            />
            <div className="flex gap-2">
              <Button type="button" disabled={pending || !reportText.trim()} onClick={saveReport} className="self-start">
                {pending ? "Speichere…" : "Bericht speichern"}
              </Button>
              <button type="button" onClick={() => setReportOpen(false)} className="text-sm text-text-secondary hover:text-text-default">
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <Button type="button" onClick={() => setReportOpen(true)} className="mt-3">
            Bericht schreiben
          </Button>
        )
      ) : null}

      {mission.status === "report" && !editing ? (
        reportOpen ? (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              rows={4}
              className="rounded-md border border-border bg-bg-body px-3 py-2 text-sm text-text-default focus:border-corp-accent focus:outline-none"
            />
            <div className="flex gap-2">
              <Button type="button" disabled={pending || !reportText.trim()} onClick={saveReport} className="self-start">
                {pending ? "Speichere…" : "Speichern"}
              </Button>
              <button type="button" onClick={() => setReportOpen(false)} className="text-sm text-text-secondary hover:text-text-default">
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <p className="whitespace-pre-line text-sm text-text-default">{mission.report_text}</p>
            <button type="button" onClick={() => setReportOpen(true)} className="mt-2 text-xs text-text-secondary hover:text-corp-accent">
              Bericht bearbeiten
            </button>
          </div>
        )
      ) : null}

      {mission.status !== "planned" ? (
        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3">
          <h3 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Team-Ergebnisse"}</h3>
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
