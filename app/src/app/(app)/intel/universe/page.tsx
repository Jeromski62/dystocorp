import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function UniversePage() {
  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/intel" className="text-xs text-text-secondary hover:text-accent">
        ← Intel
      </Link>
      <PageHeader className="mt-2" title="Universe" />
      <p className="mt-4 rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
        Kommt noch — hier entsteht die Hintergrundgeschichte der DystoCorp-Welt.
      </p>
    </div>
    </div>
  );
}
