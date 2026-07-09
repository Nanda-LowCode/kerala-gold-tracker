"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { GoldRate } from "@/lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const RANGES = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "All", days: Infinity },
] as const;

export default function PriceChart({ history }: { history: GoldRate[] }) {
  const [karat, setKarat] = useState<"18k" | "22k" | "24k">("22k");
  const [days, setDays] = useState<number>(30);

  // history is chronological (oldest → newest); keep the most recent `days`.
  const view = Number.isFinite(days) ? history.slice(-days) : history;

  if (history.length < 2) {
    return (
      <div className="rounded-xl border border-amber-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm text-center text-sm text-zinc-500 dark:text-zinc-400">
        Chart will appear once there are at least 2 days of data.
      </div>
    );
  }

  // Long ranges (6M/1Y/All) cross year boundaries, so show the year too.
  const longRange = !Number.isFinite(days) || days > 90;
  const labelOpts: Intl.DateTimeFormatOptions = longRange
    ? { day: "numeric", month: "short", year: "2-digit" }
    : { month: "short", day: "numeric" };
  const labels = view.map((d) =>
    new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", labelOpts)
  );

  const rateKey = `rate_${karat}_1g` as keyof GoldRate;
  const values = view.map((d) => d[rateKey] as number);

  const colors: Record<string, { border: string; bg: string }> = {
    "18k": { border: "#ca8a04", bg: "rgba(202,138,4,0.1)" },
    "22k": { border: "#d97706", bg: "rgba(217,119,6,0.1)" },
    "24k": { border: "#b45309", bg: "rgba(180,83,9,0.1)" },
  };

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: colors[karat].border,
        backgroundColor: colors[karat].bg,
        borderWidth: 2,
        pointRadius: view.length > 15 ? (view.length > 60 ? 0 : 2) : 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#a1a1aa",
        titleFont: { size: 12, weight: "normal" as const },
        bodyColor: "#b45309",
        bodyFont: { size: 15, weight: "bold" as const },
        borderColor: "rgba(251, 191, 36, 0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        cornerRadius: 8,
        callbacks: {
          title: (context: TooltipItem<"line">[]) => context[0].label,
          label: (context: TooltipItem<"line">) => `₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}/g`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: longRange ? 8 : 12,
          maxRotation: 60,
          minRotation: 0,
        },
      },
      y: {
        ticks: {
          callback: (val: string | number) => `₹${Number(val).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div className="rounded-xl border border-amber-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm dark:shadow-none">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Price Trend</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Time-range toggle */}
          <div className="flex gap-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 p-1">
            {RANGES.map((r) => (
              <button
                key={r.label}
                onClick={() => setDays(r.days)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  days === r.days
                    ? "bg-zinc-800 dark:bg-zinc-600 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {/* Karat toggle */}
          <div className="flex gap-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 p-1">
            {(["18k", "22k", "24k"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKarat(k)}
                className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                  karat === k
                    ? "bg-amber-600 dark:bg-amber-500 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
