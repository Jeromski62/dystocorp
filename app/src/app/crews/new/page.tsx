import { createClient } from "@/lib/supabase/server";
import { createCrew } from "@/app/campaigns/[id]/new-crew/actions";
import { CorpPicker } from "@/components/corp-picker";

export default async function NewStandaloneCrewPage() {
  const supabase = await createClient();

  const { data: corps } = await supabase
    .from("corps")
    .select("id, key, name, sector, lore_markdown")
    .order("sort_order");

  return <CorpPicker corps={corps ?? []} createAction={createCrew.bind(null, null)} />;
}
