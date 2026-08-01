"use client";

import { useState, useTransition } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteCrew } from "./actions";

// Figma "Hire Team Header" (node 2116:221) puts crew-destructive actions
// behind a ⋮ overflow trigger instead of a standalone button.
export function CrewOverflowMenu({ crewId, crewName }: { crewId: string; crewName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleLayoff() {
    if (!window.confirm(`"${crewName}" wirklich unwiderruflich löschen?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteCrew(crewId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" disabled={pending} aria-label="Team-Menü">
              <MoreVertical />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive" onClick={handleLayoff}>
            {pending ? "Lösche…" : "Layoff Team"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
