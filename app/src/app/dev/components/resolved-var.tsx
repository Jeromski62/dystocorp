"use client";

import { useEffect, useRef, useState } from "react";

// Reads the live, cascade-resolved value of a CSS custom property straight
// from the DOM at mount — avoids hand-transcribing hex codes that go stale
// the moment globals.css changes. Renders in its own ref'd span so it picks
// up whatever [data-corp] scope (if any) it happens to be nested in.
export function ResolvedVar({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (ref.current) {
      setValue(getComputedStyle(ref.current).getPropertyValue(name).trim());
    }
  }, [name]);

  return (
    <span ref={ref} className="font-mono text-[11px] text-text-subtle">
      {value ?? "…"}
    </span>
  );
}
