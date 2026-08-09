"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CombatantKind, PlayCombatant } from "./load-play-data";

const TABLE_FOR_KIND: Record<CombatantKind, string> = {
  captain: "captains",
  first_mate: "first_mates",
  soldier: "soldiers",
};

export type CombatantPatch = {
  kind: CombatantKind;
  id: string;
  currentHealth?: number;
  isStunned?: boolean;
  weaponJammed?: boolean;
};

function applyPatch(list: PlayCombatant[], patch: CombatantPatch): PlayCombatant[] {
  return list.map((c) =>
    c.kind === patch.kind && c.id === patch.id
      ? {
          ...c,
          currentHealth: patch.currentHealth ?? c.currentHealth,
          isStunned: patch.isStunned ?? c.isStunned,
          weaponJammed: patch.weaponJammed ?? c.weaponJammed,
        }
      : c
  );
}

// Play Mode's HP/-/+ and stun/jam toggles used to only ever update via
// revalidatePath -- a single -1 HP click re-ran the *entire* mission data
// load (see load-play-data.ts) just to change one number. Mirrors
// useRealtimeRow's approach (own action result applied locally right away;
// Realtime is what reaches the *other* player, see that file for the full
// rationale) but merged into the existing combatant list across three
// tables and however many crews are in the mission, instead of replacing a
// single row wholesale.
export function useRealtimeCombatants(crewIds: string[], initial: PlayCombatant[]): [PlayCombatant[], (patch: CombatantPatch) => void] {
  const [combatants, setCombatants] = useState(initial);
  const crewIdsKey = crewIds.join(",");

  useEffect(() => {
    const supabase = createClient();
    const channels = crewIdsKey
      .split(",")
      .filter(Boolean)
      .flatMap((crewId) =>
        (Object.entries(TABLE_FOR_KIND) as [CombatantKind, string][]).map(([kind, table]) =>
          supabase
            .channel(`${table}:crew_id=eq.${crewId}`)
            .on(
              "postgres_changes",
              { event: "UPDATE", schema: "public", table, filter: `crew_id=eq.${crewId}` },
              (payload) => {
                if (!payload.new || Object.keys(payload.new).length === 0) return;
                const row = payload.new as { id: string; current_health: number; is_stunned: boolean; weapon_jammed: boolean };
                setCombatants((prev) =>
                  applyPatch(prev, { kind, id: row.id, currentHealth: row.current_health, isStunned: row.is_stunned, weaponJammed: row.weapon_jammed })
                );
              }
            )
            .subscribe()
        )
      );

    return () => {
      for (const channel of channels) supabase.removeChannel(channel);
    };
  }, [crewIdsKey]);

  return [combatants, (patch) => setCombatants((prev) => applyPatch(prev, patch))];
}
