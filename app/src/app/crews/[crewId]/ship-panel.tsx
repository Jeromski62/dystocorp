"use client";

import { useState, useTransition } from "react";
import {
  addShipHoldItem,
  addShipUpgrade,
  removeShipHoldItem,
  removeShipUpgrade,
  updateShipName,
} from "./actions";

type ShipUpgradeType = {
  id: string;
  key: string;
  name: string;
  cost_cr: number;
  effect_text: string;
  max_purchases: number;
};

type CrewShipUpgrade = {
  id: string;
  ship_upgrade_type_id: string;
  target_note: string | null;
  ship_upgrade_types: ShipUpgradeType;
};

type EquipmentItem = { id: string; name: string };

type ShipHoldItem = {
  id: string;
  equipment_item_id: string | null;
  custom_name: string | null;
  quantity: number;
  notes: string | null;
  equipment_items: EquipmentItem | null;
};

export function ShipPanel({
  crewId,
  shipName,
  credits,
  shipUpgradeTypes,
  crewShipUpgrades,
  equipment,
  holdItems,
}: {
  crewId: string;
  shipName: string | null;
  credits: number;
  shipUpgradeTypes: ShipUpgradeType[];
  crewShipUpgrades: CrewShipUpgrade[];
  equipment: EquipmentItem[];
  holdItems: ShipHoldItem[];
}) {
  const [name, setName] = useState(shipName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [holdItemId, setHoldItemId] = useState("");
  const [holdCustomName, setHoldCustomName] = useState("");
  const [holdQuantity, setHoldQuantity] = useState(1);

  function saveShipName() {
    startTransition(async () => {
      await updateShipName(crewId, name);
    });
  }

  function handleAddUpgrade(upgradeTypeId: string) {
    setError(null);
    startTransition(async () => {
      const result = await addShipUpgrade(crewId, upgradeTypeId, null);
      if (result.error) setError(result.error);
    });
  }

  function handleRemoveUpgrade(id: string) {
    startTransition(async () => {
      await removeShipUpgrade(crewId, id);
    });
  }

  function handleAddHoldItem() {
    setError(null);
    startTransition(async () => {
      const result = await addShipHoldItem(
        crewId,
        holdItemId || null,
        holdItemId ? null : holdCustomName.trim() || null,
        holdQuantity,
        null
      );
      if (result.error) setError(result.error);
      else {
        setHoldItemId("");
        setHoldCustomName("");
        setHoldQuantity(1);
      }
    });
  }

  function handleRemoveHoldItem(id: string) {
    startTransition(async () => {
      await removeShipHoldItem(crewId, id);
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <label className="text-xs uppercase tracking-wide text-muted">Schiffsname</label>
        <div className="mt-1 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-sm rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={saveShipName}
            disabled={pending}
            className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:border-accent"
          >
            Speichern
          </button>
        </div>
      </section>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Ship Upgrades ({credits}cr verfügbar)
        </h3>
        {crewShipUpgrades.length > 0 ? (
          <div className="mt-2 flex flex-col gap-1.5">
            {crewShipUpgrades.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm"
              >
                <span className="text-foreground">{u.ship_upgrade_types.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveUpgrade(u.id)}
                  disabled={pending}
                  className="text-xs text-muted hover:text-danger"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-3 flex flex-col gap-1.5">
          {shipUpgradeTypes.map((t) => {
            const boughtCount = crewShipUpgrades.filter((u) => u.ship_upgrade_type_id === t.id).length;
            const disabled = pending || boughtCount >= t.max_purchases || t.cost_cr > credits;
            return (
              <button
                key={t.id}
                type="button"
                disabled={disabled}
                onClick={() => handleAddUpgrade(t.id)}
                title={t.effect_text}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-1.5 text-left text-sm hover:border-accent disabled:opacity-40"
              >
                <span className="text-foreground">{t.name}</span>
                <span className="text-xs text-muted">{t.cost_cr}cr</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">Ship&apos;s Hold</h3>
        {holdItems.length > 0 ? (
          <div className="mt-2 flex flex-col gap-1.5">
            {holdItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm"
              >
                <span className="text-foreground">
                  {item.equipment_items?.name ?? item.custom_name} × {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveHoldItem(item.id)}
                  disabled={pending}
                  className="text-xs text-muted hover:text-danger"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">Leer.</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={holdItemId}
            onChange={(e) => setHoldItemId(e.target.value)}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            <option value="">Freitext-Item…</option>
            {equipment.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          {!holdItemId ? (
            <input
              value={holdCustomName}
              onChange={(e) => setHoldCustomName(e.target.value)}
              placeholder="Name"
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          ) : null}
          <input
            type="number"
            min={1}
            value={holdQuantity}
            onChange={(e) => setHoldQuantity(Math.max(1, Number(e.target.value)))}
            className="w-16 rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddHoldItem}
            disabled={pending || (!holdItemId && !holdCustomName.trim())}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:border-accent disabled:opacity-40"
          >
            Hinzufügen
          </button>
        </div>
      </section>
    </div>
  );
}
