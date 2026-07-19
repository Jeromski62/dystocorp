import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { corpThemeSlug } from "@/lib/corp-theme";

export default async function CrewsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: crews } = await supabase
    .from("crews")
    .select("id, name, credits, experience, corps(key, name), campaigns(id, name)")
    .eq("player_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text-default">Meine Crews</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Alle deine Crews, campaign-übergreifend — auch Crews ohne Kampagne zum Ausprobieren.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {(crews ?? []).map((crew) => (
          <Link
            key={crew.id}
            href={`/crews/${crew.id}`}
            data-corp={crew.corps ? corpThemeSlug(crew.corps.key) : undefined}
            className="rounded-md border border-corp-border bg-bg-surface p-4 hover:border-corp-accent"
          >
            <p className="font-mono text-xs uppercase tracking-wide text-corp-accent">{crew.corps?.name}</p>
            <p className="mt-1 font-medium text-text-default">{crew.name}</p>
            <p className="mt-1 text-xs text-text-secondary">{crew.campaigns?.name ?? "Ohne Kampagne"}</p>
            <p className="mt-2 font-mono text-xs text-text-secondary">
              {crew.credits}cr · {crew.experience} XP
            </p>
          </Link>
        ))}

        <Link
          href="/crews/new"
          className="flex flex-col items-center justify-center rounded-md border border-dashed border-border p-4 text-center text-sm text-text-secondary hover:border-accent hover:text-text-default"
        >
          + Neue Crew erstellen
        </Link>
      </div>
    </div>
  );
}
