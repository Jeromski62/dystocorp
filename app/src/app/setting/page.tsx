import Link from "next/link";

export default function SettingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text-default">Setting</h1>
      <p className="mt-1 text-sm text-text-secondary">Hintergrund und Lore der DystoCorp-Welt.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/setting/details" className="rounded-md border border-border bg-bg-surface p-5 hover:border-accent">
          <h2 className="font-display text-lg tracking-[2px] text-text-default">Setting Details</h2>
          <p className="mt-2 text-sm text-text-secondary">Zeitalter, Orte und Hintergrundgeschichte.</p>
        </Link>
        <Link href="/setting/corps" className="rounded-md border border-border bg-bg-surface p-5 hover:border-accent">
          <h2 className="font-display text-lg tracking-[2px] text-text-default">Corps</h2>
          <p className="mt-2 text-sm text-text-secondary">Die Mega Corps und ihre Sektoren.</p>
        </Link>
      </div>
    </div>
  );
}
