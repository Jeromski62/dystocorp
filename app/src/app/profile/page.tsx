import { createClient } from "@/lib/supabase/server";
import { EditDisplayNameForm } from "./edit-display-name-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: player } = await supabase.from("players").select("display_name").eq("id", user!.id).maybeSingle();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text-default">Profil</h1>
      <p className="mt-1 text-sm text-text-secondary">{user!.email}</p>

      <div className="mt-8">
        <EditDisplayNameForm name={player?.display_name ?? ""} />
      </div>
    </div>
  );
}
