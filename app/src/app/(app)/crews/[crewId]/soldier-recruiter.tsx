"use client";

import { useState, useTransition } from "react";
import { addSoldier, removeSoldier, setSoldierBonusGear, setSoldierName, setSoldierRobot } from "./actions";
import {
  EQUIPMENT_CATEGORY_LABELS,
  SOLDIER_RULES,
  isSoldierEligibleGear,
  type SoldierGearContext,
} from "@/lib/stargrave/constants";
import { StatusBadge } from "@/components/status-badge";
import { SoldierStatGrid, GearTags } from "./soldier-stat-grid";

type SoldierType = {
  id: string;
  name: string;
  table_type: "standard" | "specialist";
  move: number;
  fight: number;
  shoot: number;
  armour: number;
  will: number;
  health: number;
  cost_cr: number;
};

type EquipmentItem = { id: string; name: string; category: string; restrictions: string | null; base_weapon_type: string | null };

type Soldier = {
  id: string;
  name: string | null;
  is_robot: boolean;
  current_health: number;
  bonus_gear_item_id: string | null;
  bonus_gear: { id: string; name: string } | null;
  soldier_types: SoldierType;
};

const EMPTY_CONTEXT: SoldierGearContext = { weaponKeys: [], hasDeck: false, hasPicks: false };

