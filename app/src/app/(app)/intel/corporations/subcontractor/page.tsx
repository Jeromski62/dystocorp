import Link from "next/link";
import { PageHeader } from "@/components/page-header";

// Static sibling of the [corpId] dynamic route -- "subcontractor" isn't a
// row in the corps table (it's the neutral/freelance CorpCard variant, same
// concept as CrewCard's "Special Purpose Vehicle" fallback), so it gets its
// own fixed page instead of a corp id.
export default function SubcontractorPage() {
  return (
    <div className="hud-grid min-h-screen">
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/intel/corporations" className="text-xs text-text-secondary hover:text-accent">
        ← Corporations
      </Link>
      <PageHeader
        className="mt-2"
        title="Unregistered Subcontractor"
        description="Kein registrierter Mega Corp — Teams, die auf eigene Faust operieren."
      />

      <p className="mt-6 text-sm text-text-secondary">
        Akte: <span className="font-mono text-text-subtle">[corrupted data]</span>. Keine bekannte Zugehörigkeit,
        keine Haftung durch die Mega Corps — Subcontractors handeln auf eigenes Risiko und eigene Rechnung.
      </p>

      <p className="mt-4 rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
        Kommt noch — hier entsteht mehr Hintergrund zu unabhängigen Teams.
      </p>
    </div>
    </div>
  );
}
