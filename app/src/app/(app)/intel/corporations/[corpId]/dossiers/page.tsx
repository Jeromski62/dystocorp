import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { corpThemeSlug } from "@/lib/corp-theme";
import { PageHeader } from "@/components/page-header";

export default async function CorpDossiersPage({
  params,
}: {
  params: Promise<{ corpId: string }>;
}) {
  const { corpId } = await params;
  const supabase = await createClient();

  const { data: corp } = await supabase.from("corps").select("id, key, name").eq("id", corpId).maybeSingle();
  if (!corp) notFound();

  return (
    <div data-corp={corpThemeSlug(corp.key)} className="bg-corp-bg min-h-screen">
      <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href={`/intel/corporations/${corp.id}`} className="text-xs text-text-secondary hover:text-corp-accent">
          ← {corp.name}
        </Link>
        <PageHeader className="mt-2" title="Dossiers" />
        <p className="mt-4 rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
          Kommt noch — hier entstehen die Charakter-Dossiers von {corp.name}.
        </p>
      </div>
      </div>
    </div>
  );
}
