export type StatLine = {
  move: number;
  fight: number;
  shoot: number;
  armour: number;
  will: number;
  health: number;
};

export type ChoosableStat = "move" | "fight" | "shoot" | "health";

export const OFFICER_RULES = {
  captain: {
    baseStats: { move: 6, fight: 3, shoot: 2, armour: 9, will: 3, health: 16 } as StatLine,
    startLevel: 15,
    powerCount: 5,
    coreMin: 3,
    coreMax: 4,
    nonCoreActivationOffset: 2,
    maxReductions: 2,
    gearSlots: 6,
  },
  first_mate: {
    baseStats: { move: 6, fight: 2, shoot: 2, armour: 9, will: 2, health: 14 } as StatLine,
    startLevel: 0,
    powerCount: 4,
    coreMin: 2,
    coreMax: 3,
    nonCoreActivationOffset: 4,
    maxReductions: 0,
    gearSlots: 5,
  },
} as const;

export type OfficerRole = keyof typeof OFFICER_RULES;

export const SOLDIER_RULES = {
  budget: 400,
  maxSoldiers: 8,
  maxSpecialistsDefault: 4,
};

export const EQUIPMENT_CATEGORY_LABELS: Record<string, string> = {
  equipment: "Equipment",
  weapon: "Waffen",
  armour: "Rüstung",
  advanced_weapon: "Advanced Weapon",
  advanced_tech_1: "Advanced Tech I",
  advanced_tech_2: "Advanced Tech II",
  alien_artefact: "Alien Artefact",
};

// Soldier gear slot cap per 05-crew-sheet-data-model.md: "Soldier 1 (bonus slot
// only, campaign loot only)" — campaign loot = Advanced Weapon/Advanced Tech I+II
// (0005_equipment_and_soldier_types.sql's category comment); Alien Artefact is
// campaign loot too but is Captain/First-Mate only (08-campaigns.md), so it's
// excluded here. Some individual Advanced Tech items carry their own
// "Only Captain or First Mate" restriction text and must be filtered out too.
export const SOLDIER_BONUS_GEAR_CATEGORIES = ["advanced_weapon", "advanced_tech_1", "advanced_tech_2"] as const;

export function isSoldierEligibleGear(item: { category: string; restrictions: string | null }): boolean {
  return (
    (SOLDIER_BONUS_GEAR_CATEGORIES as readonly string[]).includes(item.category) &&
    !(item.restrictions ?? "").includes("Captain or First Mate")
  );
}
