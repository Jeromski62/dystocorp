"use client";

import { useState, useTransition } from "react";
import { startMission, submitMissionReport, updateMission } from "./actions";

type MissionStatus = "planned" | "ongoing" | "report";

type Mission = {
  id: string;
  title: string;
  description: string | null;
  status: MissionStatus;
  report_text: string | null;
};

const STATUS_LABEL: Record<MissionStatus, string> = {
  planned: "Geplant",
  ongoing: "Läuft",
  report: "Abgeschlossen",
};

export function MissionCard({ campaignId, mission }: { campaignId: string; mission: Mission }) {
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

  return (
    <article className="rounded-md border border-border bg-bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!editing ? <h2 className="font-semibold text-text-default">{mission.title}</h2> : null}
          <span className={`rounded-sm px-2 py-[3px] font-mono text-[11px] ${badgeClass}`}>{STATUS_LABEL[mission.status]}</span>
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
    </article>
  );
}
