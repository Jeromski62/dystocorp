import type { ReactNode } from "react";
import Image from "next/image";

// Shared card chrome (corp-accent top border, health bar) for any crew
// member's dossier -- Captain, First Mate, or an individual soldier.
// Stat grid/gear are passed as children so callers can compose whichever
// they need (SoldierStatGrid, GearTags, ...).
export function CrewMemberCard({
  roleLabel,
  name,
  level,
  subLabel,
  health,
  currentHealth,
  portraitUrl,
  children,
}: {
  roleLabel: string;
  name: string;
  level?: number;
  subLabel?: string | null;
  health: number;
  currentHealth: number;
  portraitUrl?: string | null;
  children: ReactNode;
}) {
  const healthPct = Math.max(0, Math.min(100, (currentHealth / health) * 100));

  return (
    <div className="border border-corp-accent/28 border-t-2 border-t-corp-accent bg-corp-surface p-4">
      <div className="flex items-start gap-3">
        <div className="size-14 shrink-0 overflow-hidden border border-corp-accent/28 bg-black/60">
          <Image
            src={portraitUrl ?? "/dossiers/dossier_placeholder.png"}
            alt=""
            width={56}
            height={56}
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{roleLabel}</span>
            {typeof level === "number" ? <span className="font-mono text-[14px] text-corp-accent">LV {level}</span> : null}
          </div>
          <p className="mt-2 font-display text-xl font-semibold tracking-[0.05em] text-text-default">{name}</p>
          {subLabel ? <p className="mt-0.5 font-mono text-[14px] text-text-subtle">{subLabel}</p> : null}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between font-mono text-[14px] text-text-secondary uppercase">
        <span>Health</span>
        <span>
          {currentHealth} / {health}
        </span>
      </div>
      <div className="mt-1 h-[7px] border border-corp-accent/22 bg-black/40">
        <div className="h-full bg-corp-accent" style={{ width: `${healthPct}%` }} />
      </div>

      <div className="mt-3.5 flex flex-col gap-2">{children}</div>
    </div>
  );
}
