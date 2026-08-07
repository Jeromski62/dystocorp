import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { createClient } from "@/lib/supabase/server";
import { CorpEmblem } from "@/components/corp-emblem";
import { corpThemeSlug } from "@/lib/corp-theme";

// lore_markdown may contain #-headings, **bold**, and single-newline-separated
// lines the author expects to render as line breaks (not collapsed into one
// paragraph, CommonMark's default) -- remark-breaks turns those into <br>.
// Headings/bold/paragraphs are restyled to match the design system instead
// of react-markdown's unstyled defaults.
const LORE_MARKDOWN_COMPONENTS = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-6 font-display text-lg tracking-[0.1em] text-text-default uppercase first:mt-0">{children}</h2>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-5 font-display text-base tracking-[0.08em] text-text-default uppercase">{children}</h3>
  ),
  p: ({ children }: { children?: ReactNode }) => <p className="mt-4 text-sm text-text-secondary first:mt-0">{children}</p>,
  strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold text-text-default">{children}</strong>,
};

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
    <div data-corp={corpThemeSlug(corp.key)} className="bg-corp-bg min-h-screen">
      <div className="hud-grid min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/intel/corporations" className="text-xs text-text-secondary hover:text-corp-accent">
          ← Corporations
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <CorpEmblem name={corp.name} slug={corpThemeSlug(corp.key)} size={56} />
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-corp-accent">{corp.sector}</p>
            <h1 className="font-display text-2xl tracking-[2.5px] text-text-default">{corp.name}</h1>
          </div>
        </div>

        <div className="mt-6">
          <ReactMarkdown remarkPlugins={[remarkBreaks]} components={LORE_MARKDOWN_COMPONENTS}>
            {corp.lore_markdown}
          </ReactMarkdown>
        </div>

        <Link
          href={`/intel/corporations/${corp.id}/dossiers`}
          className="mt-8 inline-block text-sm text-corp-accent hover:underline"
        >
          Dossiers →
        </Link>
      </div>
      </div>
    </div>
  );
}
