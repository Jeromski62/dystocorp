"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { combatantsChannelName, type CombatantPatch } from "./combatant-patch";
import type { PlayCombatant } from "./load-play-data";

export type { CombatantPatch };

function applyPatch(list: PlayCombatant[], patch: CombatantPatch): PlayCombatant[] {
  return list.map((c) =>
    c.kind === patch.kind && c.id === patch.id
      ? { ...c, currentHealth: patch.currentHealth, isStunned: patch.isStunned, weaponJammed: patch.weaponJammed }
      : c
  );
}

// Play Mode's HP/-/+ and stun/jam toggles used to only ever update via
// revalidatePath -- a single -1 HP click re-ran the *entire* mission data
// load (see load-play-data.ts) just to change one number. First swapped for
// a postgres_changes subscription (mirroring useRealtimeRow), but this
// project already hit an identical "Realtime broadcast doesn't reliably
// reach the *other* player" bug class for mission_round_state (97e19a4) --
// the fix there only ever confirmed the *acting* player's own click applies
// immediately, never actual delivery to the other player. So this listens
// for the explicit Broadcast the server action sends right after its own
// write succeeds (see actions.ts's fetchAndBroadcastCombatant) instead of
// postgres_changes + RLS-at-delivery-time -- one channel for the whole
// mission rather than one per crew/table.
export function useRealtimeCombatants(missionId: string, initial: PlayCombatant[]): [PlayCombatant[], (patch: CombatantPatch) => void] {
  const [combatants, setCombatants] = useState(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(combatantsChannelName(missionId))
      .on("broadcast", { event: "combatant" }, ({ payload }) => {
        setCombatants((prev) => applyPatch(prev, payload as CombatantPatch));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [missionId]);

  return [combatants, (patch) => setCombatants((prev) => applyPatch(prev, patch))];
}
