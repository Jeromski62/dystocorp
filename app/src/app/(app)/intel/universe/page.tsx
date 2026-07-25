import Link from "next/link";

export default function UniversePage() {
  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/intel" className="text-xs text-text-secondary hover:text-accent">
        ← Intel
      </Link>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-[0.2em] text-text-default uppercase">Universe</h1>
      <p className="mt-4 rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
        Kommt noch — hier entsteht die Hintergrundgeschichte der DystoCorp-Welt.
      </p>
    </div>
    </div>
  );
}
