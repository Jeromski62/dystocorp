"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

// Same Base UI Dialog primitive as ui/dialog.tsx, anchored to an edge
// instead of centered -- a bottom sheet on mobile (base classes), a
// right-anchored panel on desktop (md: overrides). Real modal at every
// size (backdrop + focus-trap always apply), used as the picker drawer in
// OfficerBuilder.
function Sheet({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />
}

function SheetPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn("sheet-overlay fixed inset-0 z-50 bg-black/70", className)}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          // Positioning/layout only -- the actual slide transition is
          // "sheet-panel" in globals.css. That's plain CSS rather than
          // Tailwind data-*: utilities because it needs Base UI's
          // data-starting-style/data-ending-style attributes to reliably
          // beat data-open during the single frame both are present, which
          // depends on source order (guaranteed in authored CSS, not
          // guaranteed by how Tailwind orders independently-stacked utility
          // classes).
          "sheet-panel fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col gap-3 rounded-t-lg border-t border-border bg-bg-surface p-4 pt-12 text-sm text-text-default outline-none md:inset-x-auto md:inset-y-0 md:right-0 md:bottom-auto md:left-auto md:h-full md:max-h-none md:w-full md:max-w-lg md:rounded-t-none md:rounded-l-lg md:border-t-0 md:border-l",
          className
        )}
        {...props}
      >
        <div aria-hidden className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border md:hidden" />
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="sheet-close"
            render={<Button variant="outline" className="absolute top-3 right-3" size="icon-sm" />}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </SheetPortal>
  )
}

export { Sheet, SheetContent, SheetPortal, SheetOverlay }
