import Link from "next/link";
import { CorpEmblem } from "@/components/corp-emblem";
import { CaptainDossier } from "./captain-dossier";
import { CrewMemberCard } from "./crew-member-card";
import { SoldierStatGrid, GearTags } from "./soldier-stat-grid";
import { Button } from "@/components/ui/button";

type Officer = {
  name: string;
  level?: number;
  move: number;
  fight: number;
  shoot: number;
  armour: number;
  will: number;
  health: number;
  current_health: number;
};

type SoldierType = {
  id: string;
  name: string;
  table_type: string;
  move: number;
  fight: number;
  shoot: number;
  armour: number;
  will: number;
  health: number;
};

type Soldier = {
  id: string;
  name: string | null;
  is_robot: boolean;
  current_health: number;
  bonus_gear: { id: string; name: string } | null;
  soldier_types: SoldierType | null;
};

type ShipUpgrade = { id: string; ship_upgrade_types: { name: string } | null };
type HoldItem = { id: string; custom_name: string | null; quantity: number; equipment_items: { name: string } | null };

function SoldierCard({
  soldier,
  gearByType,
}: {
  soldier: Soldier;
  gearByType: Record<string, { name: string; quantity: number }[]>;
}) {
  const type = soldier.soldier_types;
  if (!type) return null;

  const items = [
    ...(gearByType[type.id] ?? []),
    ...(soldier.bonus_gear ? [{ name: `${soldier.bonus_gear.name} (Bonus)`, quantity: 1 }] : []),
  ];

  return (
    <CrewMemberCard
      roleLabel={type.table_type === "specialist" ? "Specialist" : "Standard"}
      name={soldier.name || type.name}
      subLabel={soldier.name ? type.name : soldier.is_robot ? "Robot" : null}
      health={type.health}
      currentHealth={soldier.current_health}
    >
      <SoldierStatGrid stats={type} />
      <GearTags items={items} />
    </CrewMemberCard>
  );
}

// Default landing view when opening a crew: read-only, whether it's your
// own (finished) crew or a campaign teammate's. Owners get a "Bearbeiten"
// button into the tab-based edit UI (crews/[crewId]/edit); everyone else
// just sees the dossier.
export function CrewReadonlyView({
  crewId,
  crew,
  captain,
  captainBackgroundName,
  firstMate,
  firstMateBackgroundName,
  soldiers,
  crewShipUpgrades,
  holdItems,
  gearByType,
  corpSlug,
  isOwner = false,
}: {
  crewId: string;
  crew: { name: string; credits: number; experience: number; ship_name: string | null; corps: { name: string } | null };
  captain: Officer | null;
  captainBackgroundName: string | null;
  firstMate: Officer | null;
  firstMateBackgroundName: string | null;
  soldiers: Soldier[];
  crewShipUpgrades: ShipUpgrade[];
  holdItems: HoldItem[];
  gearByType: Record<string, { name: string; quantity: number }[]>;
  corpSlug?: string;
  isOwner?: boolean;
}) {
  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <CorpEmblem name={crew.corps?.name ?? "?"} slug={corpSlug} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs tracking-widest text-corp-accent uppercase">{crew.corps?.name}</p>
              <h1 className="truncate font-display text-2xl tracking-[2.5px] text-text-default">{crew.name}</h1>
            </div>
          </div>
          {isOwner ? (
            <Link href={`/crews/${crewId}/edit`} className="ml-auto shrink-0">
              <Button variant="outline">Bearbeiten</Button>
            </Link>
          ) : (
            <span className="ml-auto shrink-0 border border-border px-2 py-0.5 font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
              Nur-Lese-Ansicht
            </span>
          )}
        </div>
        <p className="mt-3 font-mono text-sm text-text-secondary">
          {crew.credits.toLocaleString("de-DE")} CR · {crew.experience} XP
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {captain ? <CaptainDossier captain={captain} backgroundName={captainBackgroundName} /> : null}
          {firstMate ? (
            <CaptainDossier captain={firstMate} backgroundName={firstMateBackgroundName} roleLabel="First-Mate-Dossier" />
          ) : null}
        </div>

        <section className="mt-8">
          <p className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
            Trupp-Register // {soldiers.length} Einheiten
          </p>
          {soldiers.length === 0 ? (
            <p className="mt-2 font-mono text-sm text-text-secondary">Keine Soldaten rekrutiert.</p>
          ) : (
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              {soldiers.map((s) => (
                <SoldierCard key={s.id} soldier={s} gearByType={gearByType} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 border border-border bg-bg-surface p-4">
          <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Schiff</span>
          <p className="mt-1 font-display text-lg font-semibold text-text-default">{crew.ship_name || "Unbenannt"}</p>

          {crewShipUpgrades.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2 font-mono text-[15px]">
              {crewShipUpgrades.map((u) => (
                <li key={u.id} className="border border-border px-2 py-1 text-text-default">
                  {u.ship_upgrade_types?.name ?? "?"}
                </li>
              ))}
            </ul>
          ) : null}

          {holdItems.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2 font-mono text-[15px] text-text-secondary">
              {holdItems.map((item) => (
                <li key={item.id} className="border border-border px-2 py-1">
                  {item.equipment_items?.name ?? item.custom_name} × {item.quantity}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>
    </div>
  );
}
