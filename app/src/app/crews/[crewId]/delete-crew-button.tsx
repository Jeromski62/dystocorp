"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteCrew } from "./actions";

export function DeleteCrewButton({ crewId, crewName }: { crewId: string; crewName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`"${crewName}" wirklich unwiderruflich löschen?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCrew(crewId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" variant="destructive" size="sm" disabled={pending} onClick={handleDelete}>
        {pending ? "Lösche…" : "Crew löschen"}
      </Button>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
