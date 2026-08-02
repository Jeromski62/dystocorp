// Team-Register status — reflects campaign/mission state, not captain health.
// See --status-none/--status-campaign/--status-briefing in globals.css.
export function crewCampaignStatus(campaign: { id: string; name: string } | null, hasPendingMission: boolean) {
  if (!campaign) {
    return { label: "Keine Kampagne", className: "text-status-none", href: null as string | null };
  }
  if (hasPendingMission) {
    return { label: "Einsatzvorbereitung", className: "text-status-briefing", href: `/campaigns/${campaign.id}/missions` };
  }
  return { label: `Aktiv in ${campaign.name}`, className: "text-status-campaign", href: `/campaigns/${campaign.id}` };
}
