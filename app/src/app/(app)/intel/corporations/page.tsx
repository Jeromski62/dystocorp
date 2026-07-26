import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { corpThemeSlug } from "@/lib/corp-theme";
import { PageHeader } from "@/components/page-header";
import { CorpCard, type CorpCardVariant } from "@/components/corp-card";

export default async function CorporationsPage() {
  const supabase = await createClient();

  const { data: corps } = await supabase
    .from("corps")
    .select("id, key, name, sector, lore_markdown")
    .order("sort_order");

  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/intel" className="text-xs text-text-secondary hover:text-accent">
        ← Intel
      </Link>
      <PageHeader className="mt-2" title="Corporations" description="Die Mega Corps der DystoCorp-Welt." />

      <div className="mt-8 flex flex-col gap-4">
        {(corps ?? []).map((corp) => (
          <Link key={corp.id} href={`/intel/corporations/${corp.id}`}>
            <CorpCard corp={corpThemeSlug(corp.key) as CorpCardVariant} />
          </Link>
        ))}
        <Link href="/intel/corporations/subcontractor">
          <CorpCard corp="subcontractor" />
        </Link>
      </div>
    </div>
    </div>
  );
}
