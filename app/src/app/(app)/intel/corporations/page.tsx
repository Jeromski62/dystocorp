import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CorpEmblem } from "@/components/corp-emblem";
import { corpThemeSlug } from "@/lib/corp-theme";
import { PageHeader } from "@/components/page-header";

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
          <Link
            key={corp.id}
            href={`/intel/corporations/${corp.id}`}
            data-corp={corpThemeSlug(corp.key)}
            className="flex items-start gap-3 rounded-md border border-corp-border bg-bg-surface p-4 hover:border-corp-accent"
          >
            <CorpEmblem name={corp.name} slug={corpThemeSlug(corp.key)} />
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-corp-accent">{corp.sector}</p>
              <h2 className="font-display text-lg tracking-[2px] text-text-default">{corp.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{corp.lore_markdown}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
}
