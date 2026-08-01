"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

// Figma "Dysto-Corp-Rough-Concept" Switch (node 2116:383) -- 48x24 pill. Off:
// white/42%-alpha border, white thumb with a black "X" glyph. On: solid
// white border, thumb slides right and turns accent-green with a black
// checkmark glyph.
function Switch({ className, checked, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      checked={checked}
      className={cn(
        "inline-flex h-6 w-12 shrink-0 items-center rounded-full border bg-transparent px-[3px] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-accent/50 disabled:opacity-40",
        checked ? "border-white" : "border-white/42",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "flex size-[18px] items-center justify-center rounded-full transition-transform",
          checked ? "translate-x-6 bg-[#11FF70]" : "translate-x-0 bg-white"
        )}
      >
        {checked ? <Check className="size-3 text-black" strokeWidth={3} /> : <X className="size-3 text-black" strokeWidth={3} />}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
