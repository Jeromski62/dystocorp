"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  adjustCombatantHealth,
  cancelEndRoundRequest,
  confirmEndRound,
  markLastRound,
  requestEndRound,
  setCombatantStatus,
  type RoundStateRow,
} from "./actions";
import type { PlayCombatant } from "./load-play-data";
import { AimAssistCalculator } from "./aim-assist/calculator";
import { StatusBadge } from "@/components/status-badge";
import { HealthTracker } from "@/components/health-tracker";
import { StatLine, type StatColumn } from "@/components/stat-line";
import { CorpEmblem } from "@/components/corp-emblem";

type Crew = { id: string; name: string; player_id: string; corpName: string | null; corpSlug?: string };

type RoundState = {
  round_number: number;
  end_round_requested_by: string | null;
  end_round_requested_at: string | null;
};

export function RoundHud({
  campaignId,
  missionId,
  roundState,
  crews,
  combatants,
  currentUserId,
  onRoundStateChange,
}: {
  campaignId: string;
  missionId: string;
  roundState: RoundState;
  crews: Crew[];
  combatants: PlayCombatant[];
  currentUserId: string;
  onRoundStateChange: (row: RoundStateRow) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestedByMe = roundState.end_round_requested_by === currentUserId;
  const requested = roundState.end_round_requested_by !== null;

  function handleRequestEndRound() {
    setError(null);
    startTransition(async () => {
      const result = await requestEndRound(missionId);
      if (result.error) setError(result.error);
      else if (result.data) onRoundStateChange(result.data);
    });
  }

  function handleCancelRequest() {
    setError(null);
    startTransition(async () => {
      const result = await cancelEndRoundRequest(missionId);
      if (result.error) setError(result.error);
      else if (result.data) onRoundStateChange(result.data);
    });
  }

  function handleConfirmEndRound() {
    setError(null);
    startTransition(async () => {
      const result = await confirmEndRound(missionId);
      if (result.error) setError(result.error);
      else if (result.data) onRoundStateChange(result.data);
    });
  }

  function handleMarkLastRound() {
    if (!confirm("Debrief-Phase starten? Das gilt für beide Spieler.")) return;
    setError(null);
    startTransition(async () => {
      const result = await markLastRound(missionId);
      if (result.error) setError(result.error);
      else if (result.data) onRoundStateChange(result.data);
    });
  }

  function handleClearStatus(combatant: PlayCombatant) {
    setError(null);
    startTransition(async () => {
      const result = await setCombatantStatus({
        campaignId,
        missionId,
        crewId: combatant.crewId,
        kind: combatant.kind,
        id: combatant.id,
        isStunned: false,
        weaponJammed: false,
      });
      if (result.error) setError(result.error);
    });
  }

  function handleAdjustHealth(combatant: PlayCombatant, delta: number) {
    setError(null);
    startTransition(async () => {
      const result = await adjustCombatantHealth({
        campaignId,
        missionId,
        crewId: combatant.crewId,
        kind: combatant.kind,
        id: combatant.id,
        delta,
      });
      if (result.error) setError(result.error);
    });
  }

  const combatantsByCrew = new Map<string, PlayCombatant[]>();
  for (const c of combatants) {
    const list = combatantsByCrew.get(c.crewId) ?? [];
    list.push(c);
    combatantsByCrew.set(c.crewId, list);
  }

  // Own crew(s) first, opponent(s) below -- each player only ever sees
  // themself on top, not a fixed left-to-right order shared across viewers.
  const ownCrews = crews.filter((c) => c.player_id === currentUserId);
  const opponentCrews = crews.filter((c) => c.player_id !== currentUserId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {error ? <p className="mb-4 font-mono text-sm text-danger">{error}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-bg-surface p-4">
        <div>
          <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Runde</span>
          <p className="font-display text-3xl font-semibold text-text-default">{roundState.round_number}</p>
        </div>

        <Button type="button" onClick={() => setCalculatorOpen(true)}>
          Shooting Action loggen
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-border bg-bg-surface p-4">
        {!requested ? (
          <>
            <p className="text-sm text-text-secondary">Wer die Runde beenden will, muss die Zustimmung der anderen Person einholen.</p>
            <Button type="button" variant="outline" disabled={pending} onClick={handleRequestEndRound}>
              Runde beenden
            </Button>
          </>
        ) : requestedByMe ? (
          <>
            <p className="text-sm text-text-secondary">Warte auf Bestätigung der anderen Person…</p>
            <Button type="button" variant="outline" disabled={pending} onClick={handleCancelRequest}>
              Zurückziehen
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-text-secondary">Die andere Person möchte die Runde beenden.</p>
            <Button type="button" disabled={pending} onClick={handleConfirmEndRound}>
              Bestätigen
            </Button>
          </>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={handleMarkLastRound} className="text-xs text-text-secondary hover:text-corp-accent">
          Letzte Runde -- weiter zum Debrief →
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {ownCrews.map((crew) => (
          <div key={crew.id}>
            <div className="flex items-center gap-2">
              <CorpEmblem name={crew.corpName ?? crew.name} slug={crew.corpSlug} size={28} />
              <h3 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{crew.name}</h3>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(combatantsByCrew.get(crew.id) ?? []).map((c) => (
                <RosterTile
                  key={`${c.kind}-${c.id}`}
                  combatant={c}
                  onClearStatus={() => handleClearStatus(c)}
                  onAdjustHealth={(delta) => handleAdjustHealth(c, delta)}
                  disabled={pending}
                />
              ))}
            </div>
          </div>
        ))}

        {ownCrews.length > 0 && opponentCrews.length > 0 ? (
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-display text-sm font-bold tracking-[0.3em] text-corp-accent">VS</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        ) : null}

        {opponentCrews.map((crew) => (
          <div key={crew.id}>
            <div className="flex items-center gap-2">
              <CorpEmblem name={crew.corpName ?? crew.name} slug={crew.corpSlug} size={28} />
              <h3 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{crew.name}</h3>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(combatantsByCrew.get(crew.id) ?? []).map((c) => (
                <RosterTile
                  key={`${c.kind}-${c.id}`}
                  combatant={c}
                  onClearStatus={() => handleClearStatus(c)}
                  // Read-only for the opponent's units -- HP write access is
                  // owner-only (mirrors the adjust_combatant_health RPC's
                  // owns_crew() check), so no handler is passed here.
                  disabled={pending}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={calculatorOpen} onOpenChange={setCalculatorOpen}>
        <SheetContent>
          <AimAssistCalculator
            campaignId={campaignId}
            missionId={missionId}
            roundNumber={roundState.round_number}
            combatants={combatants}
            onResolved={() => setCalculatorOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Per Figma "Dysto-Corp-Rough-Concept" Dossier redesign (node 2150:807),
// same layout language as the read-only crew view's CrewMemberCard --
// portrait, name/subtitle header, status badge, segmented health tracker --
// but with the -/+ buttons wired to live since this is the interactive
// mission HUD, not a read-only summary.
function RosterTile({
  combatant,
  onClearStatus,
  onAdjustHealth,
  disabled,
}: {
  combatant: PlayCombatant;
  onClearStatus: () => void;
  onAdjustHealth?: (delta: number) => void;
  disabled: boolean;
}) {
  const roleLabel = combatant.kind === "captain" ? "Captain" : combatant.kind === "first_mate" ? "First Mate" : "Soldier";
  const statColumns: StatColumn[] = [
    { label: "M", value: `${combatant.move}"` },
    { label: "F", value: `+${combatant.fight}` },
    { label: "S", value: `+${combatant.shoot}` },
    { label: "A", value: String(combatant.armour) },
    { label: "W", value: `+${combatant.will}` },
  ];

  return (
    <div className="overflow-hidden border border-border bg-bg-raised">
      <div className="flex items-stretch justify-between gap-3 border-b border-border p-3">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-mono text-[12px] tracking-[0.08em] text-text-secondary uppercase">{roleLabel}</span>
              {combatant.isRobot ? <span className="font-mono text-[12px] text-text-subtle">Robot</span> : null}
            </div>
            <p className="mt-1 truncate font-display text-lg font-semibold text-text-default uppercase">{combatant.name}</p>
            {combatant.subLabel && combatant.subLabel !== roleLabel ? (
              <p className="mt-0.5 truncate font-mono text-[12px] text-text-subtle">{combatant.subLabel}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge
              currentHealth={combatant.currentHealth}
              health={combatant.health}
              isStunned={combatant.isStunned}
              weaponJammed={combatant.weaponJammed}
            />
            {combatant.isStunned || combatant.weaponJammed ? (
              <button
                type="button"
                disabled={disabled}
                onClick={onClearStatus}
                className="text-[11px] text-text-secondary hover:text-corp-accent"
              >
                zurücksetzen
              </button>
            ) : null}
          </div>
        </div>
        <div className="size-[88px] shrink-0 overflow-hidden border border-border bg-black/60">
          <Image
            src={combatant.portraitUrl ?? "/dossiers/dossier_placeholder.png"}
            alt=""
            width={88}
            height={88}
            className="size-full object-cover"
          />
        </div>
      </div>

      <div className="p-3">
        <HealthTracker health={combatant.health} currentHealth={combatant.currentHealth} onAdjust={onAdjustHealth} disabled={disabled} />
        <div className="mt-3">
          <StatLine columns={statColumns} />
        </div>
      </div>
    </div>
  );
}
