"use client";

import { useEffect, useState } from "react";
import { createClient } from "./client";

// First Realtime usage in this codebase -- Play Mode's round counter/active
// turn/end-round consent must be live for both players (not just on
// reload), everything else in the app is Server Actions + revalidatePath.
// Deliberately narrow: subscribes to a single row (by `${column}=eq.${value}`)
// and applies the raw postgres_changes payload straight into local state,
// no round-trip through the server -- fine for a small, self-contained row
// like mission_round_state.
//
// Also returns a setter so the acting client can apply its own mutation's
// result immediately instead of waiting on the broadcast to round-trip back
// -- Realtime delivery isn't instant (and, if misconfigured, might not
// arrive at all), so without this the *initiating* player's own click could
// sit there looking like nothing happened even though the write succeeded.
// The eventual postgres_changes event for the same row is harmless/idempotent
// on top of this, and is still what delivers the update to the other player.
export function useRealtimeRow<T extends Record<string, unknown>>(
  table: string,
  filter: { column: string; value: string },
  initial: T
): [T, (next: T) => void] {
  const [row, setRow] = useState<T>(initial);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`${table}:${filter.column}=eq.${filter.value}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: `${filter.column}=eq.${filter.value}`,
        },
        (payload) => {
          if (payload.new && Object.keys(payload.new).length > 0) {
            setRow(payload.new as T);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter.column, filter.value]);

  return [row, setRow];
}
