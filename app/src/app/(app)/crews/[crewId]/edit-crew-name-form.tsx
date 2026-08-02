"use client";

import { useState, useTransition } from "react";
import { updateCrewName } from "./actions";

// Same inline-edit pattern as a character's name field (see employee-card.tsx):
// click the name to reveal an input, blur/Enter saves, Escape reverts.
export function EditCrewNameForm({ crewId, name }: { crewId: string; name: string }) {
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function saveName() {
    setEditing(false);
    setError(null);
    startTransition(async () => {
      const result = await updateCrewName(crewId, nameValue);
      if (result.error) {
        setError(result.error);
        setNameValue(name);
      }
    });
  }

  return (
    <div className="min-w-0 flex-1">
      {editing ? (
        <input
          autoFocus
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setNameValue(name);
              setEditing(false);
            }
          }}
          className="block w-full max-w-sm bg-black px-2 py-1 font-display text-[24px] tracking-[2.4px] text-white uppercase focus:outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="block max-w-full truncate text-left font-display text-[24px] tracking-[2.4px] text-white uppercase hover:text-accent"
          title="Namen bearbeiten"
        >
          {name}
        </button>
      )}
      {error ? <p className="mt-1 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
