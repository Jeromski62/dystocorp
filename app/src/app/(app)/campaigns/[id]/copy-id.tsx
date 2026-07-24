"use client";

import { useState } from "react";

export function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded border border-border bg-bg-surface px-2 py-1 font-mono text-text-default hover:border-accent"
    >
      {copied ? "kopiert!" : id}
    </button>
  );
}
