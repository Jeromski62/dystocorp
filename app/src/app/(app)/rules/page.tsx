import Link from "next/link";

export default function RulesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text-default">Regeln</h1>
      <p className="mt-1 text-sm text-text-secondary">Nachschlagewerke für Powers und Ausrüstung.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/powers" className="rounded-md border border-border bg-bg-surface p-5 hover:border-accent">
          <h2 className="font-display text-lg tracking-[2px] text-text-default">Power Cards</h2>
          <p className="mt-2 text-sm text-text-secondary">Alle Powers aus dem Regelwerk, durchsuchbar.</p>
        </Link>
        <Link href="/rules/weapons" className="rounded-md border border-border bg-bg-surface p-5 hover:border-accent">
          <h2 className="font-display text-lg tracking-[2px] text-text-default">Weapon Profiles &amp; Rules</h2>
          <p className="mt-2 text-sm text-text-secondary">Waffen, Advanced Weapons und Rüstung im Überblick.</p>
        </Link>
      </div>
    </div>
  );
}
