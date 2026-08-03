"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toggleMissionParticipant } from "./actions";

type Crew = { id: string; name: string; player_id: string };

export function ParticipantsPanel({
  campaignId,
  missionId,
  crews,
  participantCrewIds,
}: {
  campaignId: string;
  missionId: string;
  crews: Crew[];
  participantCrewIds: string[];
}) {
  const [pending, startTransition] = useTransition();
  const participantSet = new Set(participantCrewIds);

  function toggle(crewId: string, add: boolean) {
    startTransition(async () => {
      await toggleMissionParticipant(missionId, campaignId, crewId, add);
    });
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <h3 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Teilnehmende Teams"}</h3>
      {crews.length === 0 ? (
        <p className="mt-2 text-sm text-text-secondary">
          Noch keine Teams in dieser Kampagne.{" "}
          <Link href={`/campaigns/${campaignId}`} className="text-corp-accent hover:underline">
            Team erstellen oder importieren →
          </Link>
        </p>
      ) : (
        <div className="mt-2 flex flex-col gap-1.5">
          {crews.map((crew) => {
            const active = participantSet.has(crew.id);
            return (
              <label
                key={crew.id}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-bg-raised px-3 py-2 text-sm text-text-default"
              >
                <input
                  type="checkbox"
                  checked={active}
                  disabled={pending}
                  onChange={(e) => toggle(crew.id, e.target.checked)}
                  className="accent-corp-accent"
                />
                {crew.name}
              </label>
            );
          })}
        </div>
      )}
      <Link href={`/campaigns/${campaignId}`} className="mt-2 inline-block text-xs text-text-secondary hover:text-corp-accent">
        Team fehlt noch? Zur Kampagne →
      </Link>
    </div>
  );
}
