"use client";

import { useState, type ReactNode } from "react";

export function Tabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium ${
              active === i
                ? "border-b-2 border-accent text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-6">{tabs[active].content}</div>
    </div>
  );
}
