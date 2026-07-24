import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CopyId } from "./copy-id";
import { EditCampaignForm } from "./edit-campaign-form";
import { corpThemeSlug } from "@/lib/corp-theme";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name, description")
    .eq("id", id)
    .maybeSingle();

  if (!campaign) notFound();

  const [{ data: members }, { data: crews }, { count: missionCount }] = await Promise.all([
    supabase.from("campaign_members").select("player_id, players(display_name)"),
    supabase
      .from("crews")
      .select("id, name, player_id, credits, experience, corps(key, name), captains(name, level), first_mates(name)")
      .eq("campaign_id", id),
    supabase.from("missions").select("id", { count: "exact", head: true }).eq("campaign_id", id),
  ]);

  const myCrew = crews?.find((c) => c.player_id === user!.id);

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="font-mono text-[10px] tracking-[0.08em] text-text-subtle uppercase">Kampagnen /</p>
        <div className="mt-1">
          <EditCampaignForm campaignId={campaign.id} name={campaign.name} description={campaign.description} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-text-secondary">
          <span className="flex items-center gap-2">
            Kampagnen-ID zum Einladen:
            <CopyId id={campaign.id} />
          </span>
          <Link href={`/campaigns/${campaign.id}/missions`} className="text-accent hover:underline">
            Missionen →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="border border-border bg-bg-surface p-3.5">
            <p className="font-mono text-[8.5px] tracking-[0.06em] text-text-secondary uppercase">Crews</p>
            <p className="mt-1 font-display text-lg font-bold text-text-default">{String(crews?.length ?? 0).padStart(2, "0")}</p>
          </div>
          <div className="border border-border bg-bg-surface p-3.5">
            <p className="font-mono text-[8.5px] tracking-[0.06em] text-text-secondary uppercase">Missionen</p>
            <p className="mt-1 font-display text-lg font-bold text-text-default">{String(missionCount ?? 0).padStart(2, "0")}</p>
          </div>
          <div className="border border-border bg-bg-surface p-3.5">
            <p className="font-mono text-[8.5px] tracking-[0.06em] text-text-secondary uppercase">Mitspieler</p>
            <p className="mt-1 font-display text-lg font-bold text-text-default">{String(members?.length ?? 0).padStart(2, "0")}</p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="font-mono text-[10px] tracking-[0.08em] text-text-secondary uppercase">{"// Mitspieler"}</h2>
          <ul className="mt-2 flex flex-wrap gap-2 font-mono text-xs">
            {(members ?? []).map((m) => (
              <li key={m.player_id} className="border border-border bg-bg-surface px-3 py-1 text-text-default">
                {m.players?.display_name ?? "?"}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-mono text-[10px] tracking-[0.08em] text-text-secondary uppercase">{"// Teilnehmende Crews"}</h2>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {(crews ?? []).map((crew) => {
              const slug = crew.corps ? corpThemeSlug(crew.corps.key) : undefined;
              return (
                <Link
                  key={crew.id}
                  href={`/crews/${crew.id}`}
                  data-corp={slug}
                  className={`border p-4 transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                    slug
                      ? "border-corp-accent/30 border-t-2 border-t-corp-accent bg-corp-surface hover:border-corp-accent/60"
                      : "border-border bg-bg-surface hover:border-accent"
                  }`}
                >
                  <p className="font-mono text-xs tracking-wide text-corp-accent uppercase">{crew.corps?.name}</p>
                  <p className="mt-1 font-display text-lg font-semibold text-text-default uppercase">{crew.name}</p>
                  <p className="mt-1 font-mono text-xs text-text-secondary">
                    {crew.captains?.name ?? "—"}
                    {crew.captains ? ` · LV ${crew.captains.level}` : ""} · {crew.first_mates?.name ?? "—"}
                  </p>
                  <p className="mt-2 font-mono text-xs text-text-secondary">
                    {crew.credits.toLocaleString("de-DE")} CR · {crew.experience} XP
                  </p>
                </Link>
              );
            })}

            {!myCrew ? (
              <Link
                href={`/campaigns/${campaign.id}/new-crew`}
                className="flex flex-col items-center justify-center border border-dashed border-border p-4 text-center font-display text-sm font-semibold tracking-[0.06em] text-text-secondary uppercase hover:border-accent hover:text-text-default"
              >
                ＋ Eigene Crew erstellen
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
