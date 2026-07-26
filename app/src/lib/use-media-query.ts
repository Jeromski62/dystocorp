"use client";

import { useSyncExternalStore } from "react";

// SSR-safe: server/first paint reports `false` (no window), then syncs to
// the real match once mounted. Used to gate whether the mobile Sheet in
// OfficerBuilder is actually allowed to open -- md:hidden alone would keep
// it visually hidden on desktop but Base UI's Dialog would still focus-trap
// and lock body scroll for a popup nobody can see.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
