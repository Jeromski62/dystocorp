import { CrewMemberCard } from "./crew-member-card";
import { SoldierStatGrid } from "./soldier-stat-grid";
import { getDossierPortraitUrl } from "@/lib/supabase/dossier-portraits";

type Captain = {
  name: string;
  level?: number;
  move: number;
  fight: number;
  shoot: number;
  armour: number;
  will: number;
  health: number;
  current_health: number;
  portrait_path: string | null;
};

// Read-only summary of an officer's current combat stats, shown above the
// edit-mode tabs (Captain/First Mate/Soldiers/Ship) — a snapshot, not a form.
// Reused for both Captain (roleLabel default, has a level) and First Mate
// (roleLabel="First-Mate-Dossier", no level column in that role).
export function CaptainDossier({
  captain,
  backgroundName,
  roleLabel = "Captain-Dossier",
}: {
  captain: Captain;
  backgroundName: string | null;
  roleLabel?: string;
}) {
  return (
    <CrewMemberCard
      roleLabel={roleLabel}
      name={captain.name}
      level={captain.level}
      subLabel={backgroundName}
      health={captain.health}
      currentHealth={captain.current_health}
      portraitUrl={getDossierPortraitUrl(captain.portrait_path)}
    >
      <SoldierStatGrid stats={captain} />
    </CrewMemberCard>
  );
}
