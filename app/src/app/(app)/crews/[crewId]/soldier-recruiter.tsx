"use client";

import { useState, useTransition } from "react";
import {
  addSoldier,
  removeDossierPortrait,
  removeSoldier,
  setSoldierBonusGear,
  setSoldierName,
  setSoldierRobot,
  uploadDossierPortrait,
} from "./actions";
import { getDossierPortraitUrl } from "@/lib/supabase/dossier-portraits";
import {
  EQUIPMENT_CATEGORY_LABELS,
  SOLDIER_RULES,
  isSoldierEligibleGear,
  type SoldierGearContext,
} from "@/lib/stargrave/constants";
import { EmployeeCard } from "./employee-card";
import { SoldierStatGrid, GearTags } from "./soldier-stat-grid";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { randomCharacterName } from "@/lib/random-name";

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
  portrait_path: string | null;
};

type TableType = "specialist" | "standard";

const TAB_LABEL: Record<TableType, string> = { specialist: "Senior Rollen", standard: "Bewerber" };
const ADD_LABEL: Record<TableType, string> = { specialist: "Senior Hinzufügen", standard: "Bewerber Hinzufügen" };
const EMPTY_LABEL: Record<TableType, string> = { specialist: "Wähle aus Senior-Liste", standard: "Wähle aus Bewerberliste" };

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
  firstNames,
  lastNames,
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
  firstNames: string[];
  lastNames: string[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TableType>("specialist");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Soldier bonus slot is "campaign loot only", excludes Captain/First-Mate-only
  // items (e.g. Alien Artefacts), and further depends on this specific soldier
  // type's starting gear (Advanced Weapons must match a weapon type they
  // already carry; Deck/Picks items need that type to carry a Deck/Picks) —
  // see isSoldierEligibleGear.
  function bonusGearOptionsFor(soldierTypeId: string) {
    const context = weaponContextByType[soldierTypeId] ?? EMPTY_CONTEXT;
    const eligibleEquipment = equipment.filter((item) => isSoldierEligibleGear(item, context));
    return Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([category, label]) => ({
      category,
      label,
      items: eligibleEquipment.filter((item) => item.category === category),
    }));
  }

  const specialistCount = soldiers.filter((s) => s.soldier_types.table_type === "specialist").length;
  const standardCount = soldiers.filter((s) => s.soldier_types.table_type === "standard").length;
  const canRecruitMore = soldiers.length < SOLDIER_RULES.maxSoldiers;
  const tabSoldiers = soldiers.filter((s) => s.soldier_types.table_type === activeTab);

  function handleAdd(soldierTypeId: string) {
    setError(null);
    startTransition(async () => {
      const result = await addSoldier(crewId, soldierTypeId, false, randomCharacterName(firstNames, lastNames));
      if (result.error) setError(result.error);
      else setDrawerOpen(false);
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

  function handlePortraitChange(soldierId: string, file: File) {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadDossierPortrait(crewId, "soldier", soldierId, formData);
      if (result.error) setError(result.error);
    });
  }

  function handlePortraitRemove(soldierId: string) {
    setError(null);
    startTransition(async () => {
      const result = await removeDossierPortrait(crewId, "soldier", soldierId);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {error ? <p className="font-mono text-sm text-danger">{error}</p> : null}

      <div className="flex flex-col gap-6">
        <div className="flex w-full border-b border-white font-display text-[16px] tracking-[1.6px] uppercase">
          {(["specialist", "standard"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex h-10 items-center gap-2 px-4 ${
                activeTab === tab ? "border-b-[3px] border-white text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <span>{TAB_LABEL[tab]}</span>
              <span className="text-white/50">
                {tab === "specialist" ? `(${specialistCount}/${maxSpecialists})` : `(${standardCount})`}
              </span>
            </button>
          ))}
        </div>

        <div className="flex w-full justify-end">
          <Button variant="outline" onClick={() => setDrawerOpen(true)}>
            {ADD_LABEL[activeTab]}
          </Button>
        </div>

        {tabSoldiers.length > 0 ? (
          <div className="flex flex-col">
            {tabSoldiers.map((s) => (
              <EmployeeCard
                key={s.id}
                soldier={s}
                gearItems={gearByType[s.soldier_types.id] ?? []}
                pending={pending}
                inCampaign={inCampaign}
                bonusGearOptions={bonusGearOptionsFor(s.soldier_types.id)}
                portraitUrl={getDossierPortraitUrl(s.portrait_path)}
                onNameChange={(name) => handleNameChange(s.id, name)}
                onRobotToggle={(isRobot) => handleRobotToggle(s.id, isRobot)}
                onBonusGearChange={(equipmentItemId) => handleBonusGearChange(s.id, equipmentItemId)}
                onRemove={() => handleRemove(s.id)}
                onPortraitChange={(file) => handlePortraitChange(s.id, file)}
                onPortraitRemove={() => handlePortraitRemove(s.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full items-center justify-center py-8">
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>
              {EMPTY_LABEL[activeTab]}
            </Button>
          </div>
        )}
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent>
          <div className="flex h-full flex-col gap-4">
            <h3 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">
              {ADD_LABEL[activeTab]}
            </h3>
            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {soldierTypes
                .filter((t) => t.table_type === activeTab)
                .map((t) => {
                  const disabled =
                    pending ||
                    !canRecruitMore ||
                    t.cost_cr > credits ||
                    (activeTab === "specialist" && specialistCount >= maxSpecialists);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleAdd(t.id)}
                      className="block w-full border border-border bg-black px-4 py-3 text-left transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-[18px] font-semibold tracking-[1.8px] text-white uppercase">
                          {t.name}
                        </span>
                        <span className="font-mono text-[15px] text-accent">{t.cost_cr === 0 ? "FREE" : `${t.cost_cr} CR`}</span>
                      </div>
                      <div className="mt-2.5">
                        <SoldierStatGrid stats={t} />
                      </div>
                      <GearTags items={gearByType[t.id] ?? []} />
                    </button>
                  );
                })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
