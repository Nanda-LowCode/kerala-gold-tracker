"use client";

import { useState } from "react";

export default function EmbedCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — user can select manually */
    }
  };

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 pr-24 text-[12px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-3 top-3 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-amber-700"
      >
        {copied ? "Copied ✓" : "Copy code"}
      </button>
    </div>
  );
}
