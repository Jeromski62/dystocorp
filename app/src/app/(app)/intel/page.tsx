import Link from "next/link";

export default function IntelPage() {
  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Intel</h1>
      <p className="mt-1 text-sm text-text-secondary">Hintergrund und Lore der DystoCorp-Welt.</p>

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
