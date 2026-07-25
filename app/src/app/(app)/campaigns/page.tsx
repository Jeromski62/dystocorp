import { createClient } from "@/lib/supabase/server";
import { CreateCampaignForm } from "./create-campaign-form";
import { JoinCampaignForm } from "./join-campaign-form";
import { CampaignCard } from "@/components/campaign-card";
import { corpThemeSlug } from "@/lib/corp-theme";

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
      <h1 className="font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Kampagnen</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Jede Kampagne bündelt eure Crews. Alle Mitspieler sind gleichberechtigt.
      </p>

      <h2 className="mt-8 text-xs uppercase tracking-widest text-text-secondary">Laufende Kampagnen</h2>
      <div className="mt-3 flex flex-col gap-3">
        {activeCampaigns.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
            Noch keine Kampagne. Leg unten eine an oder tritt einer bei.
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section className="rounded-md border border-border bg-bg-surface p-4">
          <h2 className="text-sm font-semibold text-text-default">Neue Kampagne</h2>
          <CreateCampaignForm />
        </section>
        <section className="rounded-md border border-border bg-bg-surface p-4">
          <h2 className="text-sm font-semibold text-text-default">Kampagne beitreten</h2>
          <p className="mt-1 text-xs text-text-secondary">
            Lass dir die Kampagnen-ID von einem Mitspieler geben (auf der Kampagnen-Seite sichtbar).
          </p>
          <JoinCampaignForm />
        </section>
      </div>
    </div>
    </div>
  );
}
