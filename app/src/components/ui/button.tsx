import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// The single button component for the whole app -- DystoCorp's terminal
// styling (Rajdhani/font-display, uppercase, sharp corners) applies to every
// variant, not just the corp-branded ones. `primary`/`ghost` read the
// --corp-* CSS vars (see globals.css), so they render correctly both inside
// a [data-corp] scope and as the neutral fallback outside one; `cta` is the
// one deliberately corp-independent solid white/black action color (login,
// "+ Neue Crew" etc.); `outline`/`destructive` are for generic/neutral or
// dangerous actions that shouldn't carry a corp accent at all.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding font-display text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-[background-color,opacity,border-color,color] duration-150 ease-[cubic-bezier(0.2,0.8,0.2,1)] outline-none select-none focus-visible:border-corp-accent focus-visible:ring-3 focus-visible:ring-corp-accent/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-corp-accent text-corp-on-accent hover:opacity-90",
        ghost: "border-corp-border bg-transparent text-text-default hover:border-corp-accent",
        cta: "bg-cta-bg text-cta-foreground hover:bg-cta-bg-hover",
        outline: "border-border bg-transparent text-text-default hover:border-accent",
        destructive: "border-danger/40 bg-transparent text-danger hover:bg-danger/10",
      },
      size: {
        default: "h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-11",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
