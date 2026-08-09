import type { CombatantKind } from "./load-play-data";

// Shared between actions.ts ("use server" -- every export there must be an
// async Server Action, so this plain type/helper can't live there) and
// use-realtime-combatants.ts ("use client").
export type CombatantPatch = {
  kind: CombatantKind;
  id: string;
  currentHealth: number;
  isStunned: boolean;
  weaponJammed: boolean;
};

export function combatantsChannelName(missionId: string): string {
  return `mission:${missionId}:combatants`;
}
