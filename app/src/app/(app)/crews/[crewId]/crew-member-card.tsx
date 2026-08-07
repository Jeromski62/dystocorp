import type { ReactNode } from "react";
import Image from "next/image";
import { StatusBadge } from "@/components/status-badge";
import { HealthTracker } from "@/components/health-tracker";

// Shared card chrome for any crew member's dossier -- Captain, First Mate,
// or an individual soldier. Per Figma "Dysto-Corp-Rough-Concept" Dossier
// redesign (node 2150:807): portrait next to a name/subtitle header with a
// status badge, a segmented health tracker, then stats/gear as children
// (StatLine, GearTags, ...) so callers compose whichever they need.
export function CrewMemberCard({
  roleLabel,
  name,
  level,
  subLabel,
  health,
  currentHealth,
  portraitUrl,
  isStunned = false,
  weaponJammed = false,
  children,
}: {
  roleLabel: string;
  name: string;
  level?: number;
  subLabel?: string | null;
  health: number;
  currentHealth: number;
  portraitUrl?: string | null;
  isStunned?: boolean;
  weaponJammed?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden border border-corp-accent/28 border-t-2 border-t-corp-accent bg-corp-surface">
      <div className="flex items-stretch justify-between gap-3 border-b border-corp-accent/22 p-4">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[12px] tracking-[0.08em] text-text-secondary uppercase">{roleLabel}</span>
              {typeof level === "number" ? <span className="font-mono text-[12px] text-corp-accent">LV {level}</span> : null}
            </div>
            <p className="mt-1 truncate font-display text-xl font-semibold tracking-[0.05em] text-text-default uppercase">
              {name}
            </p>
            {subLabel ? <p className="mt-0.5 truncate font-mono text-[13px] text-text-subtle">{subLabel}</p> : null}
          </div>
          <StatusBadge currentHealth={currentHealth} health={health} isStunned={isStunned} weaponJammed={weaponJammed} />
        </div>
        <div className="size-[104px] shrink-0 overflow-hidden border border-corp-accent/28 bg-black/60">
          <Image
            src={portraitUrl ?? "/dossiers/dossier_placeholder.png"}
            alt=""
            width={104}
            height={104}
            className="size-full object-cover"
          />
        </div>
      </div>

      <div className="p-4">
        <HealthTracker health={health} currentHealth={currentHealth} />
        <div className="mt-4 flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}
