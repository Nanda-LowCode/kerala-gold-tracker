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

export default function PriceChart({ history }: { history: GoldRate[] }) {
  const [karat, setKarat] = useState<"18k" | "22k" | "24k">("22k");

  if (history.length < 2) {
    return (
      <div className="rounded-xl border border-amber-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm text-center text-sm text-zinc-400 dark:text-zinc-500">
        Chart will appear once there are at least 2 days of data.
      </div>
    );
  }

  const labels = history.map((d) =>
    new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    })
  );

  const rateKey = `rate_${karat}_1g` as keyof GoldRate;
  const values = history.map((d) => d[rateKey] as number);

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
        pointRadius: history.length > 15 ? 2 : 4,
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
      y: {
        ticks: {
          callback: (val: string | number) => `₹${Number(val).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div className="rounded-xl border border-amber-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm dark:shadow-none">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Price Trend</h2>
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
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
