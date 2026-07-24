"use client";

import { useState, useTransition } from "react";
import { addSoldier, removeSoldier, setSoldierRobot } from "./actions";
import { SOLDIER_RULES } from "@/lib/stargrave/constants";
import { StatusBadge } from "@/components/status-badge";

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

type Soldier = {
  id: string;
  name: string | null;
  is_robot: boolean;
  current_health: number;
  soldier_types: SoldierType;
};

export function SoldierRecruiter({
  crewId,
  soldierTypes,
  soldiers,
  credits,
  maxSpecialists,
}: {
  crewId: string;
  soldierTypes: SoldierType[];
  soldiers: Soldier[];
  credits: number;
  maxSpecialists: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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
            <div className="grid grid-cols-[1.6fr_1fr_0.7fr_0.7fr_0.7fr_1fr] gap-2 border-b border-corp-border bg-corp-surface px-3 py-2 font-mono text-[14px] tracking-[0.05em] text-text-subtle uppercase">
              <span>Einheit</span>
              <span>Typ</span>
              <span>FGT</span>
              <span>SHT</span>
              <span>HP</span>
              <span>Status</span>
            </div>
            {soldiers.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[1.6fr_1fr_0.7fr_0.7fr_0.7fr_1fr] items-center gap-2 border-b border-corp-border/60 bg-corp-surface px-3 py-2.5 text-sm text-text-default last:border-b-0"
              >
                <span className="font-medium">
                  {s.soldier_types.name}
                  {s.name ? <span className="text-text-secondary"> &quot;{s.name}&quot;</span> : null}
                </span>
                <span className="font-mono text-[14px] text-text-secondary">{s.soldier_types.table_type === "specialist" ? "Specialist" : "Standard"}</span>
                <span className="font-mono text-[15px]">+{s.soldier_types.fight}</span>
                <span className="font-mono text-[15px]">+{s.soldier_types.shoot}</span>
                <span className="font-mono text-[15px]">{s.soldier_types.health}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge currentHealth={s.current_health} health={s.soldier_types.health} />
                </div>
                <div className="col-span-6 -mt-1 flex items-center gap-3 pt-1">
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

      <div className="grid gap-6 sm:grid-cols-2">
        {(["standard", "specialist"] as const).map((tableType) => (
          <section key={tableType}>
            <p className="mb-2 font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
              {tableType === "standard" ? "Standard" : "Specialist"}
            </p>
            <div className="border border-corp-border">
              <div className="grid grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr_0.8fr] gap-2 border-b border-corp-border bg-corp-surface px-3 py-1.5 font-mono text-[14px] tracking-[0.05em] text-text-subtle uppercase">
                <span>Typ</span>
                <span>FGT</span>
                <span>SHT</span>
                <span>HP</span>
                <span>Kosten</span>
              </div>
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
                      className="grid w-full grid-cols-[1.4fr_0.6fr_0.6fr_0.6fr_0.8fr] items-center gap-2 border-b border-corp-border/60 bg-corp-surface px-3 py-2 text-left text-sm last:border-b-0 hover:bg-corp-accent/[0.06] disabled:opacity-40"
                    >
                      <span className="font-medium text-text-default">{t.name}</span>
                      <span className="font-mono text-[14px] text-text-secondary">+{t.fight}</span>
                      <span className="font-mono text-[14px] text-text-secondary">+{t.shoot}</span>
                      <span className="font-mono text-[14px] text-text-secondary">{t.health}</span>
                      <span className="font-mono text-[15px] text-corp-accent">{t.cost_cr === 0 ? "FREE" : `${t.cost_cr} CR`}</span>
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
