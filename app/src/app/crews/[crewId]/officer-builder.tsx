"use client";

import { useMemo, useState, useTransition } from "react";
import { saveOfficer } from "./actions";
import { OFFICER_RULES, type ChoosableStat, type OfficerRole } from "@/lib/stargrave/constants";
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

const STAT_LABELS: Record<ChoosableStat, string> = {
  move: "Move",
  fight: "Fight",
  shoot: "Shoot",
  health: "Health",
};

const CATEGORY_LABELS: Record<string, string> = {
  equipment: "Equipment",
  weapon: "Waffen",
  armour: "Rüstung",
  advanced_weapon: "Advanced Weapon",
  advanced_tech_1: "Advanced Tech I",
  advanced_tech_2: "Advanced Tech II",
  alien_artefact: "Alien Artefact",
};

export function OfficerBuilder({
  crewId,
  role,
  backgrounds,
  corePowersByBackground,
  powers,
  equipment,
  existing,
}: {
  crewId: string;
  role: OfficerRole;
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

  const filteredEquipment = equipment.filter((item) => {
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

  const stats = background
    ? computeStatLine(rules.baseStats, background.fixed_stat_mods, chosenStatOptions as ChoosableStat[])
    : null;

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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <label className="text-xs uppercase tracking-wide text-muted">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full max-w-sm rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>

      {stats ? (
        <div className="flex flex-wrap gap-4 rounded-md border border-border bg-surface px-4 py-3 text-sm">
          <span>Level {rules.startLevel}</span>
          <span>M {stats.move}</span>
          <span>F +{stats.fight}</span>
          <span>S +{stats.shoot}</span>
          <span>A {stats.armour}</span>
          <span>W +{stats.will}</span>
          <span>H {stats.health}</span>
        </div>
      ) : null}

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Background</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {backgrounds.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => selectBackground(b.id)}
              className={`rounded-md border p-3 text-left text-sm ${
                backgroundId === b.id ? "border-accent bg-surface-raised" : "border-border bg-surface hover:border-accent"
              }`}
            >
              <p className="font-medium text-foreground">{b.name}</p>
              <p className="mt-1 text-xs text-muted">{b.flavor_text}</p>
              <p className="mt-2 text-xs text-accent">
                Wähle {b.choice_stat_count} von: {b.choice_stat_options.map((s) => STAT_LABELS[s as ChoosableStat]).join(", ")}
              </p>
            </button>
          ))}
        </div>
      </section>

      {background ? (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
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
                      : "border-border bg-surface text-foreground disabled:opacity-40"
                  }`}
                >
                  +1 {STAT_LABELS[stat as ChoosableStat]}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      {background ? (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Powers ({totalSelectedCount}/{rules.powerCount}, Core {selectedCoreCount}/{rules.coreMin}-{rules.coreMax})
          </h3>

          <div className="mt-3 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted">Core Powers ({background.name})</p>
              <div className="flex flex-col gap-2">
                {corePowers.map((power) => (
                  <PowerRow
                    key={power.id}
                    power={power}
                    selected={selectedPowerIds.includes(power.id)}
                    isCore
                    reduced={reducedPowerIds.includes(power.id)}
                    canReduce={rules.maxReductions > 0}
                    reductionLocked={
                      !reducedPowerIds.includes(power.id) && reducedPowerIds.length >= rules.maxReductions
                    }
                    activationOffset={0}
                    onToggle={() => toggleCorePower(power.id)}
                    onToggleReduced={() => toggleReduced(power.id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted">Andere Powers</p>
              <input
                value={powerSearch}
                onChange={(e) => setPowerSearch(e.target.value)}
                placeholder="Suchen…"
                className="mb-2 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <div className="flex max-h-96 flex-col gap-2 overflow-y-auto pr-1">
                {otherPowers.map((power) => (
                  <PowerRow
                    key={power.id}
                    power={power}
                    selected={selectedPowerIds.includes(power.id)}
                    isCore={false}
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
        </section>
      ) : null}

      {background ? (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Gear ({gearSlotTotal}/{rules.gearSlots} Slots)
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              value={gearSearch}
              onChange={(e) => setGearSearch(e.target.value)}
              placeholder="Gear suchen…"
              className="flex-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <select
              value={gearCategory}
              onChange={(e) => setGearCategory(e.target.value)}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
            >
              <option value="all">Alle Kategorien</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
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
                    className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm"
                  >
                    <span className="text-foreground">
                      {item.name} × {qty}{" "}
                      <span className="text-muted">({item.gear_slots * qty} Slots)</span>
                    </span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => removeGear(id)} className="px-2 text-muted hover:text-danger">
                        −
                      </button>
                      <button type="button" onClick={() => addGear(id)} className="px-2 text-muted hover:text-accent">
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
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-1.5 text-left text-sm hover:border-accent"
                title={item.effect_text}
              >
                <span className="text-foreground">{item.name}</span>
                <span className="text-xs text-muted">
                  {item.gear_slots} Slot{item.gear_slots === 1 ? "" : "s"} · {CATEGORY_LABELS[item.category]}
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!canSave || pending}
          onClick={handleSave}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Speichere…" : "Speichern"}
        </button>
        {saved ? <span className="text-sm text-accent">Gespeichert.</span> : null}
        {error ? <span className="text-sm text-danger">{error}</span> : null}
        {!canSave && !error
          ? [statError, powerError, reductionError, gearError].filter(Boolean).map((msg) => (
              <span key={msg} className="text-sm text-muted">
                {msg}
              </span>
            ))
          : null}
      </div>
    </div>
  );
}

function PowerRow({
  power,
  selected,
  isCore,
  reduced,
  canReduce,
  reductionLocked,
  activationOffset,
  onToggle,
  onToggleReduced,
}: {
  power: Power;
  selected: boolean;
  isCore: boolean;
  reduced: boolean;
  canReduce: boolean;
  reductionLocked: boolean;
  activationOffset: number;
  onToggle: () => void;
  onToggleReduced: () => void;
}) {
  const activation = selected
    ? computeActivationNumber(power.activation_number, isCore, activationOffset, reduced)
    : null;

  return (
    <div
      className={`rounded-md border px-3 py-2 text-sm ${
        selected ? "border-accent bg-surface-raised" : "border-border bg-surface"
      }`}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between text-left">
        <span className="text-foreground" title={power.full_text}>
          {power.name}
        </span>
        <span className="text-xs text-muted">
          {selected ? `Akt. ${activation}` : `Akt. ${power.activation_number}`} · Strain {power.strain}
        </span>
      </button>
      {selected && canReduce ? (
        <label className="mt-1 flex items-center gap-1.5 text-xs text-muted">
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