export function SoldierRecruiter({
  crewId,
  inCampaign,
  soldierTypes,
  soldiers,
  credits,
  maxSpecialists,
  gearByType,
  weaponContextByType,
  equipment,
}: {
  crewId: string;
  inCampaign: boolean;
  soldierTypes: SoldierType[];
  soldiers: Soldier[];
  credits: number;
  maxSpecialists: number;
  gearByType: Record<string, { name: string; quantity: number }[]>;
  weaponContextByType: Record<string, SoldierGearContext>;
  equipment: EquipmentItem[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Soldier bonus slot is "campaign loot only", excludes Captain/First-Mate-only
  // items (e.g. Alien Artefacts), and further depends on this specific soldier
  // type's starting gear (Advanced Weapons must match a weapon type they
  // already carry; Deck/Picks items need that type to carry a Deck/Picks) —
  // see isSoldierEligibleGear.
  function equipmentByCategoryFor(soldierTypeId: string) {
    const context = weaponContextByType[soldierTypeId] ?? EMPTY_CONTEXT;
    const eligibleEquipment = equipment.filter((item) => isSoldierEligibleGear(item, context));
    return Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([category, label]) => ({
      category,
      label,
      items: eligibleEquipment.filter((item) => item.category === category),
    }));
  }

  const specialistCount = soldiers.filter((s) => s.soldier_types.table_type === "specialist").length;
  const canRecruitMore = soldiers.length < SOLDIER_RULES.maxSoldiers;

  function handleAdd(soldierTypeId: string) {
    setError(null);
    startTransition(async () => {
      const result = await addSoldier(crewId, soldierTypeId, false);
      if (result.error) setError(result.error);
    });
  }

  function handleRemove(soldierId: string) {
    setError(null);
    startTransition(async () => {
      const result = await removeSoldier(crewId, soldierId);
      if (result.error) setError(result.error);
    });
  }

  function handleRobotToggle(soldierId: string, isRobot: boolean) {
    startTransition(async () => {
      await setSoldierRobot(crewId, soldierId, isRobot);
    });
  }

  function handleBonusGearChange(soldierId: string, equipmentItemId: string) {
    startTransition(async () => {
      await setSoldierBonusGear(crewId, soldierId, equipmentItemId || null);
    });
  }

  function handleNameChange(soldierId: string, name: string) {
    startTransition(async () => {
      await setSoldierName(crewId, soldierId, name);
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-6 border border-corp-border bg-corp-surface px-4 py-3 font-mono text-[15px] text-text-secondary uppercase">
        <span>
          Budget <b className="text-corp-accent">{credits.toLocaleString("de-DE")}</b> CR
        </span>
        <span>
          Soldiers <b className="text-text-default">{soldiers.length}</b>/{SOLDIER_RULES.maxSoldiers}
        </span>
        <span>
          Specialists <b className="text-text-default">{specialistCount}</b>/{maxSpecialists}
        </span>
      </div>

      {error ? <p className="font-mono text-sm text-danger">{error}</p> : null}

      <section>
        <p className="mb-2 font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">Trupp-Register</p>
        {soldiers.length > 0 ? (
          <div className="border border-corp-border">
            {soldiers.map((s) => (
              <div key={s.id} className="border-b border-corp-border/60 bg-corp-surface px-3 py-3 last:border-b-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    {s.name ? (
                      <p className="font-semibold text-text-default">{s.name}</p>
                    ) : (
                      <p className="font-semibold text-text-default">{s.soldier_types.name}</p>
                    )}
                    <p className="font-mono text-[14px] text-text-secondary uppercase">
                      {s.name ? s.soldier_types.name : null}
                      <span className={s.name ? "ml-2" : ""}>
                        {s.soldier_types.table_type === "specialist" ? "Specialist" : "Standard"}
                      </span>
                    </p>
                  </div>
                  <StatusBadge currentHealth={s.current_health} health={s.soldier_types.health} />
                </div>

                <label className="mt-2.5 flex items-center gap-2 font-mono text-[14px] text-text-secondary">
                  Name
                  <input
                    type="text"
                    defaultValue={s.name ?? ""}
                    onBlur={(e) => handleNameChange(s.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                    placeholder="z. B. Spitzname (optional)"
                    className="flex-1 rounded-md border border-corp-border bg-corp-surface px-2 py-1 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
                  />
                </label>

                <div className="mt-2.5">
                  <SoldierStatGrid stats={s.soldier_types} />
                </div>
                <GearTags items={gearByType[s.soldier_types.id] ?? []} />

                {inCampaign ? (
                  <label className="mt-2.5 flex items-center gap-2 font-mono text-[14px] text-text-secondary">
                    Bonus-Ausrüstung
                    <select
                      value={s.bonus_gear_item_id ?? ""}
                      onChange={(e) => handleBonusGearChange(s.id, e.target.value)}
                      className="rounded-md border border-corp-border bg-corp-surface px-2 py-1 text-sm text-text-default focus:border-corp-accent focus:outline-none"
                    >
                      <option value="">— keine —</option>
                      {equipmentByCategoryFor(s.soldier_types.id).map(({ category, label, items }) =>
                        items.length > 0 ? (
                          <optgroup key={category} label={label}>
                            {items.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </optgroup>
                        ) : null
                      )}
                    </select>
                  </label>
                ) : (
                  <p className="mt-2.5 font-mono text-[14px] text-text-subtle">
                    Bonus-Ausrüstung (Campaign Loot) nur verfügbar, sobald dieses Team in einer Kampagne mitspielt.
                  </p>
                )}

                <div className="mt-2.5 flex items-center gap-3">
                  <label className="flex items-center gap-1.5 font-mono text-[14px] text-text-secondary">
                    <input
                      type="checkbox"
                      checked={s.is_robot}
                      onChange={(e) => handleRobotToggle(s.id, e.target.checked)}
                      className="accent-[var(--corp-accent)]"
                    />
                    Robot
                  </label>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      const label = s.soldier_types.name + (s.name ? ` "${s.name}"` : "");
                      if (window.confirm(`${label} wirklich entlassen?`)) {
                        handleRemove(s.id);
                      }
                    }}
                    className="font-mono text-[14px] text-text-secondary hover:text-danger"
                  >
                    Entlassen
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-mono text-sm text-text-secondary">Noch keine Soldiers rekrutiert.</p>
        )}
      </section>

      <div className="flex flex-col gap-6">
        {(["standard", "specialist"] as const).map((tableType) => (
          <section key={tableType}>
            <p className="mb-2 font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
              {tableType === "standard" ? "Standard" : "Specialist"}
            </p>
            <div className="border border-corp-border">
              {soldierTypes
                .filter((t) => t.table_type === tableType)
                .map((t) => {
                  const disabled =
                    pending ||
                    !canRecruitMore ||
                    t.cost_cr > credits ||
                    (tableType === "specialist" && specialistCount >= maxSpecialists);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleAdd(t.id)}
                      className="block w-full border-b border-corp-border/60 bg-corp-surface px-3 py-3 text-left last:border-b-0 hover:bg-corp-accent/[0.06] disabled:opacity-40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-text-default">{t.name}</span>
                        <span className="font-mono text-[15px] text-corp-accent">{t.cost_cr === 0 ? "FREE" : `${t.cost_cr} CR`}</span>
                      </div>
                      <div className="mt-2.5">
                        <SoldierStatGrid stats={t} />
                      </div>
                      <GearTags items={gearByType[t.id] ?? []} />
                    </button>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
