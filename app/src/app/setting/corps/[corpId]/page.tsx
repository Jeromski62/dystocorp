import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CorpEmblem } from "@/components/corp-emblem";
import { corpThemeSlug } from "@/lib/corp-theme";

export default async function CorpDetailPage({
  params,
}: {
  params: Promise<{ corpId: string }>;
}) {
  const { corpId } = await params;
  const supabase = await createClient();

  const { data: corp } = await supabase
    .from("corps")
    .select("id, key, name, sector, lore_markdown")
    .eq("id", corpId)
    .maybeSingle();

  if (!corp) notFound();

  return (
    <div data-corp={corpThemeSlug(corp.key)} className="bg-corp-bg min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/setting/corps" className="text-xs text-text-secondary hover:text-corp-accent">
          ← Corps
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <CorpEmblem name={corp.name} size={56} />
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-corp-accent">{corp.sector}</p>
            <h1 className="font-display text-2xl tracking-[2.5px] text-text-default">{corp.name}</h1>
          </div>
        </div>

        <p className="mt-6 whitespace-pre-line text-sm text-text-secondary">{corp.lore_markdown}</p>

        <Link
          href={`/setting/corps/${corp.id}/employees`}
          className="mt-8 inline-block text-sm text-corp-accent hover:underline"
        >
          Employee Details →
        </Link>
      </div>
    </div>
  );
}
