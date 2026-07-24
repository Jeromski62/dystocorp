"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isNavItemActive } from "./nav-items";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col">
      {NAV_ITEMS.map((item) => {
        const active = isNavItemActive(pathname, item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "border-l-2 border-accent bg-accent/[0.08] px-4 py-2.5 font-display text-[16px] font-semibold tracking-[0.06em] text-text-default uppercase"
                : "border-l-2 border-transparent px-4 py-2.5 font-display text-[16px] font-semibold tracking-[0.06em] text-text-secondary uppercase transition-colors duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:text-text-default"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
