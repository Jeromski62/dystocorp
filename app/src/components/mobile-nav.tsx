"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";

// The design handoff's mobile screens are shown as standalone full-bleed
// captures with no persistent nav chrome (only per-screen back arrows). Since
// this is a real multi-section web app rather than a native single-flow demo,
// mobile still needs a way to reach Kampagnen/Regeln/Setting — a slim top bar
// with a menu toggle is the minimal addition that doesn't invent new IA.
export function MobileNav({ identity }: { identity: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-bg-surface md:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-display text-sm font-bold tracking-[0.04em] text-text-default" onClick={() => setOpen(false)}>
          DYSTO.CORP_
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="font-mono text-[15px] tracking-[0.08em] text-text-secondary uppercase hover:text-text-default"
        >
          {open ? "Schließen ✕" : "Menü ≡"}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  active
                    ? "block border-l-2 border-accent bg-accent/[0.08] px-4 py-3 font-display text-[16px] font-semibold tracking-[0.06em] text-text-default uppercase"
                    : "block border-l-2 border-transparent px-4 py-3 font-display text-[16px] font-semibold tracking-[0.06em] text-text-secondary uppercase hover:text-text-default"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block border-t border-border px-4 py-3 font-mono text-[15px] tracking-[0.06em] text-text-secondary uppercase hover:text-text-default"
          >
            {identity} · Profil
          </Link>
        </div>
      ) : null}
    </div>
  );
}
