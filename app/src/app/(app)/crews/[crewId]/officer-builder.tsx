"use client";

import { useEffect, useImperativeHandle, useMemo, useState, useTransition, type Ref } from "react";
import Image from "next/image";
import { saveOfficer } from "./actions";
import { randomCharacterName } from "@/lib/random-name";
import {
  OFFICER_RULES,
  EQUIPMENT_CATEGORY_LABELS,
  isCampaignLootCategory,
  type ChoosableStat,
  type OfficerRole,
} from "@/lib/stargrave/constants";
import { Button } from "@/components/ui/button";
import { BackgroundCard, BACKGROUND_ICONS } from "@/components/background-card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { GearSlotItem } from "@/components/gear-slot-item";
import { GearSlotIndicator } from "@/components/gear-slot-indicator";
import { StatLine } from "@/components/stat-line";
import { CheckIcon } from "lucide-react";
import {
  computeActivationNumber,
  computeGearSlotTotal,
  computeStatLine,
  validateArmourLimit,
  validateChosenStatOptions,
  validateGearSlots,
  validatePowerSelection,
  validateReduction,
} from "@/lib/stargrave/compute";

type Background = {
  id: string;
  key: string;
  name: string;
  flavor_text: string;
  fixed_stat_mods: Record<string, number>;
  choice_stat_count: number;
  choice_stat_options: string[];
};

type Power = {
  id: string;
  name: string;
  activation_number: number;
  strain: number;
  full_text: string;
};

type EquipmentItem = {
  id: string;
  key: string;
  name: string;
  category: string;
  gear_slots: number;
  cost_cr: number | null;
  effect_text: string;
};

type ExistingOfficer = {
  name: string;
  backgroundId: string;
  chosenStatOptions: string[];
  powers: { powerId: string; reduced: boolean }[];
  gearItemIds: string[];
};

type Section = "background" | "powers" | "gear";

// Exposed to CrewWizard so its single "Weiter" button can both save this
// officer and (only then) advance the wizard step, instead of requiring a
// separate "Speichern" click before "Weiter" would even unlock.
export type OfficerBuilderHandle = {
  save: () => Promise<boolean>;
};

const STAT_LABELS: Record<ChoosableStat, string> = {
  move: "Move",
  fight: "Fight",
  shoot: "Shoot",
  health: "Health",
};

// fixed_stat_mods can include "will" (never a choosable stat), so this needs
// its own label map/order rather than reusing STAT_LABELS/ChoosableStat.
const STAT_ORDER = ["move", "fight", "shoot", "armour", "will", "health"] as const;
const FULL_STAT_LABELS: Record<string, string> = {
  move: "Move",
  fight: "Fight",
  shoot: "Shoot",
  armour: "Armour",
  will: "Will",
  health: "Health",
};

function fixedStatModBadges(mods: Record<string, number>): string[] {
  return STAT_ORDER.filter((stat) => mods[stat]).map((stat) => `+${mods[stat]} ${FULL_STAT_LABELS[stat]}`);
}

