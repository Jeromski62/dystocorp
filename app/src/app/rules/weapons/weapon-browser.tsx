"use client";

import { useState } from "react";

type Item = {
  id: string;
  name: string;
  category: string;
  base_weapon_type: string | null;
  damage_modifier: string | null;
  max_range: string | null;
  cost_cr: number | null;
  effect_text: string;
  restrictions: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  weapon: "Waffe",
  advanced_weapon: "Advanced Weapon",
  armour: "Rüstung",
};

const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);

export function WeaponBrowser({ items }: { items: Item[] }) {
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  function toggleCategory(category: string) {
    setActiveCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  }

  const filtered = items.filter((item) => {
    const matchesSearch = search.trim() === "" || item.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategories.length > 0 && !activeCategories.includes(item.category)) return false;
    return true;
  });

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Suchen (Name)…"
        className="w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {CATEGORY_ORDER.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => toggleCategory(category)}
            className={`rounded-full border px-3 py-1 text-xs ${
              activeCategories.includes(category)
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-bg-surface text-text-secondary hover:text-text-default"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-text-secondary">{filtered.length} Einträge</p>

      <div className="mt-2 flex flex-col gap-3">
        {filtered.map((item) => (
          <article key={item.id} className="rounded-md border border-border bg-bg-surface p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold text-text-default">{item.name}</h2>
              <div className="flex flex-wrap gap-1.5 text-xs text-text-secondary">
                <span className="rounded-full border border-border px-2 py-0.5">{CATEGORY_LABELS[item.category] ?? item.category}</span>
                {item.damage_modifier ? <span>Damage {item.damage_modifier}</span> : null}
                {item.max_range ? <span>· Range {item.max_range}</span> : null}
                {item.cost_cr != null ? <span>· {item.cost_cr}cr</span> : null}
              </div>
            </div>
            <p className="mt-2 text-sm text-text-secondary">{item.effect_text}</p>
            {item.restrictions ? <p className="mt-1 text-xs text-status-injured">{item.restrictions}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
