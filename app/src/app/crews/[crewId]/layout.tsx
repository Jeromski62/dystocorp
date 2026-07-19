import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { corpThemeSlug } from "@/lib/corp-theme";

export default async function CrewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ crewId: string }>;
}) {
  const { crewId } = await params;
  const supabase = await createClient();

  const { data: crew } = await supabase
    .from("crews")
    .select("id, corps(key)")
    .eq("id", crewId)
    .maybeSingle();

  if (!crew) notFound();

  return (
    <div data-corp={corpThemeSlug(crew.corps?.key ?? "")} className="bg-corp-bg min-h-[calc(100vh-4rem)]">
      {children}
    </div>
  );
}
