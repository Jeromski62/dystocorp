type NavItem = { href: string; label: string; exact?: boolean };

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Übersicht", exact: true },
  { href: "/crews", label: "Meine Crews" },
  { href: "/campaigns", label: "Kampagnen" },
  { href: "/rules", label: "Regeln" },
  { href: "/intel", label: "Intel" },
];

export function isNavItemActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}
