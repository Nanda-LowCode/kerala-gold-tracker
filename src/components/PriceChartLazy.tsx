"use client";

import dynamic from "next/dynamic";
import type { GoldRate } from "@/lib/types";

/**
 * Defers PriceChart (and the whole Chart.js bundle) out of the critical
 * rendering path — the chart is below the fold, so it shouldn't compete with
 * the rate cards for first paint. Fixed-height placeholder keeps CLS at 0.
 */
const PriceChart = dynamic(() => import("@/components/PriceChart"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="h-[360px] animate-pulse rounded-xl border border-amber-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
    />
  ),
});

export default function PriceChartLazy({ history }: { history: GoldRate[] }) {
  return <PriceChart history={history} />;
}
