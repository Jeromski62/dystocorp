import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "cta";
};

// Uses the corp-* tokens unconditionally: they fall back to the neutral accent
// outside a [data-corp] scope (see globals.css), so this one component reads
// correctly both in app chrome and inside a crew context.
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm px-4 font-display text-sm font-semibold tracking-wide uppercase transition-[background-color,opacity,border-color] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] disabled:opacity-40";
  const variants = {
    primary: "h-11 bg-corp-accent text-corp-on-accent hover:opacity-90",
    ghost: "h-11 border border-corp-border text-text-default hover:border-corp-accent",
    // solid white "magic-link"-style CTA — the app's one non-corp-accent
    // primary action color (login, dashboard's "+ Neue Crew" etc.)
    cta: "h-11 bg-cta-bg text-cta-foreground hover:bg-cta-bg-hover",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
