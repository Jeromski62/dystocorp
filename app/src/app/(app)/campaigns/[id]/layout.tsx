import { createClient } from "@/lib/supabase/server";
import { corpThemeSlug } from "@/lib/corp-theme";

// Scopes --corp-accent/--corp-surface/etc. to the viewer's own crew's corp for
// everything "inside" this campaign (detail + missions) — mirrors
// crews/[crewId]/layout.tsx. Falls back to neutral if the viewer has no crew
// here yet (e.g. before creating one via new-crew).
export default async function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: myCrew } = await supabase
    .from("crews")
    .select("corps(key)")
    .eq("campaign_id", id)
    .eq("player_id", user!.id)
    .maybeSingle();

  const slug = myCrew?.corps ? corpThemeSlug(myCrew.corps.key) : undefined;

  return (
    <div data-corp={slug} className="bg-corp-bg min-h-screen">
      {children}
    </div>
  );
}
