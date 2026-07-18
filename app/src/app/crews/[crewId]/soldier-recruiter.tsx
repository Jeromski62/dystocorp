"use client";

import { useState, useTransition } from "react";
import { addSoldier, removeSoldier, setSoldierRobot } from "./actions";
import { SOLDIER_RULES } from "@/lib/stargrave/constants";

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4 rounded-md border border-border bg-surface px-4 py-3 text-sm">
        <span>{credits}cr verfügbar</span>
        <span>
          {soldiers.length}/{SOLDIER_RULES.maxSoldiers} Soldiers
        </span>
        <span>
          {specialistCount}/{maxSpecialists} Specialists
        </span>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {soldiers.length > 0 ? (
        <div className="flex flex-col gap-2">
          {soldiers.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-surface-raised px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium text-foreground">{s.soldier_types.name}</span>
                {s.name ? <span className="text-muted"> &quot;{s.name}&quot;</span> : null}
                <span className="ml-2 text-xs text-muted">
                  M{s.soldier_types.move} F+{s.soldier_types.fight} S+{s.soldier_types.shoot} A
                  {s.soldier_types.armour} W+{s.soldier_types.will} H{s.soldier_types.health}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={s.is_robot}
                    onChange={(e) => handleRobotToggle(s.id, e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  Robot
                </label>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleRemove(s.id)}
                  className="text-xs text-muted hover:text-danger"
                >
                  Entlassen
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Noch keine Soldiers rekrutiert.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(["standard", "specialist"] as const).map((tableType) => (
          <div key={tableType}>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">
              {tableType === "standard" ? "Standard" : "Specialist"}
            </p>
            <div className="flex flex-col gap-1.5">
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
                      className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-1.5 text-left text-sm hover:border-accent disabled:opacity-40"
                    >
                      <span className="text-foreground">{t.name}</span>
                      <span className="text-xs text-muted">{t.cost_cr === 0 ? "Free" : `${t.cost_cr}cr`}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
