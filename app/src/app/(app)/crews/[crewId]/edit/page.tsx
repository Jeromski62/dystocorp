import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { loadCrewDetail } from "../load-crew-data";
import { Tabs } from "@/components/tabs";
import { OfficerBuilder } from "../officer-builder";
import { SoldierRecruiter } from "../soldier-recruiter";
import { ShipPanel } from "../ship-panel";
import { CorpEmblem } from "@/components/corp-emblem";
import { EditCrewNameForm } from "../edit-crew-name-form";
import { DeleteCrewButton } from "../delete-crew-button";

// Fast tab-based editing for an already-finished crew (Story 2) -- no
// wizard gating, jump freely between sections. Reached only via the
// explicit "Bearbeiten" button on the read-only view; the Captain dossier
// card that used to sit above these tabs is intentionally gone here.
export default async function CrewEditPage({
  params,
}: {
  params: Promise<{ crewId: string }>;
}) {
  const { crewId } = await params;
  const data = await loadCrewDetail(crewId);
  if (!data) notFound();
  if (!data.isOwner || !data.crew.setup_completed_at) redirect(`/crews/${crewId}`);

  const {
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
  } = data;
  const inCampaign = !!crew.campaign_id;

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href={`/crews/${crewId}`} className="font-mono text-[14px] text-text-secondary hover:text-corp-accent">
          ← Zurück zur Übersicht
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <CorpEmblem name={crew.corps?.name ?? "?"} slug={corpSlug} />
            <div>
              <p className="font-mono text-xs tracking-widest text-corp-accent uppercase">{crew.corps?.name}</p>
              <EditCrewNameForm crewId={crewId} name={crew.name} />
            </div>
          </div>
          <DeleteCrewButton crewId={crewId} crewName={crew.name} />
        </div>
        <p className="mt-3 font-mono text-sm text-text-secondary">
          {crew.credits.toLocaleString("de-DE")} CR · {crew.experience} XP
        </p>

        <div className="mt-8">
          <Tabs
            tabs={[
              {
                label: "Captain",
                content: (
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
                ),
              },
              {
                label: "First Mate",
                content: (
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
                ),
              },
              {
                label: "Soldiers",
                content: (
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
                ),
              },
              {
                label: "Ship",
                content: (
                  <ShipPanel
                    crewId={crewId}
                    shipName={crew.ship_name}
                    credits={crew.credits}
                    shipUpgradeTypes={shipUpgradeTypes}
                    crewShipUpgrades={crewShipUpgrades}
                    equipment={equipment.map((e) => ({ id: e.id, name: e.name }))}
                    holdItems={holdItems}
                  />
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
