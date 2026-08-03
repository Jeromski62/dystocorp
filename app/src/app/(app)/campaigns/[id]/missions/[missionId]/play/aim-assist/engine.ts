// Pure logic for the Aim Assist shooting-action calculator -- no React, no
// Supabase. Mirrors the mermaid flow in the Play Mode vault doc
// ("Features/Play Mode/Aim Assist Flow.md") node-for-node so the two stay in
// lockstep; see that doc for the rules citations behind each modifier.
//
// Dice stay physical (Play Mode PRD: "kein automatischer Kampf-Resolver") --
// every function here takes an already-rolled d20/TN result as input and
// only computes the deterministic parts (modifiers, comparison, damage,
// stun/wound/death). Nothing here generates randomness.

export const STUN_DAMAGE_THRESHOLD = 4;
export const WOUNDED_HEALTH_THRESHOLD = 4;
export const COVER_BONUS = { none: 0, light: 2, heavy: 4 } as const;
export const LARGE_TARGET_MALUS = -2;
export const WOUNDED_MALUS = -2;
export const STUNNED_BONUS = 2;
export const LOST_EYE_MALUS = -1;
export const HASTY_SHOT_BONUS = 1;
export const CLEARED_JAM_BONUS = 1;
export const CRITICAL_HIT_BONUS_DAMAGE = 5;
export const GRENADE_TN = 12;
export const GRENADE_IN_LOS_BONUS = 2;
export const GRENADE_HASTY_SHOT_MALUS = -1;
export const GRENADE_LAUNCHER_MALUS = -1;
export const FRAGMENTATION_ATTACK_BONUS = 3;
export const MAX_SCATTER_INCHES = 6;

export type Cover = "none" | "light" | "heavy";

export type ShooterInput = {
  shoot: number;
  isRobot: boolean;
  currentHealth: number;
  health: number;
  hasMovedThisActivation: boolean;
  clearedJamThisActivation: boolean;
};

export type TargetInput = {
  fight: number;
  armour: number;
  isRobot: boolean;
  currentHealth: number;
  health: number;
  isStunned: boolean;
  isLarge: boolean;
  isInCombat: boolean;
  interveningTerrainCount: number;
  cover: Cover;
  lostEyeStacks: number;
};

export function isShooterWounded(shooter: Pick<ShooterInput, "isRobot" | "currentHealth">): boolean {
  return !shooter.isRobot && shooter.currentHealth <= WOUNDED_HEALTH_THRESHOLD && shooter.currentHealth > 0;
}

export function isTargetWounded(target: Pick<TargetInput, "isRobot" | "currentHealth">): boolean {
  return !target.isRobot && target.currentHealth <= WOUNDED_HEALTH_THRESHOLD && target.currentHealth > 0;
}

export type ShooterTotalResult = {
  total: number;
  isCriticalHit: boolean;
  isJam: boolean;
  woundedMalusApplied: boolean;
  breakdown: { label: string; value: number }[];
};

// S_Moved -> S_Hasty/S_NoHasty -> S_ClearedJam -> S_ShooterWounded -> S_ShooterRoll -> S_ShooterCrit -> S_JamCheck
export function computeShooterTotal(shooter: ShooterInput, roll: number): ShooterTotalResult {
  const breakdown: { label: string; value: number }[] = [{ label: "Shoot", value: shooter.shoot }];
  let total = shooter.shoot;

  if (shooter.hasMovedThisActivation) {
    total += HASTY_SHOT_BONUS;
    breakdown.push({ label: "Hasty Shot", value: HASTY_SHOT_BONUS });
  }
  if (shooter.clearedJamThisActivation) {
    total += CLEARED_JAM_BONUS;
    breakdown.push({ label: "Cleared Jam", value: CLEARED_JAM_BONUS });
  }
  const woundedMalusApplied = isShooterWounded(shooter);
  if (woundedMalusApplied) {
    total += WOUNDED_MALUS;
    breakdown.push({ label: "Wounded", value: WOUNDED_MALUS });
  }

  total += roll;
  breakdown.push({ label: "Roll", value: roll });

  return {
    total,
    isCriticalHit: roll === 20,
    isJam: roll === 1,
    woundedMalusApplied,
    breakdown,
  };
}

export type TargetTotalResult = {
  total: number;
  isAutoMiss: boolean;
  instantKill: boolean;
  breakdown: { label: string; value: number }[];
};

// S_IntTerrain -> S_Cover -> S_StunnedMod -> S_LargeTarget -> S_TargetWounded -> S_LostEye -> S_TargetRoll -> S_TargetCrit
export function computeTargetTotal(target: TargetInput, roll: number): TargetTotalResult {
  // Lost Eye's second stack is "treated as a Dead result" per the
  // permanent_injury_types seed (not mentioned in the Aim Assist Flow doc
  // itself) -- skip the roll entirely when targeted.
  if (target.lostEyeStacks >= 2) {
    return { total: 0, isAutoMiss: false, instantKill: true, breakdown: [{ label: "Lost Eye (2nd stack)", value: 0 }] };
  }

  const breakdown: { label: string; value: number }[] = [{ label: "Fight", value: target.fight }];
  let total = target.fight;

  if (target.interveningTerrainCount > 0) {
    const bonus = target.interveningTerrainCount;
    total += bonus;
    breakdown.push({ label: `Intervening Terrain (x${target.interveningTerrainCount})`, value: bonus });
  }
  if (target.cover !== "none") {
    const bonus = COVER_BONUS[target.cover];
    total += bonus;
    breakdown.push({ label: target.cover === "light" ? "Light Cover" : "Heavy Cover", value: bonus });
  }
  if (target.isStunned) {
    total += STUNNED_BONUS;
    breakdown.push({ label: "Stunned", value: STUNNED_BONUS });
  }
  if (target.isLarge) {
    total += LARGE_TARGET_MALUS;
    breakdown.push({ label: "Large Target", value: LARGE_TARGET_MALUS });
  }
  if (isTargetWounded(target)) {
    total += WOUNDED_MALUS;
    breakdown.push({ label: "Wounded", value: WOUNDED_MALUS });
  }
  if (target.lostEyeStacks === 1) {
    total += LOST_EYE_MALUS;
    breakdown.push({ label: "Lost Eye", value: LOST_EYE_MALUS });
  }

  total += roll;
  breakdown.push({ label: "Roll", value: roll });

  return { total, isAutoMiss: roll === 20, instantKill: false, breakdown };
}

