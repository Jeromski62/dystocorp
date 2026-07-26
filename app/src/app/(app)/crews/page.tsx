import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CrewGrid } from "./crew-grid";
import { PageHeader } from "@/components/page-header";

export default async function CrewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: crews } = await supabase
    .from("crews")
    .select("id, name, credits, experience, corps(key, name), campaigns(id, name), soldiers(count)")
    .eq("player_id", user!.id)
    .order("created_at", { ascending: false });

  const crewList = (crews ?? []).map((c) => ({
    ...c,
    unitCount: (c.soldiers as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <PageHeader
          title="Meine Teams"
          meta={`${String(crewList.length).padStart(2, "0")} GELISTET`}
          description="Alle deine Teams, campaign-übergreifend — auch Teams ohne Kampagne zum Ausprobieren."
          cta={
            <Link href="/crews/new">
              <Button variant="cta">＋ Team Einstellen</Button>
            </Link>
          }
        />

        <div className="mt-8">
          <CrewGrid crews={crewList} />
        </div>
      </div>
    </div>
  );
}
