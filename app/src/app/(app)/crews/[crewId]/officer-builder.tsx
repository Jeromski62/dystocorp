"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { saveOfficer } from "./actions";
import {
  OFFICER_RULES,
  EQUIPMENT_CATEGORY_LABELS,
  isCampaignLootCategory,
  type ChoosableStat,
  type OfficerRole,
} from "@/lib/stargrave/constants";
import { Button } from "@/components/ui/button";
import { BackgroundCard } from "@/components/background-card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  computeActivationNumber,
  computeGearSlotTotal,
  computeStatLine,
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
}: {
  crewId: string;
  role: OfficerRole;
  inCampaign: boolean;
  backgrounds: Background[];
  corePowersByBackground: Record<string, string[]>;
  powers: Power[];
  equipment: EquipmentItem[];
  existing: ExistingOfficer | null;
}) {
  const rules = OFFICER_RULES[role];

  const [name, setName] = useState(existing?.name ?? (role === "captain" ? "Captain" : "First Mate"));
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

  // Advanced Weapon/Tech/Alien Artefact are campaign loot (rulebook p.77
  // "Counting Loot") -- only obtainable, and thus only choosable, once this
  // crew is actually playing in a campaign.
  const availableEquipment = inCampaign ? equipment : equipment.filter((item) => !isCampaignLootCategory(item.category));
  const filteredEquipment = availableEquipment.filter((item) => {
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

  function addGear(id: string) {
    setGearQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
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

  const canSave = name.trim().length > 0 && !statError && !powerError && !reductionError && !gearError;

  const backgroundDone = !statError;
  const powersDone = !powerError && !reductionError;

  function goToSection(section: Section) {
    if (section === "powers" && !background) return;
    setActiveSection(section);
  }

  function handleSave() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
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
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  function BackgroundPicker() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Background</h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
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
                        ? "border-corp-accent bg-corp-accent text-corp-on-accent"
                        : "border-corp-border bg-corp-surface text-text-default disabled:opacity-40"
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
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">
            Powers ({totalSelectedCount}/{rules.powerCount}, Core {selectedCoreCount}/{rules.coreMin}-{rules.coreMax})
          </h3>

          <div className="mt-3 flex flex-col gap-6">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Core Powers ({background.name})</p>
              <div className="flex flex-col gap-2">
                {corePowers.map((power) => (
                  <PowerRow
                    key={power.id}
                    power={power}
                    selected={selectedPowerIds.includes(power.id)}
                    reduced={reducedPowerIds.includes(power.id)}
                    canReduce={rules.maxReductions > 0}
                    reductionLocked={
                      !reducedPowerIds.includes(power.id) && reducedPowerIds.length >= rules.maxReductions
                    }
                    activationOffset={rules.coreActivationOffset}
                    onToggle={() => toggleCorePower(power.id)}
                    onToggleReduced={() => toggleReduced(power.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-text-secondary">Andere Powers</p>
              <input
                value={powerSearch}
                onChange={(e) => setPowerSearch(e.target.value)}
                placeholder="Suchen…"
                className="mb-2 w-full rounded-md border border-corp-border bg-corp-surface px-3 py-1.5 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
              />
              <div className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
                {otherPowers.map((power) => (
                  <PowerRow
                    key={power.id}
                    power={power}
                    selected={selectedPowerIds.includes(power.id)}
                    reduced={reducedPowerIds.includes(power.id)}
                    canReduce={rules.maxReductions > 0}
                    reductionLocked={
                      !reducedPowerIds.includes(power.id) && reducedPowerIds.length >= rules.maxReductions
                    }
                    activationOffset={rules.nonCoreActivationOffset}
                    onToggle={() => toggleNonCorePower(power.id)}
                    onToggleReduced={() => toggleReduced(power.id)}
                  />
                ))}
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
      <div>
        <h3 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">
          Gear ({gearSlotTotal}/{rules.gearSlots} Slots)
        </h3>
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
            className="flex-1 rounded-md border border-corp-border bg-corp-surface px-3 py-1.5 text-sm text-text-default placeholder:text-text-secondary focus:border-corp-accent focus:outline-none"
          />
          <select
            value={gearCategory}
            onChange={(e) => setGearCategory(e.target.value)}
            className="rounded-md border border-corp-border bg-corp-surface px-3 py-1.5 text-sm text-text-default focus:border-corp-accent focus:outline-none"
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
                  className="flex items-center justify-between rounded-md border border-corp-border bg-corp-surface px-3 py-1.5 text-sm"
                >
                  <span className="text-text-default">
                    {item.name} × {qty}{" "}
                    <span className="text-text-secondary">({item.gear_slots * qty} Slots)</span>
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => removeGear(id)}
                      aria-label={`${item.name} entfernen`}
                      className="px-2 text-text-secondary hover:text-danger"
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => addGear(id)}
                      aria-label={`${item.name} hinzufügen`}
                      className="px-2 text-text-secondary hover:text-corp-accent"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-3 flex max-h-72 flex-col gap-1 overflow-y-auto pr-1">
          {filteredEquipment.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => addGear(item.id)}
              className="flex items-center justify-between rounded-md border border-corp-border bg-corp-surface px-3 py-1.5 text-left text-sm hover:border-corp-accent"
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
      <section className="flex flex-col gap-4 border-b border-corp-border pb-8">
        <h2 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Dossier</h2>

        <div>
          <label htmlFor={`officer-name-${role}`} className="text-xs uppercase tracking-wide text-text-secondary">
            Name
          </label>
          <input
            id={`officer-name-${role}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-corp-border bg-corp-surface px-3 py-2 text-sm text-text-default focus:border-corp-accent focus:outline-none"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-text-secondary">Stats</p>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex gap-[5px]">
              {statColumns.map((col) => (
                <div
                  key={col.label}
                  className={`flex flex-1 items-center py-2 ${col.header ? "justify-start" : "justify-center bg-white/[0.24]"}`}
                >
                  <span
                    className={`font-display text-sm tracking-[1.6px] text-white uppercase ${col.header ? "font-bold" : "font-semibold"}`}
                  >
                    {col.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-[5px]">
              {statColumns.map((col) => (
                <div key={col.label} className="flex flex-1 items-center justify-center">
                  <span className="font-display text-sm font-medium tracking-[1.6px] text-white">{col.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-b border-corp-border pb-8">
        <h2 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Background</h2>

        <SummaryRow label="Background" active={activeSection === "background"} onClick={() => goToSection("background")}>
          {background ? (
            <>
              {background.name}
              {chosenStatOptions.length > 0
                ? ` — ${chosenStatOptions.map((s) => `+1 ${STAT_LABELS[s as ChoosableStat]}`).join(", ")}`
                : null}
            </>
          ) : (
            "Noch nicht gewählt"
          )}
        </SummaryRow>
      </section>

      <section className="flex flex-col gap-4 border-b border-corp-border pb-8">
        <h2 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Powers</h2>

        <SummaryRow
          label="Powers"
          active={activeSection === "powers"}
          disabled={!background}
          onClick={() => goToSection("powers")}
        >
          {background ? `${totalSelectedCount}/${rules.powerCount} gewählt` : "Erst Background wählen"}
        </SummaryRow>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-[24px] font-medium tracking-[2.4px] text-white uppercase leading-none">Gear</h2>

        <SummaryRow label="Gear" active={activeSection === "gear"} onClick={() => goToSection("gear")}>
          {gearSlotTotal}/{rules.gearSlots} Slots belegt
        </SummaryRow>
      </section>

      <div className="flex flex-col items-start gap-2">
        <Button disabled={!canSave || pending} onClick={handleSave}>
          {pending ? "Speichere…" : "Speichern"}
        </Button>
        {saved ? <span className="text-sm text-corp-accent">Gespeichert.</span> : null}
        {error ? <span className="text-sm text-danger">{error}</span> : null}
        {!canSave && !error
          ? [statError, powerError, reductionError, gearError].filter(Boolean).map((msg) => (
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

function SummaryRow({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-start gap-0.5 border px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "border-corp-accent bg-corp-surface" : "border-corp-border bg-corp-surface hover:border-corp-accent"
      }`}
    >
      <span className="font-display text-xs tracking-[2px] text-text-secondary uppercase">{label}</span>
      <span className="text-sm text-text-default">{children}</span>
    </button>
  );
}

function PowerRow({
  power,
  selected,
  reduced,
  canReduce,
  reductionLocked,
  activationOffset,
  onToggle,
  onToggleReduced,
}: {
  power: Power;
  selected: boolean;
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
        selected ? "border-corp-accent bg-corp-surface" : "border-corp-border bg-corp-surface"
      }`}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between text-left">
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
            className="accent-[var(--corp-accent)]"
          />
          Activation −1
        </label>
      ) : null}
    </div>
  );
}
