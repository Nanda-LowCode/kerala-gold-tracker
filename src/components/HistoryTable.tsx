"use client";

import { useState } from "react";
import { GoldRate } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const rangeOptions = [7, 14, 30] as const;
type Range = (typeof rangeOptions)[number];

export default function HistoryTable({ history }: { history: GoldRate[] }) {
  const [karat, setKarat] = useState<"18k" | "22k" | "24k">("22k");
  const [range, setRange] = useState<Range>(7);

  if (history.length === 0) return null;

  const visible = history.slice(0, range);

  return (
    <section className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-lg shadow-amber-100/40">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">
            Last {range} Days
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Historical rate per gram
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Range filter */}
          <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1">
            {rangeOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${
                  range === r
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {r}D
              </button>
            ))}
          </div>
          {/* Karat toggle */}
          <KaratToggle karat={karat} setKarat={setKarat} />
        </div>
      </div>

      <ul className="divide-y divide-zinc-100">
        {visible.map((day, i) => {
          const rateKey = `rate_${karat}_1g` as keyof GoldRate;
          const rate = day[rateKey] as number;
          const prev =
            i < visible.length - 1
              ? (visible[i + 1][rateKey] as number)
              : null;
          const change = prev !== null ? rate - prev : null;
          const isToday = i === 0;

          return (
            <li
              key={day.date}
              className="flex items-center py-3.5 transition-colors"
            >
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className={`flex h-2 w-2 flex-none rounded-full ${
                    isToday ? "bg-amber-500 ring-4 ring-amber-100" : "bg-zinc-200"
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {formatDate(day.date)}
                  </p>
                  {isToday && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      Today
                    </p>
                  )}
                </div>
              </div>

              {/* Dotted spacer connecting left and right */}
              <div className="mx-4 flex-1 border-b-[1.5px] border-dotted border-zinc-200/70" />

              <div className="flex items-center gap-3 shrink-0">
                <p className="text-base font-bold text-zinc-900">
                  {formatCurrency(rate)}
                </p>
                {change !== null && (
                  <div className="w-16 text-right">
                    {change === 0 ? (
                      <span className="text-xs font-medium text-zinc-400">
                        —
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                          change > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {change > 0 ? "\u25B2" : "\u25BC"}
                        {Math.abs(change).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const karatOptions = ["18k", "22k", "24k"] as const;

function KaratToggle({
  karat,
  setKarat,
}: {
  karat: "18k" | "22k" | "24k";
  setKarat: (k: "18k" | "22k" | "24k") => void;
}) {
  const idx = karatOptions.indexOf(karat);
  return (
    <div className="relative inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1 shadow-inner">
      {/* Animated slider */}
      <div
        className="absolute top-1 h-[calc(100%-8px)] w-[calc(33.333%-3px)] rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-md shadow-amber-500/30 transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${idx * 100}%)` }}
      />
      {karatOptions.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => setKarat(k)}
          className={`relative z-10 min-w-[46px] rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
            karat === k ? "text-white" : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          {k.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
