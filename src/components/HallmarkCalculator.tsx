"use client";

import { useState } from "react";

const HALLMARKS = [
  { karat: 24, label: "24K (999 Fine)", badge: "999", purity: 1 },
  { karat: 22, label: "22K (916 Hallmark)", badge: "916", purity: 22 / 24 },
  { karat: 18, label: "18K (750 Hallmark)", badge: "750", purity: 18 / 24 },
  { karat: 14, label: "14K (585 Hallmark)", badge: "585", purity: 14 / 24 },
  { karat: 9, label: "9K (375 Hallmark)", badge: "375", purity: 9 / 24 },
];

function fmt(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function HallmarkCalculator({ rate24k }: { rate24k: number }) {
  const [weight, setWeight] = useState(8);

  return (
    <div className="space-y-6">
      {/* Weight input */}
      <div className="rounded-2xl border border-amber-200/50 bg-amber-50/40 p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300" htmlFor="weight">
          Gold Weight (grams)
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            id="weight"
            type="number"
            min={0.1}
            max={1000}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
            className="w-32 rounded-xl border border-amber-300 bg-white px-3 py-2 text-lg font-bold text-zinc-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <span className="text-sm text-zinc-500">grams</span>
          <span className="text-xs text-zinc-400">({(weight / 8).toFixed(2)} pavan)</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[1, 2, 4, 8, 10, 16].map((g) => (
            <button
              key={g}
              onClick={() => setWeight(g)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                weight === g
                  ? "bg-amber-500 text-white"
                  : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-amber-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
              }`}
            >
              {g}g{g === 8 ? " (1 pavan)" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Hallmark table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Purity</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Rate/g</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Value for {weight}g
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {HALLMARKS.map((h) => {
              const ratePerGram = rate24k * h.purity;
              const totalValue = ratePerGram * weight;
              const is22k = h.karat === 22;
              return (
                <tr key={h.karat} className={`transition-colors hover:bg-amber-50/30 dark:hover:bg-zinc-800/50 ${is22k ? "bg-amber-50/50 dark:bg-amber-950/20" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                        is22k
                          ? "bg-amber-100 text-amber-800 ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-500/40"
                          : "bg-zinc-100 text-zinc-600 ring-zinc-200/60 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
                      }`}>
                        {h.badge}
                      </span>
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{h.label}</span>
                      {is22k && <span className="text-[9px] font-bold uppercase text-amber-600 dark:text-amber-400">★ Most common</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {fmt(ratePerGram)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-amber-700 dark:text-amber-400">
                    {fmt(totalValue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        * Gold value only — does not include making charges or GST. Based on today&apos;s Kerala board rate.
      </p>
    </div>
  );
}