// Captain/First Mate creation used to be one long scrolling form -- easy to
// lose your place in, and the CTA/summary was never visible once you'd
// scrolled past it. This keeps a single always-visible summary (name, live
// stats, one line per section) and moves the actual picking into a Sheet
// (ui/sheet.tsx) that slides in from the right on desktop / up from the
// bottom on mobile with a dimming backdrop -- only one thing focused at a
// time instead of a permanent side-by-side pane, which felt like cognitive
// overload in practice. Starts closed either way -- new or existing officer
// -- so nothing pops up uninvited; the Sheet only opens once the user taps
// the Background summary row.
export function OfficerBuilder({
  crewId,
  role,
  inCampaign,
  backgrounds,
  corePowersByBackground,
  powers,
  equipment,
  existing,
  firstNames,
  lastNames,
  onReadyChange,
  hideSaveButton,
  ref,
}: {
  crewId: string;
  role: OfficerRole;
  inCampaign: boolean;
  backgrounds: Background[];
  corePowersByBackground: Record<string, string[]>;
  powers: Power[];
  equipment: EquipmentItem[];
  existing: ExistingOfficer | null;
  firstNames: string[];
  lastNames: string[];
  // Wizard-mode-only: report client-side validity up so the wizard's own
  // "Weiter" button can gate on it, and hide this component's own
  // "Speichern" button/checklist since the wizard button now triggers
  // save() itself via the ref. Unset (standalone/edit-tabs usage) keeps
  // the original always-visible Speichern button.
  onReadyChange?: (ready: boolean) => void;
  hideSaveButton?: boolean;
  ref?: Ref<OfficerBuilderHandle>;
}) {
  const rules = OFFICER_RULES[role];

  const [name, setName] = useState(() => existing?.name ?? randomCharacterName(firstNames, lastNames));
  const [backgroundId, setBackgroundId] = useState<string | null>(existing?.backgroundId ?? null);
  const [chosenStatOptions, setChosenStatOptions] = useState<string[]>(existing?.chosenStatOptions ?? []);
  const [selectedPowerIds, setSelectedPowerIds] = useState<string[]>(existing?.powers.map((p) => p.powerId) ?? []);
  const [reducedPowerIds, setReducedPowerIds] = useState<string[]>(
    existing?.powers.filter((p) => p.reduced).map((p) => p.powerId) ?? []
  );
  const [gearQuantities, setGearQuantities] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const id of existing?.gearItemIds ?? []) map[id] = (map[id] ?? 0) + 1;
    return map;
  });
  const [powerSearch, setPowerSearch] = useState("");
  const [gearSearch, setGearSearch] = useState("");
  const [gearCategory, setGearCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  const background = backgrounds.find((b) => b.id === backgroundId) ?? null;
  const backgroundBadges = background
    ? [
        ...fixedStatModBadges(background.fixed_stat_mods),
        ...chosenStatOptions.map((s) => `+1 ${STAT_LABELS[s as ChoosableStat]}`),
      ]
    : [];
  const corePowerIdSet = useMemo(
    () => new Set(backgroundId ? corePowersByBackground[backgroundId] ?? [] : []),
    [backgroundId, corePowersByBackground]
  );

  const corePowers = powers.filter((p) => corePowerIdSet.has(p.id));
  const otherPowers = powers.filter(
    (p) => !corePowerIdSet.has(p.id) && p.name.toLowerCase().includes(powerSearch.toLowerCase())
  );

  const selectedCoreCount = selectedPowerIds.filter((id) => corePowerIdSet.has(id)).length;
  const totalSelectedCount = selectedPowerIds.length;
  const selectedCorePowers = powers.filter((p) => selectedPowerIds.includes(p.id) && corePowerIdSet.has(p.id));
  const selectedOtherPowers = powers.filter((p) => selectedPowerIds.includes(p.id) && !corePowerIdSet.has(p.id));

  // Advanced Weapon/Tech/Alien Artefact are campaign loot (rulebook p.77
  // "Counting Loot") -- only obtainable, and thus only choosable, once this
  // crew is actually playing in a campaign.
  const availableEquipment = inCampaign ? equipment : equipment.filter((item) => !isCampaignLootCategory(item.category));
  const filteredEquipment = availableEquipment.filter((item) => {
    if (gearQuantities[item.id]) return false; // already in the loadout -- adjust its quantity via the +/- row above instead
    if (gearCategory !== "all" && item.category !== gearCategory) return false;
    return item.name.toLowerCase().includes(gearSearch.toLowerCase());
  });

  function selectBackground(id: string) {
    if (id === backgroundId) return;
    setBackgroundId(id);
    setChosenStatOptions([]);
    setSelectedPowerIds([]);
    setReducedPowerIds([]);
  }

  function toggleStatOption(stat: string) {
    if (!background) return;
    setChosenStatOptions((prev) => {
      if (prev.includes(stat)) return prev.filter((s) => s !== stat);
      if (prev.length >= background.choice_stat_count) return prev;
      return [...prev, stat];
    });
  }

  function toggleCorePower(id: string) {
    setSelectedPowerIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (selectedCoreCount >= rules.coreMax) return prev;
      return [...prev, id];
    });
    setReducedPowerIds((prev) => prev.filter((p) => p !== id || selectedPowerIds.includes(id)));
  }

  function toggleNonCorePower(id: string) {
    setSelectedPowerIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (totalSelectedCount >= rules.powerCount) return prev;
      return [...prev, id];
    });
  }

  function toggleReduced(id: string) {
    if (rules.maxReductions === 0) return;
    setReducedPowerIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= rules.maxReductions) return prev;
      return [...prev, id];
    });
  }

  function armourCountIn(quantities: Record<string, number>): number {
    return Object.entries(quantities).reduce((sum, [id, qty]) => {
      const it = equipment.find((e) => e.id === id);
      return it?.category === "armour" ? sum + qty : sum;
    }, 0);
  }

  function wouldExceedGearLimit(item: EquipmentItem): boolean {
    const prospectiveTotal = computeGearSlotTotal([...gearFlatList, { key: item.key, gearSlots: item.gear_slots }]);
    if (prospectiveTotal > rules.gearSlots) return true;
    // A figure may never wear more than one armour type at once (Light/Heavy/
    // Combat Armour + Shield all share the "armour" category) -- already-
    // equipped armour is filtered out of the browse list, so this only ever
    // fires for a *different* armour item while one is already carried.
    if (item.category === "armour" && armourCountIn(gearQuantities) >= 1) return true;
    return false;
  }

  function addGear(id: string) {
    const item = equipment.find((e) => e.id === id);
    if (!item) return;
    // Validate against `prev`, not the render-time gearFlatList/gearSlotTotal
    // closure -- two rapid clicks (e.g. a fast double-click) both fire
    // before React re-renders, so a render-time check lets both slip through
    // even when only the first one actually fits, since each read the same
    // stale total. The functional updater runs against the real queued
    // state instead, so the second click correctly sees the first one's
    // effect already applied.
    setGearQuantities((prev) => {
      const flatList = Object.entries(prev).flatMap(([qid, qty]) => {
        const qItem = equipment.find((e) => e.id === qid);
        if (!qItem) return [];
        return Array.from({ length: qty }, () => ({ key: qItem.key, gearSlots: qItem.gear_slots }));
      });
      const prospectiveTotal = computeGearSlotTotal([...flatList, { key: item.key, gearSlots: item.gear_slots }]);
      if (prospectiveTotal > rules.gearSlots) return prev;
      if (item.category === "armour" && armourCountIn(prev) >= 1) return prev;
      return { ...prev, [id]: (prev[id] ?? 0) + 1 };
    });
  }

  function removeGear(id: string) {
    setGearQuantities((prev) => {
      const next = { ...prev };
      if (!next[id]) return prev;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  const stats = computeStatLine(
    rules.baseStats,
    background?.fixed_stat_mods ?? {},
    chosenStatOptions as ChoosableStat[]
  );

  // Per Figma node 2091:534 -- Start Level stands apart (no fill, bold,
  // left-aligned) from the five/six stat cells (filled header, centered).
  const statColumns = [
    { label: "Start Level", value: String(rules.startLevel), header: true },
    { label: "Move", value: String(stats.move) },
    { label: "Fight", value: `+${stats.fight}` },
    { label: "Shoot", value: `+${stats.shoot}` },
    { label: "Armor", value: String(stats.armour) },
    { label: "Will", value: `+${stats.will}` },
    { label: "Health", value: String(stats.health) },
  ];

  const statError = background
    ? validateChosenStatOptions(chosenStatOptions, background.choice_stat_options, background.choice_stat_count)
    : "Wähle einen Background.";
  const powerError = validatePowerSelection(selectedPowerIds, corePowerIdSet, rules);
  const reductionError = validateReduction(reducedPowerIds, selectedPowerIds, rules.maxReductions);

  const gearFlatList = Object.entries(gearQuantities).flatMap(([id, qty]) => {
    const item = equipment.find((e) => e.id === id);
    if (!item) return [];
    return Array.from({ length: qty }, () => ({ key: item.key, gearSlots: item.gear_slots }));
  });
  const gearSlotTotal = computeGearSlotTotal(gearFlatList);
  const gearError = validateGearSlots(gearSlotTotal, rules.gearSlots);
  const armourError = validateArmourLimit(armourCountIn(gearQuantities));

  const gearCells = Object.entries(gearQuantities).flatMap(([id, qty]) => {
    const item = equipment.find((e) => e.id === id);
    if (!item) return [];
    const size = Math.min(3, Math.max(1, item.gear_slots)) as 1 | 2 | 3;
    return Array.from({ length: qty }, (_, i) => ({ cellKey: `${id}-${i}`, label: item.name, size }));
  });
  // Empty/filled cell counts must mirror gearCells' own per-item sizing
  // (each cell sized by its item's printed gear_slots), not gearSlotTotal --
  // that total gets a -1 "first knife is free" discount for the slot-budget
  // check, which would otherwise conjure a phantom extra empty cell (e.g. a
  // First Mate with 3 one-slot items showed 3 filled + 3 "empty" = 6 cells
  // instead of the 5 the grid actually has room for).
  const visualGearSlotTotal = gearCells.reduce((sum, cell) => sum + cell.size, 0);
  // The free knife can push visualGearSlotTotal one column past rules.gearSlots
  // (it doesn't cost a budget slot, but it still occupies a cell) -- grow the
  // grid to fit it rather than clipping/wrapping the last item.
  const gearGridColumns = Math.max(rules.gearSlots, visualGearSlotTotal);
  const emptyGearSlotCount = Math.max(0, gearGridColumns - visualGearSlotTotal);
  const filledIndicatorCount = visualGearSlotTotal;

  const canSave = name.trim().length > 0 && !statError && !powerError && !reductionError && !gearError && !armourError;

  const backgroundDone = !statError;
  const powersDone = !powerError && !reductionError;

  function goToSection(section: Section) {
    if (section === "powers" && !background) return;
    setActiveSection(section);
  }

  async function performSave(): Promise<boolean> {
    setError(null);
    setSaved(false);
    if (!canSave) return false;
    const gearItemIds = Object.entries(gearQuantities).flatMap(([id, qty]) => Array(qty).fill(id));
    const result = await saveOfficer({
      crewId,
      role,
      name: name.trim(),
      backgroundId: backgroundId!,
      chosenStatOptions: chosenStatOptions as ChoosableStat[],
      powerIds: selectedPowerIds,
      reducedPowerIds,
      gearItemIds,
    });
    if (result.error) {
      setError(result.error);
      return false;
    }
    setSaved(true);
    return true;
  }

  function handleSave() {
    startTransition(() => {
      void performSave();
    });
  }

  useImperativeHandle(ref, () => ({ save: performSave }));

  useEffect(() => {
    onReadyChange?.(canSave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSave]);

  function BackgroundPicker() {
    return (
      <div className="flex h-full flex-col gap-6">
        <div>
          <h3 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Background</h3>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {backgrounds.map((b) => (
              <BackgroundCard
                key={b.id}
                backgroundKey={b.key}
                name={b.name}
                bonusBadges={fixedStatModBadges(b.fixed_stat_mods)}
                chooseCount={b.choice_stat_count}
                chooseOptionLabels={b.choice_stat_options.map((s) => STAT_LABELS[s as ChoosableStat])}
                flavorText={b.flavor_text}
                selected={backgroundId === b.id}
                onSelect={() => selectBackground(b.id)}
              />
            ))}
          </div>
        </div>

        {background ? (
          <div>
            <h3 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">
              Stat-Bonus wählen ({chosenStatOptions.length}/{background.choice_stat_count})
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {background.choice_stat_options.map((stat) => {
                const selected = chosenStatOptions.includes(stat);
                const disabled = !selected && chosenStatOptions.length >= background.choice_stat_count;
                return (
                  <button
                    key={stat}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleStatOption(stat)}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      selected
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-bg-surface text-text-default disabled:opacity-40"
                    }`}
                  >
                    +1 {STAT_LABELS[stat as ChoosableStat]}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {backgroundDone ? (
          <Button variant="outline" className="self-start" onClick={() => setActiveSection("powers")}>
            Weiter zu Powers →
          </Button>
        ) : null}
      </div>
    );
  }

  function PowersPicker() {
    if (!background) return null;
    return (
      <div className="flex h-full flex-col gap-6">
        <div className="flex min-h-0 flex-1 flex-col">
          <h3 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Powers</h3>
          <div className="mt-2 border border-border bg-bg-surface px-3 py-2 text-sm text-text-secondary">
            Wähle genau {rules.powerCount} Powers, davon {rules.coreMin}-{rules.coreMax} Core Powers ({background.name}).
          </div>

          <div className="mt-3 flex min-h-0 flex-1 flex-col gap-6">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Core Powers ({background.name})</p>
              <div className="flex flex-col gap-2">
                {corePowers.map((power) => {
                  const isSelected = selectedPowerIds.includes(power.id);
                  return (
                    <PowerRow
                      key={power.id}
                      power={power}
                      selected={isSelected}
                      disabled={!isSelected && selectedCoreCount >= rules.coreMax}
                      reduced={reducedPowerIds.includes(power.id)}
                      canReduce={rules.maxReductions > 0}
                      reductionLocked={
                        !reducedPowerIds.includes(power.id) && reducedPowerIds.length >= rules.maxReductions
                      }
                      activationOffset={rules.coreActivationOffset}
                      onToggle={() => toggleCorePower(power.id)}
                      onToggleReduced={() => toggleReduced(power.id)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Andere Powers</p>
              <input
                value={powerSearch}
                onChange={(e) => setPowerSearch(e.target.value)}
                placeholder="Suchen…"
                className="mb-2 w-full rounded-md border border-border bg-bg-surface px-3 py-1.5 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
              />
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {otherPowers.map((power) => {
                  const isSelected = selectedPowerIds.includes(power.id);
                  return (
                    <PowerRow
                      key={power.id}
                      power={power}
                      selected={isSelected}
                      disabled={!isSelected && totalSelectedCount >= rules.powerCount}
                      reduced={reducedPowerIds.includes(power.id)}
                      canReduce={rules.maxReductions > 0}
                      reductionLocked={
                        !reducedPowerIds.includes(power.id) && reducedPowerIds.length >= rules.maxReductions
                      }
                      activationOffset={rules.nonCoreActivationOffset}
                      onToggle={() => toggleNonCorePower(power.id)}
                      onToggleReduced={() => toggleReduced(power.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {powersDone ? (
          <Button variant="outline" className="self-start" onClick={() => setActiveSection("gear")}>
            Weiter zu Gear →
          </Button>
        ) : null}
      </div>
    );
  }

  function GearPicker() {
    return (
      <div className="flex h-full flex-col">
        <h3 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Gear</h3>
        <div className="mt-2 border border-border bg-bg-surface px-3 py-2 text-sm text-text-secondary">
          Wähle Gear für bis zu {rules.gearSlots} Slots. Maximal 1 Rüstungsitem gleichzeitig.
        </div>
        {gearError ? <p className="mt-1 text-sm text-danger">{gearError}</p> : null}
        {armourError ? <p className="mt-1 text-sm text-danger">{armourError}</p> : null}
        {!inCampaign ? (
          <p className="mt-1 text-xs text-text-secondary">
            Advanced Weapon/Technology und Alien Artefact sind Campaign Loot — erst verfügbar, sobald dieses Team in
            einer Kampagne mitspielt.
          </p>
        ) : null}
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            value={gearSearch}
            onChange={(e) => setGearSearch(e.target.value)}
            placeholder="Gear suchen…"
            className="flex-1 rounded-md border border-border bg-bg-surface px-3 py-1.5 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
          />
          <select
            value={gearCategory}
            onChange={(e) => setGearCategory(e.target.value)}
            className="rounded-md border border-border bg-bg-surface px-3 py-1.5 text-sm text-text-default focus:border-accent focus:outline-none"
          >
            <option value="all">Alle Kategorien</option>
            {Object.entries(EQUIPMENT_CATEGORY_LABELS)
              .filter(([key]) => inCampaign || !isCampaignLootCategory(key))
              .map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
          </select>
        </div>

        {Object.keys(gearQuantities).length > 0 ? (
          <div className="mt-3 flex flex-col gap-1">
            {Object.entries(gearQuantities).map(([id, qty]) => {
              const item = equipment.find((e) => e.id === id);
              if (!item) return null;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-md border border-accent bg-bg-surface px-3 py-1.5 text-sm"
                >
                  <span className="text-text-default">
                    {item.name} × {qty}{" "}
                    <span className="text-text-secondary">({item.gear_slots * qty} Slots)</span>
                  </span>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => removeGear(id)}
                      aria-label={`${item.name} entfernen`}
                      className="flex size-7 items-center justify-center rounded-md border border-border bg-bg-surface text-text-default transition-colors hover:border-danger hover:text-danger"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => addGear(id)}
                      disabled={wouldExceedGearLimit(item)}
                      aria-label={`${item.name} hinzufügen`}
                      className="flex size-7 items-center justify-center rounded-md border border-border bg-bg-surface text-text-default transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text-default"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-3 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1">
          {filteredEquipment.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addGear(item.id)}
              disabled={wouldExceedGearLimit(item)}
              className="flex items-center justify-between rounded-md border border-border bg-bg-surface px-3 py-1.5 text-left text-sm transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border"
              title={item.effect_text}
            >
              <span className="text-text-default">{item.name}</span>
              <span className="text-xs text-text-secondary">
                {item.gear_slots} Slot{item.gear_slots === 1 ? "" : "s"} · {EQUIPMENT_CATEGORY_LABELS[item.category]}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Called as plain functions, not JSX (`<PowersPicker />`) -- these are
  // redeclared on every render, so mounting them as components would give
  // React a new component "type" each time and remount the whole subtree,
  // e.g. dropping focus out of the power/gear search inputs on every
  // keystroke. Calling them as functions just inlines their returned JSX
  // into this render, keeping the underlying elements stable.
  function renderActivePanel() {
    if (activeSection === "background") return BackgroundPicker();
    if (activeSection === "powers") return PowersPicker();
    if (activeSection === "gear") return GearPicker();
    return null;
  }

  const activePanel = renderActivePanel();

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 pb-8">
        <h2 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Dossier</h2>

        <div>
          <label htmlFor={`officer-name-${role}`} className="text-xs uppercase tracking-wide text-text-secondary">
            Name
          </label>
          <input
            id={`officer-name-${role}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full max-w-sm bg-black px-2 py-1 font-display text-[24px] tracking-[2.4px] text-white uppercase focus:outline-none"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-text-secondary">Stats</p>
          <div className="mt-2">
            <StatLine columns={statColumns} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Background</h2>
          {!statError ? (
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#11FF70]">
              <CheckIcon className="size-3 text-black" strokeWidth={3} />
            </span>
          ) : null}
        </div>

        {background ? (
          <button
            type="button"
            onClick={() => goToSection("background")}
            className="flex w-full items-center gap-4 border border-border bg-black p-4 text-left transition-colors hover:border-accent"
          >
            <span className="flex size-12 shrink-0 items-center justify-center bg-black/60">
              {BACKGROUND_ICONS[background.key] ? (
                <Image src={BACKGROUND_ICONS[background.key]} alt="" width={40} height={40} />
              ) : null}
            </span>
            <span className="min-w-0 flex-1 font-display text-[18px] font-semibold tracking-[1.8px] text-white uppercase">
              {background.name}
            </span>
            {backgroundBadges.length > 0 ? (
              <span className="flex shrink-0 items-center gap-2">
                {backgroundBadges.map((label) => (
                  <span key={label} className="bg-white/24 px-1.5 py-1.5 text-[14px] font-semibold tracking-[1.4px] text-white">
                    {label}
                  </span>
                ))}
              </span>
            ) : null}
          </button>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Button variant="outline" onClick={() => goToSection("background")}>
              Select Background
            </Button>
          </div>
        )}

        {background && statError ? <p className="text-sm text-danger">{statError}</p> : null}
      </section>

      <section className="flex flex-col gap-4 pb-8">
        <button
          type="button"
          disabled={!background}
          onClick={() => goToSection("powers")}
          className="flex w-full items-center justify-between text-left disabled:cursor-not-allowed"
        >
          <h2 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Powers</h2>
          <span className="flex items-center gap-3">
            <span className="font-display text-[24px] font-normal tracking-[2.4px] text-white uppercase leading-none">
              {totalSelectedCount}/{rules.powerCount}
            </span>
            {background && powersDone ? (
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#11FF70]">
                <CheckIcon className="size-3 text-black" strokeWidth={3} />
              </span>
            ) : null}
          </span>
        </button>

        {background && powerError ? <p className="text-sm text-danger">{powerError}</p> : null}

        <div className="flex flex-col gap-2">
          <p className="font-display text-sm font-medium tracking-[1.6px] text-white uppercase">Core</p>
          {!background ? (
            <p className="flex items-center justify-center py-4 text-center text-sm tracking-[1.4px] text-white/50 uppercase">
              Select background first
            </p>
          ) : selectedCorePowers.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedCorePowers.map((power) => (
                <button
                  key={power.id}
                  type="button"
                  onClick={() => goToSection("powers")}
                  className="flex h-11 items-center border border-border bg-black px-4 font-display text-sm font-semibold tracking-[1.6px] text-white uppercase transition-colors hover:border-accent"
                >
                  {power.name}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => goToSection("powers")}
              className="w-full py-4 text-center font-display text-sm font-semibold tracking-[1.4px] text-white/50 uppercase transition-colors hover:text-white"
            >
              Wähle Powers
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-display text-sm font-medium tracking-[1.6px] text-white uppercase">Others</p>
          {!background ? (
            <p className="flex items-center justify-center py-4 text-center text-sm tracking-[1.4px] text-white/50 uppercase">
              Select background first
            </p>
          ) : selectedOtherPowers.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {selectedOtherPowers.map((power) => (
                <button
                  key={power.id}
                  type="button"
                  onClick={() => goToSection("powers")}
                  className="border border-border bg-black px-4 py-4 font-display text-sm font-semibold tracking-[1.6px] text-white uppercase transition-colors hover:border-accent"
                >
                  {power.name}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => goToSection("powers")}
              className="w-full py-4 text-center font-display text-sm font-semibold tracking-[1.4px] text-white/50 uppercase transition-colors hover:text-white"
            >
              Wähle Powers
            </button>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => goToSection("gear")}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Gear</h2>
          <span className="flex items-center gap-3">
            <span className="font-display text-[24px] font-normal tracking-[2.4px] text-white uppercase leading-none">
              {gearSlotTotal}/{rules.gearSlots}
            </span>
            {gearSlotTotal === rules.gearSlots && !armourError ? (
              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#11FF70]">
                <CheckIcon className="size-3 text-black" strokeWidth={3} />
              </span>
            ) : null}
          </span>
        </button>

        {gearError ? (
          <p className="text-sm text-danger">{gearError}</p>
        ) : armourError ? (
          <p className="text-sm text-danger">{armourError}</p>
        ) : gearSlotTotal < rules.gearSlots ? (
          <p className="text-sm text-danger">Wähle Gear für {rules.gearSlots} Slots</p>
        ) : null}

        <div className="flex flex-col gap-2">
          <div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gearGridColumns}, minmax(0, 1fr))` }}>
              {gearCells.map((cell) => (
                <GearSlotItem
                  key={cell.cellKey}
                  size={cell.size}
                  label={cell.label}
                  onClick={() => goToSection("gear")}
                />
              ))}
              {Array.from({ length: emptyGearSlotCount }, (_, i) => (
                <GearSlotItem key={`empty-${i}`} size={1} onClick={() => goToSection("gear")} />
              ))}
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gearGridColumns}, minmax(0, 1fr))` }}>
              {Array.from({ length: gearGridColumns }, (_, i) => (
                <GearSlotIndicator key={i} filled={i < filledIndicatorCount} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-start gap-2">
        {!hideSaveButton ? (
          <Button variant="cta" disabled={!canSave || pending} onClick={handleSave}>
            {pending ? "Speichere…" : "Speichern"}
          </Button>
        ) : null}
        {!hideSaveButton && saved ? <span className="text-sm text-accent">Gespeichert.</span> : null}
        {error ? <span className="text-sm text-danger">{error}</span> : null}
        {!hideSaveButton && !canSave && !error
          ? [statError, powerError, reductionError, gearError, armourError].filter(Boolean).map((msg) => (
              <span key={msg} className="text-sm text-text-secondary">
                {msg}
              </span>
            ))
          : null}
      </div>

      <Sheet open={activeSection !== null} onOpenChange={(open) => !open && setActiveSection(null)}>
        <SheetContent>{activePanel}</SheetContent>
      </Sheet>
    </div>
  );
}

function PowerRow({
  power,
  selected,
  disabled,
  reduced,
  canReduce,
  reductionLocked,
  activationOffset,
  onToggle,
  onToggleReduced,
}: {
  power: Power;
  selected: boolean;
  disabled: boolean;
  reduced: boolean;
  canReduce: boolean;
  reductionLocked: boolean;
  activationOffset: number;
  onToggle: () => void;
  onToggleReduced: () => void;
}) {
  const activation = selected ? computeActivationNumber(power.activation_number, activationOffset, reduced) : null;

  return (
    <div
      className={`rounded-md border px-3 py-2 text-sm ${
        selected ? "border-accent bg-bg-surface" : "border-border bg-bg-surface"
      } ${disabled ? "opacity-40" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="flex w-full items-center justify-between text-left disabled:cursor-not-allowed"
      >
        <span className="text-text-default" title={power.full_text}>
          {power.name}
        </span>
        <span className="text-xs text-text-secondary">
          {selected ? `Akt. ${activation}` : `Akt. ${power.activation_number}`} · Strain {power.strain}
        </span>
      </button>
      {selected && canReduce ? (
        <label className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
          <input
            type="checkbox"
            checked={reduced}
            disabled={reductionLocked}
            onChange={onToggleReduced}
            className="accent-[var(--accent)]"
          />
          Activation −1
        </label>
      ) : null}
    </div>
  );
}
