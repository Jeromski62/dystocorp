"use client";

import { useEffect, useState } from "react";

export function Clock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // render nothing server-side to avoid a hydration mismatch on the ticking value
  if (!time) return null;

  return <span className={className}>{time}</span>;
}
