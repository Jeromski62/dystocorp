import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Teams always render in the neutral theme -- a crew's corp is lore/flavor
// only and no longer scopes --corp-accent/--corp-bg (see corp-picker's own
// "hat keinen Einfluss auf..." copy, now also true visually).
export default async function CrewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ crewId: string }>;
}) {
  const { crewId } = await params;
  const supabase = await createClient();

  const { data: crew } = await supabase.from("crews").select("id").eq("id", crewId).maybeSingle();

  if (!crew) notFound();

  return <div className="bg-corp-bg min-h-screen">{children}</div>;
}
