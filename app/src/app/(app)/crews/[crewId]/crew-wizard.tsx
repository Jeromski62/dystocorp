"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { advanceWizardStep } from "./actions";
import { OfficerBuilder } from "./officer-builder";
import { SoldierRecruiter } from "./soldier-recruiter";
import { ShipPanel } from "./ship-panel";
import { CorpEmblem } from "@/components/corp-emblem";
import { EditCrewNameForm } from "./edit-crew-name-form";
import { Button } from "@/components/ui/button";
import type { CrewDetail } from "./load-crew-data";

const STEPS = [
  { n: 1, label: "Captain" },
  { n: 2, label: "First Mate" },
  { n: 3, label: "Soldiers" },
  { n: 4, label: "Ship" },
] as const;

// Step-gated creation flow: forward progress only unlocks by completing the
// current step (persisted server-side as crews.wizard_step, the furthest
// step reached), backward navigation is always free. Finishing step 4 marks
// the crew complete (crews.setup_completed_at) so every future open lands on
// the read-only view instead of back in the wizard.
export function CrewWizard(props: CrewDetail & { crewId: string }) {
  const {
    crewId,
    crew,
    corpSlug,
    backgrounds,
    corePowersByBackground,
    powers,
    equipment,
    captain,
    captainPowers,
    captainGear,
    firstMate,
    firstMatePowers,
    firstMateGear,
    soldierTypes,
    soldiers,
    maxSpecialists,
    gearByType,
    weaponContextByType,
    shipUpgradeTypes,
    crewShipUpgrades,
    holdItems,
  } = props;

  const [viewStep, setViewStep] = useState(Math.min(4, Math.max(1, crew.wizard_step)));
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const furthestStep = crew.wizard_step;
  const stepReady: Record<number, boolean> = {
    1: captain !== null,
    2: firstMate !== null,
    3: soldiers.length > 0,
    4: true,
  };
  const blockedReason: Record<number, string> = {
    1: "Speichere zuerst den Captain, um fortzufahren.",
    2: "Speichere zuerst den First Mate, um fortzufahren.",
    3: "Rekrutiere mindestens einen Soldier, um fortzufahren.",
    4: "",
  };

  function goTo(step: number) {
    if (step < 1 || step > 4 || step > furthestStep) return;
    setViewStep(step);
  }

  function handleNext() {
    if (!stepReady[viewStep]) return;
    startTransition(async () => {
      await advanceWizardStep(crewId, viewStep);
      if (viewStep >= 4) {
        router.push(`/crews/${crewId}`);
        router.refresh();
      } else {
        setViewStep((s) => Math.min(4, s + 1));
      }
    });
  }

  const inCampaign = !!crew.campaign_id;

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center gap-4">
          <CorpEmblem name={crew.corps?.name ?? "?"} slug={corpSlug} />
          <div>
            <p className="font-mono text-xs tracking-widest text-corp-accent uppercase">{crew.corps?.name}</p>
            <EditCrewNameForm crewId={crewId} name={crew.name} />
          </div>
        </div>
        <p className="mt-3 font-mono text-sm text-text-secondary">
          {crew.credits.toLocaleString("de-DE")} CR · Crew-Erstellung
        </p>

        <ol className="mt-8 flex flex-wrap items-center gap-2 font-mono text-[14px] uppercase tracking-[0.06em]">
          {STEPS.map((s, i) => {
            const reached = s.n <= furthestStep;
            const active = s.n === viewStep;
            return (
              <li key={s.n} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!reached}
                  onClick={() => goTo(s.n)}
                  className={
                    active
                      ? "border border-corp-accent bg-corp-accent px-3 py-1.5 text-corp-on-accent"
                      : reached
                        ? "border border-corp-accent/40 px-3 py-1.5 text-corp-accent hover:border-corp-accent"
                        : "cursor-not-allowed border border-border px-3 py-1.5 text-text-subtle"
                  }
                >
                  {s.n}. {s.label}
                </button>
                {i < STEPS.length - 1 ? <span className="text-text-subtle">→</span> : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-8">
          {viewStep === 1 ? (
            <OfficerBuilder
              key="captain"
              crewId={crewId}
              role="captain"
              inCampaign={inCampaign}
              backgrounds={backgrounds}
              corePowersByBackground={corePowersByBackground}
              powers={powers}
              equipment={equipment}
              existing={
                captain
                  ? {
                      name: captain.name,
                      backgroundId: captain.background_id,
                      chosenStatOptions: captain.chosen_stat_options,
                      powers: captainPowers.map((p) => ({ powerId: p.power_id, reduced: p.reduced })),
                      gearItemIds: captainGear.map((g) => g.equipment_item_id),
                    }
                  : null
              }
            />
          ) : null}

          {viewStep === 2 ? (
            <OfficerBuilder
              key="first_mate"
              crewId={crewId}
              role="first_mate"
              inCampaign={inCampaign}
              backgrounds={backgrounds}
              corePowersByBackground={corePowersByBackground}
              powers={powers}
              equipment={equipment}
              existing={
                firstMate
                  ? {
                      name: firstMate.name,
                      backgroundId: firstMate.background_id,
                      chosenStatOptions: firstMate.chosen_stat_options,
                      powers: firstMatePowers.map((p) => ({ powerId: p.power_id, reduced: p.reduced })),
                      gearItemIds: firstMateGear.map((g) => g.equipment_item_id),
                    }
                  : null
              }
            />
          ) : null}

          {viewStep === 3 ? (
            <SoldierRecruiter
              crewId={crewId}
              inCampaign={inCampaign}
              soldierTypes={soldierTypes}
              soldiers={soldiers}
              credits={crew.credits}
              maxSpecialists={maxSpecialists}
              gearByType={gearByType}
              weaponContextByType={weaponContextByType}
              equipment={equipment.map((e) => ({
                id: e.id,
                name: e.name,
                category: e.category,
                restrictions: e.restrictions,
                base_weapon_type: e.base_weapon_type,
              }))}
            />
          ) : null}

          {viewStep === 4 ? (
            <ShipPanel
              crewId={crewId}
              shipName={crew.ship_name}
              credits={crew.credits}
              shipUpgradeTypes={shipUpgradeTypes}
              crewShipUpgrades={crewShipUpgrades}
              equipment={equipment.map((e) => ({ id: e.id, name: e.name }))}
              holdItems={holdItems}
            />
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-corp-border pt-6">
          <Button variant="outline" disabled={viewStep === 1} onClick={() => goTo(viewStep - 1)}>
            ← Zurück
          </Button>
          <div className="flex items-center gap-3">
            {!stepReady[viewStep] ? (
              <span className="font-mono text-sm text-text-secondary">{blockedReason[viewStep]}</span>
            ) : null}
            <Button disabled={!stepReady[viewStep] || pending} onClick={handleNext}>
              {pending ? "…" : viewStep < 4 ? "Weiter →" : "Crew abschließen"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
