import { createClient } from "@/lib/supabase/server";
import { CreateCampaignForm } from "./create-campaign-form";
import { JoinCampaignForm } from "./join-campaign-form";
import { CampaignCard } from "@/components/campaign-card";
import { corpThemeSlug } from "@/lib/corp-theme";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("campaign_members")
    .select("campaigns(id, name, description, created_at, archived_at, crews(corps(key, name)))")
    .eq("player_id", user!.id)
    .order("joined_at", { ascending: false });

  const campaigns = (memberships ?? [])
    .map((m) => m.campaigns)
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const activeCampaigns = campaigns.filter((c) => !c.archived_at);
  const archivedCampaigns = campaigns.filter((c) => c.archived_at);

  function participatingCorps(campaign: (typeof campaigns)[number]) {
    const seen = new Map<string, { key: string; slug: string; name: string }>();
    for (const crew of campaign.crews) {
      if (!crew.corps) continue;
      const slug = corpThemeSlug(crew.corps.key);
      if (!seen.has(slug)) seen.set(slug, { key: crew.corps.key, slug, name: crew.corps.name });
    }
    return Array.from(seen.values());
  }

  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Kampagnen</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Jede Kampagne bündelt eure Teams. Alle Mitspieler sind gleichberechtigt.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="ghost">＋ Kampagne beitreten</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Kampagne beitreten</DialogTitle>
                <DialogDescription>Lass dir die Kampagnen-ID von einem Mitspieler geben (auf der Kampagnen-Seite sichtbar).</DialogDescription>
              </DialogHeader>
              <JoinCampaignForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger render={<Button variant="cta">＋ Neue Kampagne</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neue Kampagne</DialogTitle>
              </DialogHeader>
              <CreateCampaignForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <h2 className="mt-8 text-xs uppercase tracking-widest text-text-secondary">Laufende Kampagnen</h2>
      <div className="mt-3 flex flex-col gap-3">
        {activeCampaigns.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
            Noch keine Kampagne. Leg oben eine an oder tritt einer bei.
          </p>
        ) : (
          activeCampaigns.map((c) => (
            <CampaignCard key={c.id} href={`/campaigns/${c.id}`} name={c.name} corps={participatingCorps(c)} />
          ))
        )}
      </div>

      {archivedCampaigns.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xs uppercase tracking-widest text-text-secondary">Archiviert</h2>
          <div className="mt-3 flex flex-col gap-3">
            {archivedCampaigns.map((c) => (
              <CampaignCard key={c.id} href={`/campaigns/${c.id}`} name={c.name} corps={participatingCorps(c)} archived />
            ))}
          </div>
        </div>
      ) : null}
    </div>
    </div>
  );
}
