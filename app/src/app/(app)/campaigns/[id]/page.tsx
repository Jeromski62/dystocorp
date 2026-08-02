import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CopyId } from "./copy-id";
import { EditCampaignForm } from "./edit-campaign-form";
import { CampaignDangerZone } from "./campaign-danger-zone";
import { ImportCrewCard } from "./import-crew-card";
import { corpThemeSlug } from "@/lib/corp-theme";
import { CrewCard } from "@/components/crew-card";

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
    .select("id, name, description, archived_at")
    .eq("id", id)
    .maybeSingle();

  if (!campaign) notFound();

  const [{ data: members }, { data: crews }, { count: missionCount }] = await Promise.all([
    supabase.from("campaign_members").select("player_id, players(display_name)"),
    supabase
      .from("crews")
      .select(
        "id, name, player_id, credits, experience, corps(key, name), captains(name, level), first_mates(name), soldiers(count)"
      )
      .eq("campaign_id", id),
    supabase.from("missions").select("id", { count: "exact", head: true }).eq("campaign_id", id),
  ]);

  const myCrew = crews?.find((c) => c.player_id === user!.id);

  const { data: importableCrews } = myCrew
    ? { data: [] }
    : await supabase
        .from("crews")
        .select("id, name, corps(name)")
        .eq("player_id", user!.id)
        .is("campaign_id", null)
        .order("created_at", { ascending: false });

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[14px] tracking-[0.08em] text-text-subtle uppercase">Kampagnen /</p>
            <div className="mt-1">
              <EditCampaignForm campaignId={campaign.id} name={campaign.name} description={campaign.description} />
            </div>
            {campaign.archived_at ? (
              <span className="mt-2 inline-block border border-border px-2 py-0.5 font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">
                Archiviert
              </span>
            ) : null}
          </div>
          <div className="shrink-0">
            <CampaignDangerZone campaignId={campaign.id} campaignName={campaign.name} archived={!!campaign.archived_at} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-text-secondary">
          <span className="flex items-center gap-2">
            Kampagnen-ID zum Einladen:
            <CopyId id={campaign.id} />
          </span>
          <Link href={`/campaigns/${campaign.id}/missions`} className="text-corp-accent hover:underline">
            Missionen →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="border border-border bg-bg-surface p-3.5">
            <p className="font-mono text-[14px] tracking-[0.06em] text-text-secondary uppercase">Teams</p>
            <p className="mt-1 font-display text-lg font-bold text-text-default">{String(crews?.length ?? 0).padStart(2, "0")}</p>
          </div>
          <div className="border border-border bg-bg-surface p-3.5">
            <p className="font-mono text-[14px] tracking-[0.06em] text-text-secondary uppercase">Missionen</p>
            <p className="mt-1 font-display text-lg font-bold text-text-default">{String(missionCount ?? 0).padStart(2, "0")}</p>
          </div>
          <div className="border border-border bg-bg-surface p-3.5">
            <p className="font-mono text-[14px] tracking-[0.06em] text-text-secondary uppercase">Mitspieler</p>
            <p className="mt-1 font-display text-lg font-bold text-text-default">{String(members?.length ?? 0).padStart(2, "0")}</p>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Mitspieler"}</h2>
          <ul className="mt-2 flex flex-wrap gap-2 font-mono text-xs">
            {(members ?? []).map((m) => (
              <li key={m.player_id} className="border border-border bg-bg-surface px-3 py-1 text-text-default">
                {m.players?.display_name ?? "?"}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="font-mono text-[14px] tracking-[0.08em] text-text-secondary uppercase">{"// Teilnehmende Teams"}</h2>
          <div className="mt-2 flex flex-col gap-3">
            {(crews ?? []).map((crew) => {
              const slug = crew.corps ? corpThemeSlug(crew.corps.key) : undefined;
              const unitCount = (crew.soldiers as unknown as { count: number }[])?.[0]?.count ?? 0;
              return (
                <CrewCard
                  key={crew.id}
                  href={`/crews/${crew.id}`}
                  corpSlug={slug}
                  corpName={crew.corps?.name}
                  teamName={crew.name}
                  metaLine={
                    <>
                      {crew.captains?.name ?? "—"}
                      {crew.captains ? ` · LV ${crew.captains.level}` : ""} · {crew.first_mates?.name ?? "—"}
                    </>
                  }
                  fte={unitCount}
                  xp={crew.experience}
                  cr={crew.credits}
                />
              );
            })}

            {!myCrew ? (
              <Link
                href={`/campaigns/${campaign.id}/new-crew`}
                className="flex flex-col items-center justify-center border border-dashed border-border p-4 text-center font-display text-sm font-semibold tracking-[0.06em] text-text-secondary uppercase hover:border-accent hover:text-text-default"
              >
                ＋ Eigenes Team erstellen
              </Link>
            ) : null}

            {!myCrew && importableCrews && importableCrews.length > 0 ? (
              <ImportCrewCard campaignId={campaign.id} crews={importableCrews} />
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
