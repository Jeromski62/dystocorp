import { CrewMemberCard } from "./crew-member-card";
import { StatLine, type StatColumn } from "@/components/stat-line";
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
  is_stunned: boolean;
  weapon_jammed: boolean;
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
  const statColumns: StatColumn[] = [
    { label: "M", value: `${captain.move}"` },
    { label: "F", value: `+${captain.fight}` },
    { label: "S", value: `+${captain.shoot}` },
    { label: "A", value: String(captain.armour) },
    { label: "W", value: `+${captain.will}` },
  ];

  return (
    <CrewMemberCard
      roleLabel={roleLabel}
      name={captain.name}
      level={captain.level}
      subLabel={backgroundName}
      health={captain.health}
      currentHealth={captain.current_health}
      portraitUrl={getDossierPortraitUrl(captain.portrait_path)}
      isStunned={captain.is_stunned}
      weaponJammed={captain.weapon_jammed}
    >
      <StatLine columns={statColumns} />
    </CrewMemberCard>
  );
}
