import type { ChoosableStat, StatLine } from "./constants";

export function computeStatLine(
  base: StatLine,
  fixedMods: Record<string, number>,
  chosenOptions: ChoosableStat[]
): StatLine {
  const stats = { ...base };
  for (const [stat, mod] of Object.entries(fixedMods)) {
    if (stat in stats) {
      stats[stat as keyof StatLine] += mod;
    }
  }
  for (const stat of chosenOptions) {
    stats[stat] += 1;
  }
  return stats;
}

export function computeActivationNumber(
  printed: number,
  isCore: boolean,
  nonCoreOffset: number,
  reduced: boolean
): number {
  const base = isCore ? printed : printed + nonCoreOffset;
  return reduced ? base - 1 : base;
}

/** First knife carried takes no gear slot; every other item costs its listed slots. */
export function computeGearSlotTotal(items: { key: string; gearSlots: number }[]): number {
  const total = items.reduce((sum, item) => sum + item.gearSlots, 0);
  const hasKnife = items.some((item) => item.key === "knife");
  return hasKnife ? total - 1 : total;
}

export function validateChosenStatOptions(
  chosen: string[],
  allowedOptions: string[],
  count: number
): string | null {
  if (chosen.length !== count) {
    return `Wähle genau ${count} Stat-Bonus/Boni.`;
  }
  if (new Set(chosen).size !== chosen.length) {
    return "Jeder Stat-Bonus darf nur einmal gewählt werden.";
  }
  if (chosen.some((c) => !allowedOptions.includes(c))) {
    return "Ungültige Stat-Auswahl für diesen Background.";
  }
  return null;
}

export function validatePowerSelection(
  selectedPowerIds: string[],
  corePowerIds: Set<string>,
  rules: { powerCount: number; coreMin: number; coreMax: number }
): string | null {
  if (selectedPowerIds.length !== rules.powerCount) {
    return `Wähle genau ${rules.powerCount} Powers.`;
  }
  if (new Set(selectedPowerIds).size !== selectedPowerIds.length) {
    return "Jede Power darf nur einmal gewählt werden.";
  }
  const coreCount = selectedPowerIds.filter((id) => corePowerIds.has(id)).length;
  if (coreCount < rules.coreMin || coreCount > rules.coreMax) {
    return `Wähle ${rules.coreMin}-${rules.coreMax} Core Powers (aktuell ${coreCount}).`;
  }
  return null;
}

export function validateReduction(
  reducedIds: string[],
  selectedIds: string[],
  maxReductions: number
): string | null {
  if (reducedIds.length > maxReductions) {
    return `Höchstens ${maxReductions} Powers dürfen gesenkt werden.`;
  }
  if (new Set(reducedIds).size !== reducedIds.length) {
    return "Jede Power darf nur einmal gesenkt werden.";
  }
  if (reducedIds.some((id) => !selectedIds.includes(id))) {
    return "Nur gewählte Powers können gesenkt werden.";
  }
  return null;
}

export function validateGearSlots(totalCost: number, limit: number): string | null {
  if (totalCost > limit) {
    return `Gear-Slots überschritten (${totalCost}/${limit}).`;
  }
  return null;
}
