import { notFound } from "next/navigation";
import { loadCrewDetail } from "./load-crew-data";
import { CrewWizard } from "./crew-wizard";
import { CrewReadonlyView } from "./crew-readonly-view";

// Router for the three crew-detail flows: an owner whose crew isn't
// finished yet gets the step-gated creation wizard; everyone else (the
// owner of a finished crew, or a campaign teammate) gets the read-only
// dossier view. Editing a finished crew happens on the separate
// crews/[crewId]/edit route, reached via the "Bearbeiten" button there.
export default async function CrewPage({
  params,
}: {
  params: Promise<{ crewId: string }>;
}) {
  const { crewId } = await params;
  const data = await loadCrewDetail(crewId);
  if (!data) notFound();

  const { crew, isOwner } = data;

  if (isOwner && !crew.setup_completed_at) {
    return <CrewWizard crewId={crewId} {...data} />;
  }

  return (
    <CrewReadonlyView
      crewId={crewId}
      crew={crew}
      captain={data.captain}
      captainBackgroundName={data.captainBackgroundName}
      firstMate={data.firstMate}
      firstMateBackgroundName={data.firstMateBackgroundName}
      soldiers={data.soldiers}
      crewShipUpgrades={data.crewShipUpgrades}
      holdItems={data.holdItems}
      gearByType={data.gearByType}
      corpSlug={data.corpSlug}
      isOwner={isOwner}
    />
  );
}
