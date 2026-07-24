import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";

export async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const linkClass =
    "font-display text-[12.5px] font-semibold tracking-[0.06em] uppercase text-text-secondary transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:text-text-default";

  return (
    <header className="border-b border-border bg-bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-display text-base font-bold tracking-[0.04em] text-text-default">
            DYSTO.CORP_
          </span>
          <span className="hidden font-mono text-[9px] tracking-[0.08em] text-text-subtle sm:inline">
            CREW &amp; CAMPAIGN MGR
          </span>
        </Link>
        {user ? (
          <nav className="flex items-center gap-6">
            <Link href="/crews" className={linkClass}>
              Meine Crews
            </Link>
            <Link href="/campaigns" className={linkClass}>
              Kampagnen
            </Link>
            <Link href="/rules" className={linkClass}>
              Regeln
            </Link>
            <Link href="/setting" className={linkClass}>
              Setting
            </Link>
            <Link href="/profile" className={linkClass}>
              Profil
            </Link>
            <form action={signOut}>
              <button type="submit" className={`${linkClass} hover:text-accent`}>
                Logout
              </button>
            </form>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
