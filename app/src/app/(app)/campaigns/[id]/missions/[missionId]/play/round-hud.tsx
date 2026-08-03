"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  cancelEndRoundRequest,
  confirmEndRound,
  markLastRound,
  requestEndRound,
  setActiveCrew,
  setCombatantStatus,
} from "./actions";
import type { PlayCombatant } from "./load-play-data";
import { AimAssistCalculator } from "./aim-assist/calculator";

type Crew = { id: string; name: string; player_id: string };

type RoundState = {
  round_number: number;
  active_crew_id: string | null;
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
}: {
  campaignId: string;
  missionId: string;
  roundState: RoundState;
  crews: Crew[];
  combatants: PlayCombatant[];
  currentUserId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  const requestedByMe = roundState.end_round_requested_by === currentUserId;
  const requested = roundState.end_round_requested_by !== null;

  function handleSetActiveCrew(crewId: string | null) {
    startTransition(async () => {
      await setActiveCrew(missionId, crewId);
    });
  }

  function handleRequestEndRound() {
    startTransition(async () => {
      await requestEndRound(missionId);
    });
  }

  function handleCancelRequest() {
    startTransition(async () => {
      await cancelEndRoundRequest(missionId);
    });
  }

  function handleConfirmEndRound() {
    startTransition(async () => {
      await confirmEndRound(missionId);
    });
  }

  function handleMarkLastRound() {
    if (!confirm("Debrief-Phase starten? Das gilt für beide Spieler.")) return;
    startTransition(async () => {
      await markLastRound(missionId);
    });
  }

  function handleClearStatus(combatant: PlayCombatant) {
    startTransition(async () => {
      await setCombatantStatus({
        campaignId,
        missionId,
        crewId: combatant.crewId,
        kind: combatant.kind,
        id: combatant.id,
        isStunned: false,
        weaponJammed: false,
      });
    });
  }

  const combatantsByCrew = new Map<string, PlayCombatant[]>();
  for (const c of combatants) {
    const list = combatantsByCrew.get(c.crewId) ?? [];
    list.push(c);
    combatantsByCrew.set(c.crewId, list);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-bg-surface p-4">
        <div>
          <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Runde</span>
          <p className="font-display text-3xl font-semibold text-text-default">{roundState.round_number}</p>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Aktiv</span>
          <div className="flex flex-wrap gap-1.5">
            {crews.map((crew) => (
              <button
                key={crew.id}
                type="button"
                disabled={pending}
                onClick={() => handleSetActiveCrew(roundState.active_crew_id === crew.id ? null : crew.id)}
                className={`px-2.5 py-1 font-mono text-[13px] uppercase ${
                  roundState.active_crew_id === crew.id
                    ? "border border-corp-accent bg-corp-accent/20 text-corp-accent"
                    : "border border-border text-text-secondary hover:border-corp-accent"
                }`}
              >
                {crew.name}
              </button>
            ))}
          </div>
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
        {crews.map((crew) => (
          <div key={crew.id}>
            <h3 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{crew.name}</h3>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {(combatantsByCrew.get(crew.id) ?? []).map((c) => (
                <RosterTile key={`${c.kind}-${c.id}`} combatant={c} onClearStatus={() => handleClearStatus(c)} disabled={pending} />
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

function RosterTile({
  combatant,
  onClearStatus,
  disabled,
}: {
  combatant: PlayCombatant;
  onClearStatus: () => void;
  disabled: boolean;
}) {
  const healthPct = Math.max(0, Math.min(100, (combatant.currentHealth / combatant.health) * 100));
  const roleLabel = combatant.kind === "captain" ? "Captain" : combatant.kind === "first_mate" ? "First Mate" : "Soldier";

  return (
    <div className="border border-border bg-bg-raised p-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[12px] tracking-[0.08em] text-text-secondary uppercase">{roleLabel}</span>
        {combatant.isRobot ? <span className="font-mono text-[12px] text-text-subtle">Robot</span> : null}
      </div>
      <p className="font-display text-base font-semibold text-text-default">{combatant.name}</p>
      <div className="mt-1.5 flex items-baseline justify-between font-mono text-[12px] text-text-secondary">
        <span>HP</span>
        <span>
          {combatant.currentHealth} / {combatant.health}
        </span>
      </div>
      <div className="mt-1 h-[5px] border border-corp-accent/22 bg-black/40">
        <div className="h-full bg-corp-accent" style={{ width: `${healthPct}%` }} />
      </div>

      {(combatant.isStunned || combatant.weaponJammed) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {combatant.isStunned ? (
            <span className="border border-danger/40 px-1.5 py-0.5 font-mono text-[11px] text-danger uppercase">Stunned</span>
          ) : null}
          {combatant.weaponJammed ? (
            <span className="border border-danger/40 px-1.5 py-0.5 font-mono text-[11px] text-danger uppercase">Jam</span>
          ) : null}
          <button type="button" disabled={disabled} onClick={onClearStatus} className="text-[11px] text-text-secondary hover:text-corp-accent">
            zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
}
