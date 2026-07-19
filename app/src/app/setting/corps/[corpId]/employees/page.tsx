import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { corpThemeSlug } from "@/lib/corp-theme";

export default async function CorpEmployeesPage({
  params,
}: {
  params: Promise<{ corpId: string }>;
}) {
  const { corpId } = await params;
  const supabase = await createClient();

  const { data: corp } = await supabase.from("corps").select("id, key, name").eq("id", corpId).maybeSingle();
  if (!corp) notFound();

  return (
    <div data-corp={corpThemeSlug(corp.key)} className="bg-corp-bg min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href={`/setting/corps/${corp.id}`} className="text-xs text-text-secondary hover:text-corp-accent">
          ← {corp.name}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-text-default">Employee Details</h1>
        <p className="mt-4 rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
          Kommt noch — hier entstehen NPC-Profile von {corp.name}.
        </p>
      </div>
    </div>
  );
}
