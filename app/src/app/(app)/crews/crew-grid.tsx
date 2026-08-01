"use client";

import { useMemo, useState } from "react";
import { corpThemeSlug } from "@/lib/corp-theme";
import { CrewCard } from "@/components/crew-card";

type Crew = {
  id: string;
  name: string;
  credits: number;
  experience: number;
  campaigns: { name: string } | null;
  corps: { key: string; name: string } | null;
  unitCount: number;
};

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
            onClick={() => setFilter(slug)}
            className={
              filter === slug
                ? "border border-white bg-white px-3 py-1.5 text-black"
                : "border border-border px-3 py-1.5 text-text-secondary hover:text-text-default"
            }
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((crew) => {
          const slug = crew.corps ? corpThemeSlug(crew.corps.key) : undefined;
          return (
            <CrewCard
              key={crew.id}
              href={`/crews/${crew.id}`}
              corpSlug={slug}
              corpName={crew.corps?.name}
              teamName={crew.name}
              metaLine={crew.campaigns?.name ?? "Ohne Kampagne"}
              fte={crew.unitCount}
              xp={crew.experience}
              cr={crew.credits}
            />
          );
        })}
      </div>
    </div>
  );
}
