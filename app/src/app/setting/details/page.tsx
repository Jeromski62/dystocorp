import Link from "next/link";

export default function SettingDetailsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/setting" className="text-xs text-text-secondary hover:text-accent">
        ← Setting
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-text-default">Setting Details</h1>
      <p className="mt-4 rounded-md border border-dashed border-border px-4 py-6 text-sm text-text-secondary">
        Kommt noch — hier entsteht die Hintergrundgeschichte der DystoCorp-Welt.
      </p>
    </div>
  );
}
