import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

// Uses the corp-* tokens unconditionally: they fall back to the neutral accent
// outside a [data-corp] scope (see globals.css), so this one component reads
// correctly both in app chrome and inside a crew context.
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold transition-opacity disabled:opacity-40";
  const variants = {
    primary: "h-12 bg-corp-accent text-corp-on-accent hover:opacity-90",
    ghost: "h-12 border border-corp-border text-text-default hover:border-corp-accent",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
