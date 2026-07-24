"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { corpThemeSlug } from "@/lib/corp-theme";

type Crew = {
  id: string;
  name: string;
  credits: number;
  campaigns: { name: string } | null;
  corps: { key: string; name: string } | null;
  captains: { level: number; current_health: number; health: number } | null;
  unitCount: number;
};

function crewStatus(captain: Crew["captains"]) {
  if (!captain) return { label: "AKTIV", className: "text-status-active" };
  if (captain.current_health <= 0) return { label: "AUSSER GEFECHT", className: "text-status-out" };
  if (captain.current_health < captain.health) return { label: "VERLETZT", className: "text-status-injured" };
  return { label: "AKTIV", className: "text-status-active" };
}

export function CrewGrid({ crews }: { crews: Crew[] }) {
  const corpsPresent = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of crews) {
      if (c.corps) seen.set(corpThemeSlug(c.corps.key), c.corps.name);
    }
    return Array.from(seen.entries());
  }, [crews]);

  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? crews : crews.filter((c) => c.corps && corpThemeSlug(c.corps.key) === filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[14px] tracking-[0.06em] uppercase">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "border border-white bg-white px-3 py-1.5 text-black"
              : "border border-border px-3 py-1.5 text-text-secondary hover:text-text-default"
          }
        >
          Alle
        </button>
        {corpsPresent.map(([slug, name]) => (
          <button
            key={slug}
            type="button"
            data-corp={slug}
            onClick={() => setFilter(slug)}
            className={
              filter === slug
                ? "border border-corp-accent bg-corp-accent px-3 py-1.5 text-corp-on-accent"
                : "border border-corp-accent/40 px-3 py-1.5 text-corp-accent hover:border-corp-accent"
            }
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((crew) => {
          const slug = crew.corps ? corpThemeSlug(crew.corps.key) : undefined;
          const status = crewStatus(crew.captains);
          return (
            <Link
              key={crew.id}
              href={`/crews/${crew.id}`}
              data-corp={slug}
              className={`border p-4 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                slug
                  ? "border-corp-accent/30 border-t-2 border-t-corp-accent bg-corp-surface hover:border-corp-accent/60"
                  : "border-border bg-bg-surface hover:border-accent"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg font-semibold tracking-[0.03em] text-text-default uppercase">{crew.name}</span>
                <span className={`font-mono text-[14px] ${status.className}`}>● {status.label}</span>
              </div>
              <p className="mt-1 font-mono text-[14px] text-text-secondary uppercase">
                {crew.corps?.name ?? "—"} · {crew.campaigns?.name ?? "Ohne Kampagne"}
              </p>
              <div className="mt-3.5 flex gap-4 font-mono text-[15px] text-text-secondary">
                {crew.captains ? (
                  <span>
                    LV <b className="text-text-default">{crew.captains.level}</b>
                  </span>
                ) : null}
                <span>{crew.unitCount} EINH.</span>
                <span className={slug ? "text-corp-accent" : "text-text-default"}>{crew.credits.toLocaleString("de-DE")} CR</span>
              </div>
            </Link>
          );
        })}

        <Link
          href="/crews/new"
          className="flex flex-col items-center justify-center gap-2 border border-white/18 p-4 text-center font-display text-sm font-semibold tracking-[0.06em] text-text-secondary uppercase transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-white/40 hover:text-text-default"
        >
          ＋ Crew registrieren
        </Link>
      </div>
    </div>
  );
}
