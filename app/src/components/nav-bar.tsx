import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";

export async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-border bg-bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/campaigns" className="flex items-baseline gap-2">
          <span className="font-display text-sm tracking-widest text-text-default">
            DystoCorp
          </span>
          <span className="text-xs text-text-secondary">Crew &amp; Campaign Manager</span>
        </Link>
        {user ? (
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/campaigns" className="text-text-secondary hover:text-text-default">
              Kampagnen
            </Link>
            <Link href="/powers" className="text-text-secondary hover:text-text-default">
              Powers
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-text-secondary hover:text-danger">
                Logout
              </button>
            </form>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
