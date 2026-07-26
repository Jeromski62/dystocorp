import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function IntelPage() {
  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PageHeader title="Intel" description="Hintergrund und Lore der DystoCorp-Welt." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/intel/universe" className="rounded-md border border-border bg-bg-surface p-5 hover:border-accent">
          <h2 className="font-display text-lg tracking-[2px] text-text-default">Universe</h2>
          <p className="mt-2 text-sm text-text-secondary">Zeitalter, Orte und Hintergrundgeschichte.</p>
        </Link>
        <Link href="/intel/corporations" className="rounded-md border border-border bg-bg-surface p-5 hover:border-accent">
          <h2 className="font-display text-lg tracking-[2px] text-text-default">Corporations</h2>
          <p className="mt-2 text-sm text-text-secondary">Die Mega Corps und ihre Sektoren.</p>
        </Link>
      </div>
    </div>
    </div>
  );
}
