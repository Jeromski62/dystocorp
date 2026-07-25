"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteCampaign, setCampaignArchived } from "./actions";

export function CampaignDangerZone({
  campaignId,
  campaignName,
  archived,
}: {
  campaignId: string;
  campaignName: string;
  archived: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleToggleArchive() {
    setError(null);
    startTransition(async () => {
      const result = await setCampaignArchived(campaignId, !archived);
      if (result?.error) setError(result.error);
    });
  }

  function handleDelete() {
    if (
      !window.confirm(
        `"${campaignName}" wirklich unwiderruflich löschen? Dabei werden auch die Teams aller Mitspieler in dieser Kampagne gelöscht.`
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteCampaign(campaignId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={pending} onClick={handleToggleArchive}>
          {archived ? "Reaktivieren" : "Archivieren"}
        </Button>
        <Button type="button" variant="destructive" size="sm" disabled={pending} onClick={handleDelete}>
          Kampagne löschen
        </Button>
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
