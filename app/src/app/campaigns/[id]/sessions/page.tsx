import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewSessionForm } from "./new-session-form";
import { CrewResultForm } from "./crew-result-form";

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: campaignId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name")
    .eq("id", campaignId)
    .maybeSingle();
  if (!campaign) notFound();

  const [{ data: crews }, { data: sessions }] = await Promise.all([
    supabase.from("crews").select("id, name, player_id").eq("campaign_id", campaignId),
    supabase
      .from("session_log_entries")
      .select("id, title, session_date, notes")
      .eq("campaign_id", campaignId)
      .order("session_date", { ascending: false }),
  ]);

  const sessionIds = (sessions ?? []).map((s) => s.id);
  const { data: allResults } =
    sessionIds.length > 0
      ? await supabase
          .from("crew_session_results")
          .select("id, session_log_entry_id, crew_id, xp_delta, credits_delta, loot_notes, injury_notes, members_lost")
          .in("session_log_entry_id", sessionIds)
      : { data: [] };

  const crewById = new Map((crews ?? []).map((c) => [c.id, c]));
  const myCrew = (crews ?? []).find((c) => c.player_id === user!.id) ?? null;

  const resultsBySession = new Map<string, typeof allResults>();
  for (const r of allResults ?? []) {
    const list = resultsBySession.get(r.session_log_entry_id) ?? [];
    list.push(r);
    resultsBySession.set(r.session_log_entry_id, list);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href={`/campaigns/${campaignId}`} className="text-xs text-text-secondary hover:text-accent">
        ← {campaign.name}
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-text-default">Session-Log</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Ein Eintrag pro Spielabend. Jeder Spieler trägt sein eigenes Ergebnis (XP, Credits, Loot, Verletzungen) ein.
      </p>

      <div className="mt-6">
        <NewSessionForm campaignId={campaignId} />
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {(sessions ?? []).map((session) => {
          const sessionResults = resultsBySession.get(session.id) ?? [];
          const myResult = myCrew ? sessionResults.find((r) => r.crew_id === myCrew.id) ?? null : null;
          const otherResults = sessionResults.filter((r) => r.crew_id !== myCrew?.id);

          return (
            <article key={session.id} className="rounded-md border border-border bg-bg-surface p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold text-text-default">{session.title}</h2>
                <span className="text-xs text-text-secondary">{session.session_date}</span>
              </div>
              {session.notes ? <p className="mt-2 whitespace-pre-line text-sm text-text-secondary">{session.notes}</p> : null}

              <div className="mt-3 flex flex-col gap-2">
                {myCrew ? (
                  <CrewResultForm
                    campaignId={campaignId}
                    sessionLogEntryId={session.id}
                    crewId={myCrew.id}
                    crewName={myCrew.name}
                    existing={
                      myResult
                        ? {
                            xpDelta: myResult.xp_delta,
                            creditsDelta: myResult.credits_delta,
                            lootNotes: myResult.loot_notes,
                            injuryNotes: myResult.injury_notes,
                            membersLost: myResult.members_lost,
                          }
                        : null
                    }
                  />
                ) : null}

                {otherResults.map((r) => {
                  const crew = crewById.get(r.crew_id);
                  return (
                    <div key={r.id} className="rounded-md border border-border bg-bg-raised p-3 text-sm">
                      <span className="font-medium text-text-default">{crew?.name ?? "?"}</span>
                      <p className="mt-1 text-xs text-text-secondary">
                        {r.xp_delta >= 0 ? "+" : ""}
                        {r.xp_delta} XP · {r.credits_delta >= 0 ? "+" : ""}
                        {r.credits_delta}cr
                      </p>
                      {r.loot_notes ? <p className="mt-1 text-xs text-text-secondary">Loot: {r.loot_notes}</p> : null}
                      {r.injury_notes ? <p className="mt-1 text-xs text-text-secondary">Verletzungen: {r.injury_notes}</p> : null}
                      {r.members_lost ? <p className="mt-1 text-xs text-text-secondary">Verluste: {r.members_lost}</p> : null}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
