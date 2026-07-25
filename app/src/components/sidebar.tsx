import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "./sidebar-nav";
import { MobileNav } from "./mobile-nav";

// Desktop shell per the design handoff: fixed 210px sidebar (logo, nav,
// user chip at the bottom). Mobile gets a slim top bar instead (see MobileNav).
export async function Sidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: player } = await supabase.from("players").select("display_name").eq("id", user.id).maybeSingle();
  const identity = player?.display_name || user.email || "Agent";

  return (
    <>
      <aside className="hidden md:flex md:w-[210px] md:shrink-0 md:flex-col md:border-r md:border-border md:bg-bg-surface">
        <Link href="/" className="border-b border-border px-4 py-5">
          <span className="font-display text-sm font-bold tracking-[0.04em] text-text-default">DYSTO.CORP_</span>
          <span className="mt-0.5 block font-mono text-[14px] tracking-[0.08em] text-text-subtle">CREW &amp; CAMPAIGN MGR</span>
        </Link>

        <div className="flex-1 py-3">
          <SidebarNav />
        </div>

        <Link href="/profile" className="flex items-center gap-2.5 border-t border-border px-4 py-3.5 transition-colors hover:bg-white/[0.03]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-accent/40 bg-accent/10 font-display text-xs font-bold text-accent">
            {identity.trim().charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-mono text-[15px] font-medium text-text-default">{identity}</span>
            <span className="block truncate font-mono text-[14px] text-text-subtle">{user.email}</span>
          </span>
        </Link>
      </aside>

      <MobileNav identity={identity} />
    </>
  );
}
