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
