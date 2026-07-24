import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import { EditDisplayNameForm } from "./edit-display-name-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: player }, { count: crewCount }, { data: memberships }] = await Promise.all([
    supabase.from("players").select("display_name").eq("id", user!.id).maybeSingle(),
    supabase.from("crews").select("id", { count: "exact", head: true }).eq("player_id", user!.id),
    supabase.from("campaign_members").select("campaign_id").eq("player_id", user!.id),
  ]);

  const campaignIds = (memberships ?? []).map((m) => m.campaign_id);
  const { count: missionsDoneCount } =
    campaignIds.length > 0
      ? await supabase
          .from("missions")
          .select("id", { count: "exact", head: true })
          .in("campaign_id", campaignIds)
          .eq("status", "report")
      : { count: 0 };

  return (
    <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Profil</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <div className="border border-border bg-bg-surface p-4">
              <p className="font-display text-lg font-semibold text-text-default">
                {player?.display_name || "Unbenannter Agent"}
              </p>
              <p className="mt-1 font-mono text-xs text-text-secondary">{user!.email}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-border bg-bg-surface p-3">
                <p className="font-mono text-[8.5px] tracking-[0.06em] text-text-secondary uppercase">Crews</p>
                <p className="mt-1 font-display text-lg font-bold text-text-default">{crewCount ?? 0}</p>
              </div>
              <div className="border border-border bg-bg-surface p-3">
                <p className="font-mono text-[8.5px] tracking-[0.06em] text-text-secondary uppercase">Kampagnen</p>
                <p className="mt-1 font-display text-lg font-bold text-text-default">{campaignIds.length}</p>
              </div>
              <div className="border border-border bg-bg-surface p-3">
                <p className="font-mono text-[8.5px] tracking-[0.06em] text-text-secondary uppercase">Missionen</p>
                <p className="mt-1 font-display text-lg font-bold text-status-active">{missionsDoneCount ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col border border-border bg-bg-surface">
            <div className="border-b border-border px-4 py-2.5">
              <span className="font-mono text-[9.5px] tracking-[0.08em] text-text-secondary uppercase">Konto-Optionen</span>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <EditDisplayNameForm name={player?.display_name ?? ""} />
              <form action={signOut} className="mt-auto pt-2">
                <button
                  type="submit"
                  className="w-full border border-accent/40 px-4 py-3 font-display text-sm font-semibold tracking-[0.06em] text-accent uppercase transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:bg-accent/10"
                >
                  Abmelden
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
