"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CorpEmblem } from "@/components/corp-emblem";
import { corpThemeSlug } from "@/lib/corp-theme";
import { crewCampaignStatus } from "@/lib/crew-status";

export type TeamRegisterCrew = {
  id: string;
  name: string;
  credits: number;
  corps: { key: string; name: string } | null;
  captains: { name: string; level: number } | null;
  campaign: { id: string; name: string } | null;
  hasPendingMission: boolean;
};

// Each row navigates to the crew, but the status badge navigates elsewhere
// (campaign or mission list) — an <a> can't nest inside another <a>, so the
// row is a div with its own click/keyboard handling instead of a Link.
export function TeamRegister({ crews }: { crews: TeamRegisterCrew[] }) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-[2fr_1.2fr_1.4fr_0.7fr_1fr_1fr] gap-2 border-b border-border px-4 py-2 font-mono text-[14px] tracking-[0.05em] text-text-subtle uppercase">
        <span>Team</span>
        <span>Corp</span>
        <span>Captain</span>
        <span>Lvl</span>
        <span>Credits</span>
        <span>Status</span>
      </div>
      {crews.map((crew) => {
        const slug = crew.corps ? corpThemeSlug(crew.corps.key) : undefined;
        const status = crewCampaignStatus(crew.campaign, crew.hasPendingMission);
        const crewHref = `/crews/${crew.id}`;
        return (
          <div
            key={crew.id}
            role="link"
            tabIndex={0}
            onClick={() => router.push(crewHref)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(crewHref);
            }}
            className="grid min-w-[640px] cursor-pointer grid-cols-[2fr_1.2fr_1.4fr_0.7fr_1fr_1fr] items-center gap-2 border-b border-border/60 px-4 py-2.5 text-sm text-text-default last:border-b-0 hover:bg-accent/[0.06]"
          >
            <span className="font-medium tracking-[0.02em]">{crew.name}</span>
            <span className="flex items-center gap-2 font-mono text-[15px] text-accent">
              {crew.corps ? <CorpEmblem name={crew.corps.name} slug={slug} size={20} /> : null}
              {crew.corps?.name.toUpperCase() ?? "—"}
            </span>
            <span className="font-mono text-[15px] text-text-mid">{crew.captains?.name ?? "—"}</span>
            <span>{crew.captains?.level ?? "—"}</span>
            <span className="font-mono text-[15px]">{crew.credits.toLocaleString("de-DE")}</span>
            {status.href ? (
              <Link
                href={status.href}
                onClick={(e) => e.stopPropagation()}
                className={`w-fit font-mono text-[14px] ${status.className} hover:underline`}
              >
                ● {status.label}
              </Link>
            ) : (
              <span className={`font-mono text-[14px] ${status.className}`}>● {status.label}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
