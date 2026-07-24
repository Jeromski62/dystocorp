import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/button";
import Link from "next/link";
import { CrewGrid } from "./crew-grid";

export default async function CrewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: crews } = await supabase
    .from("crews")
    .select(
      "id, name, credits, corps(key, name), campaigns(id, name), captains(level, current_health, health), soldiers(count)"
    )
    .eq("player_id", user!.id)
    .order("created_at", { ascending: false });

  const crewList = (crews ?? []).map((c) => ({
    ...c,
    unitCount: (c.soldiers as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Meine Crews</h1>
            <span className="font-mono text-[14px] text-text-subtle">{String(crewList.length).padStart(2, "0")} GELISTET</span>
          </div>
          <Link href="/crews/new">
            <Button variant="cta">＋ Neue Crew</Button>
          </Link>
        </div>
        <p className="mt-1 font-mono text-xs text-text-secondary">
          Alle deine Crews, campaign-übergreifend — auch Crews ohne Kampagne zum Ausprobieren.
        </p>

        <div className="mt-8">
          <CrewGrid crews={crewList} />
        </div>
      </div>
    </div>
  );
}
