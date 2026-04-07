"use client";

import { useState } from "react";
import { GoldRate } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const weights = [
  { label: "1 Gram", grams: 1 },
  { label: "8 Grams", sub: "1 Pavan", grams: 8 },
  { label: "10 Grams", grams: 10 },
  { label: "100 Grams", grams: 100 },
];

const karatOptions = ["18k", "22k", "24k"] as const;
type Karat = (typeof karatOptions)[number];

export default function TodayVsYesterday({
  today,
  yesterday,
}: {
  today: GoldRate;
  yesterday: GoldRate | null;
}) {
  const [karat, setKarat] = useState<Karat>("22k");

  const rateKey = `rate_${karat}_1g` as keyof GoldRate;

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-lg shadow-amber-100/40">
      <div className="border-b border-zinc-100 bg-gradient-to-br from-white to-amber-50/30 px-6 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900">
              Today vs. Yesterday
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Price comparison across common weights
            </p>
          </div>
          <KaratToggle karat={karat} setKarat={setKarat} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Weight
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Today
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Yesterday
              </th>
              <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {weights.map((w) => {
              const todayPrice = (today[rateKey] as number) * w.grams;
              const yesterdayPrice = yesterday
                ? (yesterday[rateKey] as number) * w.grams
                : null;
              const change =
                yesterdayPrice !== null ? todayPrice - yesterdayPrice : null;

              return (
                <tr
                  key={w.grams}
                  className="border-b border-zinc-50 transition-colors hover:bg-amber-50/30 last:border-0"
                >
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-zinc-900">{w.label}</p>
                    {w.sub && (
                      <p className="text-[11px] text-zinc-400">{w.sub}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="font-bold text-zinc-900">
                      {formatCurrency(todayPrice)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-zinc-500">
                    {yesterdayPrice !== null ? formatCurrency(yesterdayPrice) : "\u2014"}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {change !== null ? (
                      <ChangeCell change={change} />
                    ) : (
                      <span className="text-zinc-300">{"\u2014"}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function KaratToggle({
  karat,
  setKarat,
}: {
  karat: Karat;
  setKarat: (k: Karat) => void;
}) {
  const idx = karatOptions.indexOf(karat);
  return (
    <div className="relative inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1 shadow-inner">
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

function ChangeCell({ change }: { change: number }) {
  if (change === 0) {
    return <span className="text-xs font-semibold text-zinc-400">{"\u2014"}</span>;
  }
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-bold ${
        up ? "text-red-600" : "text-green-600"
      }`}
    >
      {up ? "\u25B2" : "\u25BC"} {up ? "+" : ""}
      {formatCurrency(change)}
    </span>
  );
}
