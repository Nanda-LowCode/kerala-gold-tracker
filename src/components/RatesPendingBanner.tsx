"use client";

import { useEffect, useState } from "react";

type BannerState = "pending" | "sunday" | null;

export default function RatesPendingBanner({ latestDate }: { latestDate: string }) {
  const [state, setState] = useState<BannerState>(null);

  useEffect(() => {
    const todayIST = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    if (latestDate >= todayIST) return;

    const dayInIST = new Date().toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
    });
    setState(dayInIST === "Sunday" ? "sunday" : "pending");
  }, [latestDate]);

  if (!state) return null;

  if (state === "sunday") {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-zinc-200/60 bg-zinc-50/80 px-4 py-3 shadow-sm dark:border-zinc-700/40 dark:bg-zinc-800/40">
        <svg className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 md:text-sm">
          Market closed today (Sunday) — showing last trading day&apos;s rate.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-blue-200/60 bg-blue-50/80 px-4 py-3 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/40">
      <svg className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      <p className="text-xs font-medium text-blue-700 dark:text-blue-400 md:text-sm">
        Showing yesterday&apos;s rates. Today&apos;s rates will be updated by 10:30 AM IST.
      </p>
    </div>
  );
}
