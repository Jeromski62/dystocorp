"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

// Figma "Dysto-Corp-Rough-Concept" Switch (node 2116:382) -- 48x24 pill,
// white/42%-alpha border, white thumb that slides to accent fill when on.
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "inline-flex h-6 w-12 shrink-0 items-center rounded-full border border-white/42 bg-transparent px-[3px] transition-colors outline-none focus-visible:ring-3 focus-visible:ring-accent/50 data-checked:border-accent data-checked:bg-accent disabled:opacity-40",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="block size-[18px] rounded-full bg-white transition-transform data-checked:translate-x-6"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
