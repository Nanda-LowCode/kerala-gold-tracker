"use client";

import dynamic from "next/dynamic";

/**
 * Defers the silver chart (and Chart.js) out of the critical path, matching
 * the gold chart's lazy pattern. Fixed-height placeholder keeps CLS at 0.
 */
const SilverChart = dynamic(() => import("@/components/SilverChart"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="h-[360px] animate-pulse rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    />
  ),
});

export default function SilverChartLazy({ series }: { series: { date: string; rate: number }[] }) {
  return <SilverChart series={series} />;
}