export type StandardAttackResult = {
  hit: boolean;
  damage: number;
  resultingHealth: number;
  becomesStunned: boolean;
  becomesWounded: boolean;
  dies: boolean;
};

// S_Compare -> Miss/Hit -> Damage -> DamagePositive -> Wound -> StunCheck -> HealthCheck -> ZeroCheck
export function resolveStandardAttack(params: {
  shooterTotal: number;
  targetTotal: number;
  targetAutoMiss: boolean;
  targetInstantKill: boolean;
  isCriticalHit: boolean;
  targetArmour: number;
  weaponDamageModifier: number;
  targetCurrentHealth: number;
  targetIsRobot: boolean;
}): StandardAttackResult {
  if (params.targetInstantKill) {
    return { hit: true, damage: params.targetCurrentHealth, resultingHealth: 0, becomesStunned: false, becomesWounded: false, dies: true };
  }

  const hit = !params.targetAutoMiss && params.shooterTotal > params.targetTotal;
  if (!hit) {
    return { hit: false, damage: 0, resultingHealth: params.targetCurrentHealth, becomesStunned: false, becomesWounded: false, dies: false };
  }

  const rawDamage =
    params.shooterTotal - params.targetArmour + params.weaponDamageModifier + (params.isCriticalHit ? CRITICAL_HIT_BONUS_DAMAGE : 0);
  const damage = Math.max(0, rawDamage);

  if (damage <= 0) {
    return { hit: true, damage: 0, resultingHealth: params.targetCurrentHealth, becomesStunned: false, becomesWounded: false, dies: false };
  }

  const resultingHealth = Math.max(0, params.targetCurrentHealth - damage);
  const becomesStunned = damage >= STUN_DAMAGE_THRESHOLD;
  const becomesWounded = !params.targetIsRobot && resultingHealth > 0 && resultingHealth <= WOUNDED_HEALTH_THRESHOLD;
  const dies = resultingHealth <= 0;

  return { hit: true, damage, resultingHealth, becomesStunned, becomesWounded, dies };
}

export type GrenadeShootRollResult = {
  total: number;
  meetsTN: boolean;
  isJam: boolean;
  breakdown: { label: string; value: number }[];
};

// G_ShootRoll -> G_JamCheck -> G_Success
export function computeGrenadeShootRoll(params: {
  roll: number;
  targetPointInLOS: boolean;
  hastyShot: boolean;
  firedWithLauncher: boolean;
}): GrenadeShootRollResult {
  const breakdown: { label: string; value: number }[] = [{ label: "Roll", value: params.roll }];
  let total = params.roll;

  if (params.targetPointInLOS) {
    total += GRENADE_IN_LOS_BONUS;
    breakdown.push({ label: "Target Point in LOS", value: GRENADE_IN_LOS_BONUS });
  }
  if (params.hastyShot) {
    total += GRENADE_HASTY_SHOT_MALUS;
    breakdown.push({ label: "Hasty Shot", value: GRENADE_HASTY_SHOT_MALUS });
  }
  if (params.firedWithLauncher) {
    total += GRENADE_LAUNCHER_MALUS;
    breakdown.push({ label: "Grenade Launcher", value: GRENADE_LAUNCHER_MALUS });
  }

  return {
    total,
    meetsTN: total >= GRENADE_TN,
    isJam: params.firedWithLauncher && params.roll === 1,
    breakdown,
  };
}

export type ScatterResult = {
  scattered: boolean;
  completeMiss: boolean;
  scatterInches: number;
};

// G_Success -> G_Fail -> G_FailFar -> G_CompleteMiss / G_Scattered
export function computeScatter(marginOfFailure: number): ScatterResult {
  const margin = Math.max(0, marginOfFailure);
  if (margin > MAX_SCATTER_INCHES) {
    return { scattered: false, completeMiss: true, scatterInches: margin };
  }
  return { scattered: true, completeMiss: false, scatterInches: margin };
}

// equipment_items.damage_modifier is free text ("+2", "-1", or qualitative
// values like "Grenade") -- not accounted for in the Aim Assist Flow doc's
// damage formula at all, so this parses the numeric case and lets the
// calculator fall back to a manual override for the qualitative one.
export function parseWeaponDamageModifier(raw: string | null): number | null {
  if (!raw) return null;
  const match = raw.trim().match(/^[+-]?\d+$/);
  if (!match) return null;
  return Number.parseInt(raw, 10);
}
