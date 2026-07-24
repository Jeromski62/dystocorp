import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCrew } from "./actions";
import { CorpPicker } from "@/components/corp-picker";

export default async function NewCrewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: campaignId } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name")
    .eq("id", campaignId)
    .maybeSingle();

  if (!campaign) notFound();

  const { data: corps } = await supabase
    .from("corps")
    .select("id, key, name, sector, lore_markdown")
    .order("sort_order");

  return (
    <CorpPicker eyebrow={campaign.name} corps={corps ?? []} createAction={createCrew.bind(null, campaignId)} />
  );
}
