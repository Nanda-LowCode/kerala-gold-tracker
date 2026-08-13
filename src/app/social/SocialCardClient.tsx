"use client";

import { useState } from "react";

export default function SocialCardClient({
  caption,
  dateLabel,
}: {
  caption: string;
  dateLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  const cardUrl = "/api/og/gold-rate-card";

  function copyCaption() {
    navigator.clipboard.writeText(caption).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      {/* Card preview */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200/70 shadow-lg dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cardUrl}
          alt={`Gold rate card for ${dateLabel}`}
          className="w-full"
        />
      </div>

      {/* Download button */}
      <div className="flex flex-wrap gap-3">
        <a
          href={cardUrl}
          download={`gold-rate-kerala-${dateLabel.replace(/\s+/g, "-").toLowerCase()}.png`}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
          </svg>
          Download Image
        </a>
        <button
          onClick={copyCaption}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? "Copied!" : "Copy Caption"}
        </button>
      </div>

      {/* Caption preview */}
      <div className="rounded-xl border border-zinc-200/70 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Suggested Caption
        </div>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {caption}
        </pre>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Posting Tips
        </div>
        <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Post the image first, then add the link as the <strong>first comment</strong> (better reach than link posts).</li>
          <li>Best time: <strong>10:30 AM IST</strong>, right after rates update.</li>
          <li>Share in Kerala gold groups for maximum visibility.</li>
          <li>On mobile: long-press the image above to save it.</li>
        </ul>
      </div>
    </div>
  );
}
