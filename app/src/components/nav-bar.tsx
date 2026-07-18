import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";

export async function NavBar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/campaigns" className="flex items-baseline gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-foreground">
            DystoCorp
          </span>
          <span className="text-xs text-muted">Crew &amp; Campaign Manager</span>
        </Link>
        {user ? (
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/campaigns" className="text-muted hover:text-foreground">
              Kampagnen
            </Link>
            <Link href="/powers" className="text-muted hover:text-foreground">
              Powers
            </Link>
            <form action={signOut}>
              <button type="submit" className="text-muted hover:text-danger">
                Logout
              </button>
            </form>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
