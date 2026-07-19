"use client";

import { useMemo, useState } from "react";

type Power = {
  id: string;
  name: string;
  activation_number: number;
  strain: number;
  types: string[];
  full_text: string;
  armour_interference: boolean;
};

type Background = { id: string; name: string };

const TYPE_LABELS: Record<string, string> = {
  self_only: "Self Only",
  line_of_sight: "Line of Sight",
  touch: "Touch",
  out_of_game_a: "Out of Game (A)",
  out_of_game_b: "Out of Game (B)",
};

const TYPE_ORDER = Object.keys(TYPE_LABELS);

export function PowerBrowser({
  powers,
  backgrounds,
  backgroundsByPower,
}: {
  powers: Power[];
  backgrounds: Background[];
  backgroundsByPower: Record<string, string[]>;
}) {
  const [search, setSearch] = useState("");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [backgroundId, setBackgroundId] = useState("all");

  function toggleType(type: string) {
    setActiveTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  }

  const backgroundById = useMemo(() => new Map(backgrounds.map((b) => [b.id, b.name])), [backgrounds]);

  const filtered = powers.filter((power) => {
    const matchesSearch =
      search.trim() === "" ||
      power.name.toLowerCase().includes(search.toLowerCase()) ||
      power.full_text.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTypes.length > 0 && !power.types.some((t) => activeTypes.includes(t))) return false;

    if (backgroundId !== "all" && !(backgroundsByPower[power.id] ?? []).includes(backgroundId)) return false;

    return true;
  });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Suchen (Name oder Text)…"
          className="flex-1 rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-default placeholder:text-text-secondary focus:border-accent focus:outline-none"
        />
        <select
          value={backgroundId}
          onChange={(e) => setBackgroundId(e.target.value)}
          className="rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-default focus:border-accent focus:outline-none"
        >
          <option value="all">Core Power von: Alle</option>
          {backgrounds.map((b) => (
            <option key={b.id} value={b.id}>
              Core Power von: {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {TYPE_ORDER.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => toggleType(type)}
            className={`rounded-full border px-3 py-1 text-xs ${
              activeTypes.includes(type)
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-bg-surface text-text-secondary hover:text-text-default"
            }`}
          >
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-xs text-text-secondary">{filtered.length} Powers</p>

      <div className="mt-2 flex flex-col gap-3">
        {filtered.map((power) => (
          <article key={power.id} className="rounded-md border border-border bg-bg-surface p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-semibold text-text-default">{power.name}</h2>
              <div className="flex flex-wrap gap-1.5 text-xs text-text-secondary">
                <span>Activation {power.activation_number}</span>
                <span>· Strain {power.strain}</span>
                {power.armour_interference ? <span className="text-status-injured">· Armour Interference</span> : null}
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {power.types.map((t) => (
                <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-text-secondary">
                  {TYPE_LABELS[t] ?? t}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-text-secondary">{power.full_text}</p>
            {(backgroundsByPower[power.id] ?? []).length > 0 ? (
              <p className="mt-2 text-xs text-accent">
                Core Power von: {(backgroundsByPower[power.id] ?? []).map((id) => backgroundById.get(id)).join(", ")}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
