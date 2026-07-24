import { CorpEmblem } from "@/components/corp-emblem";
import { CaptainDossier } from "./captain-dossier";

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

type Soldier = {
  id: string;
  name: string | null;
  is_robot: boolean;
  current_health: number;
  soldier_types: { name: string; table_type: string; fight: number; shoot: number; health: number } | null;
};

type ShipUpgrade = { id: string; ship_upgrade_types: { name: string } | null };
type HoldItem = { id: string; custom_name: string | null; quantity: number; equipment_items: { name: string } | null };

function soldierStatus(current: number, max: number) {
  if (current <= 0) return { label: "AUSSER GEFECHT", className: "text-status-out" };
  if (current < max) return { label: "VERLETZT", className: "text-status-injured" };
  return { label: "BEREIT", className: "text-status-active" };
}

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
}: {
  crew: { name: string; credits: number; experience: number; ship_name: string | null; corps: { name: string } | null };
  captain: Officer | null;
  captainBackgroundName: string | null;
  firstMate: Officer | null;
  firstMateBackgroundName: string | null;
  soldiers: Soldier[];
  crewShipUpgrades: ShipUpgrade[];
  holdItems: HoldItem[];
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
            <div className="overflow-x-auto">
              <div className="grid min-w-[500px] grid-cols-[2fr_1fr_0.7fr_0.7fr_0.7fr_1fr] gap-2 border-b border-border px-4 py-2 font-mono text-[14px] tracking-[0.05em] text-text-subtle uppercase">
                <span>Einheit</span>
                <span>Typ</span>
                <span>FGT</span>
                <span>SHT</span>
                <span>HP</span>
                <span>Status</span>
              </div>
              {soldiers.map((s) => {
                const type = s.soldier_types;
                const status = soldierStatus(s.current_health, type?.health ?? s.current_health);
                return (
                  <div
                    key={s.id}
                    className="grid min-w-[500px] grid-cols-[2fr_1fr_0.7fr_0.7fr_0.7fr_1fr] items-center gap-2 border-b border-border/60 px-4 py-2.5 text-sm text-text-default last:border-b-0"
                  >
                    <span className="font-medium">{s.name || type?.name || "Soldat"}</span>
                    <span className="font-mono text-[15px] text-text-mid">{type?.name ?? "—"}</span>
                    <span>{type ? `+${type.fight}` : "—"}</span>
                    <span>{type ? `+${type.shoot}` : "—"}</span>
                    <span>{s.current_health}</span>
                    <span className={`font-mono text-[14px] ${status.className}`}>● {status.label}</span>
                  </div>
                );
              })}
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
