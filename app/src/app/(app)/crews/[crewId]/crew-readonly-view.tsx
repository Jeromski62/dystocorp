import { CorpEmblem } from "@/components/corp-emblem";
import { CaptainDossier } from "./captain-dossier";
import { SoldierStatGrid, GearTags } from "./soldier-stat-grid";
import { StatusBadge } from "@/components/status-badge";

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

// Read-only counterpart to the crew edit UI (CrewPage), shown to campaign
// teammates viewing someone else's crew — only the owning player gets the
// editable tabs (OfficerBuilder/SoldierRecruiter/ShipPanel).
export function CrewReadonlyView({
  crew,
  captain,
  captainBackgroundName,
  firstMate,
  firstMateBackgroundName,
  soldiers,
  crewShipUpgrades,
  holdItems,
  gearByType,
}: {
  crew: { name: string; credits: number; experience: number; ship_name: string | null; corps: { name: string } | null };
  captain: Officer | null;
  captainBackgroundName: string | null;
  firstMate: Officer | null;
  firstMateBackgroundName: string | null;
  soldiers: Soldier[];
  crewShipUpgrades: ShipUpgrade[];
  holdItems: HoldItem[];
  gearByType: Record<string, { name: string; quantity: number }[]>;
}) {
  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center gap-4">
          <CorpEmblem name={crew.corps?.name ?? "?"} />
          <div>
            <p className="font-mono text-xs tracking-widest text-corp-accent uppercase">{crew.corps?.name}</p>
            <h1 className="font-display text-2xl tracking-[2.5px] text-text-default">{crew.name}</h1>
          </div>
          <span className="ml-auto border border-border px-2 py-0.5 font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
            Nur-Lese-Ansicht
          </span>
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

        <section className="mt-8 flex flex-col border border-border bg-bg-surface">
          <div className="border-b border-border px-4 py-2.5">
            <span className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
              Trupp-Register // {soldiers.length} Einheiten
            </span>
          </div>
          {soldiers.length === 0 ? (
            <p className="px-4 py-6 font-mono text-sm text-text-secondary">Keine Soldaten rekrutiert.</p>
          ) : (
            soldiers.map((s) => {
              const type = s.soldier_types;
              return (
                <div key={s.id} className="border-b border-border/60 px-4 py-3 last:border-b-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-text-default">
                      {s.name || type?.name || "Soldat"}
                      {type ? (
                        <span className="ml-2 font-mono text-[14px] text-text-secondary uppercase">
                          {type.table_type === "specialist" ? "Specialist" : "Standard"}
                        </span>
                      ) : null}
                    </span>
                    <StatusBadge currentHealth={s.current_health} health={type?.health ?? s.current_health} />
                  </div>
                  {type ? (
                    <>
                      <div className="mt-2.5">
                        <SoldierStatGrid stats={type} />
                      </div>
                      <GearTags
                        items={[
                          ...(gearByType[type.id] ?? []),
                          ...(s.bonus_gear ? [{ name: `${s.bonus_gear.name} (Bonus)`, quantity: 1 }] : []),
                        ]}
                      />
                    </>
                  ) : null}
                </div>
              );
            })
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
