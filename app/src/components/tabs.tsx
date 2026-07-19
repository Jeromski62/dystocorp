"use client";

import { useState, type ReactNode } from "react";

export function Tabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-1 border-b border-corp-border">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium ${
              active === i
                ? "border-b-2 border-corp-accent text-text-default"
                : "text-text-secondary hover:text-text-default"
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
