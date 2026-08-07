"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, MoreVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { StatLine, type StatColumn } from "@/components/stat-line";

const DEFAULT_NAME = "Entbehrlicher Praktikant";

type SoldierType = {
  id: string;
  name: string;
  table_type: "standard" | "specialist";
  move: number;
  fight: number;
  shoot: number;
  armour: number;
  will: number;
  health: number;
  cost_cr: number;
};

type Soldier = {
  id: string;
  name: string | null;
  is_robot: boolean;
  current_health: number;
  bonus_gear_item_id: string | null;
  bonus_gear: { id: string; name: string } | null;
  soldier_types: SoldierType;
};

// Figma "Dysto-Corp-Rough-Concept" EmployeeCard (node 2116:650): a roster row
// with a placeholder portrait, an inline-editable name over the fixed role
// label, a Robot switch + overflow menu, the same StatLine block as Officer
// Builder's Dossier, and equipment badges.
export function EmployeeCard({
  soldier,
  gearItems,
  pending,
  inCampaign,
  bonusGearOptions,
  portraitUrl,
  onNameChange,
  onRobotToggle,
  onBonusGearChange,
  onRemove,
  onPortraitChange,
  onPortraitRemove,
}: {
  soldier: Soldier;
  gearItems: { name: string; quantity: number }[];
  pending: boolean;
  inCampaign: boolean;
  bonusGearOptions: { category: string; label: string; items: { id: string; name: string }[] }[];
  portraitUrl: string | null;
  onNameChange: (name: string) => void;
  onRobotToggle: (isRobot: boolean) => void;
  onBonusGearChange: (equipmentItemId: string) => void;
  onRemove: () => void;
  onPortraitChange: (file: File) => void;
  onPortraitRemove: () => void;
}) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(soldier.name ?? "");
  const portraitInputRef = useRef<HTMLInputElement>(null);

  function saveName() {
    setEditingName(false);
    onNameChange(nameValue);
  }

  const stats = soldier.soldier_types;
  const statColumns: StatColumn[] = [
    { label: "Move", value: `${stats.move}"` },
    { label: "Fight", value: `+${stats.fight}` },
    { label: "Shoot", value: `+${stats.shoot}` },
    { label: "Armor", value: String(stats.armour) },
    { label: "Will", value: `+${stats.will}` },
    { label: "Health", value: String(stats.health) },
  ];

  const equipmentBadges = [...gearItems.map((g) => (g.quantity > 1 ? `${g.name} ×${g.quantity}` : g.name))];
  if (soldier.bonus_gear) equipmentBadges.push(soldier.bonus_gear.name);

  return (
    <div className="group flex items-start gap-4 border-b border-white/42 py-6 pr-4 transition-colors hover:bg-white/[0.03]">
      <div className="group/portrait relative size-[112px] shrink-0 overflow-hidden border border-border bg-black/60">
        <Image
          src={portraitUrl ?? "/dossiers/dossier_placeholder.png"}
          alt=""
          width={112}
          height={112}
          className="size-full object-cover"
        />
        <button
          type="button"
          onClick={() => portraitInputRef.current?.click()}
          disabled={pending}
          aria-label="Bild hochladen"
          className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover/portrait:opacity-100 focus-visible:opacity-100 disabled:pointer-events-none"
        >
          <Camera className="size-6" />
        </button>
        <input
          ref={portraitInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onPortraitChange(file);
          }}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex w-full flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            {editingName ? (
              <input
                autoFocus
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") {
                    setNameValue(soldier.name ?? "");
                    setEditingName(false);
                  }
                }}
                placeholder={DEFAULT_NAME}
                className="block w-full max-w-sm border border-accent bg-black px-2 py-1 font-display text-[24px] tracking-[2.4px] text-white uppercase focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingName(true)}
                className="-mx-2 -my-1 block max-w-full cursor-text truncate px-2 py-1 text-left font-display text-[24px] tracking-[2.4px] text-white uppercase hover:bg-white/10"
                title="Namen bearbeiten"
              >
                {soldier.name || DEFAULT_NAME}
              </button>
            )}
            <p className="font-display text-[24px] tracking-[2.4px] text-white/50 uppercase">{soldier.soldier_types.name}</p>
            {portraitUrl ? (
              <button
                type="button"
                onClick={onPortraitRemove}
                disabled={pending}
                className="mt-1 font-mono text-xs text-text-secondary hover:text-danger disabled:opacity-40"
              >
                Bild entfernen
              </button>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="font-display text-[16px] font-medium tracking-[1.6px] text-white/50 uppercase">Robot</span>
              <Switch checked={soldier.is_robot} onCheckedChange={onRobotToggle} disabled={pending} aria-label="Robot" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    disabled={pending}
                    aria-label="Mitarbeiter-Menü"
                    className="flex size-10 items-center justify-center text-white hover:text-accent disabled:opacity-40"
                  />
                }
              >
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    const label = soldier.soldier_types.name + (soldier.name ? ` "${soldier.name}"` : "");
                    if (window.confirm(`${label} wirklich entlassen?`)) onRemove();
                  }}
                >
                  Entlassen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="font-display text-[16px] font-medium tracking-[1.6px] text-white uppercase">Stats</p>
          <StatLine columns={statColumns} />
        </div>

        {equipmentBadges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {equipmentBadges.map((label, i) => (
              <span
                key={i}
                className="border border-white/52 bg-black px-4 py-2 font-display text-[16px] font-semibold tracking-[1.6px] text-white uppercase"
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}

        {inCampaign ? (
          <label className="flex items-center gap-2 font-mono text-[14px] text-text-secondary">
            Bonus-Ausrüstung
            <select
              value={soldier.bonus_gear_item_id ?? ""}
              onChange={(e) => onBonusGearChange(e.target.value)}
              className="rounded-md border border-corp-border bg-corp-surface px-2 py-1 text-sm text-text-default focus:border-corp-accent focus:outline-none"
            >
              <option value="">— keine —</option>
              {bonusGearOptions.map(({ category, label, items }) =>
                items.length > 0 ? (
                  <optgroup key={category} label={label}>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null
              )}
            </select>
          </label>
        ) : (
          <p className="font-mono text-[14px] text-text-subtle">
            Bonus-Ausrüstung (Campaign Loot) nur verfügbar, sobald dieses Team in einer Kampagne mitspielt.
          </p>
        )}
      </div>
    </div>
  );
}
