"use client";

import { useState } from "react";

const UNITS = [
  { id: "gram", label: "Gram", toGrams: 1 },
  { id: "pavan", label: "Pavan", toGrams: 8 },
  { id: "sovereign", label: "Sovereign", toGrams: 8 },
  { id: "tola", label: "Tola", toGrams: 11.664 },
] as const;

type UnitId = (typeof UNITS)[number]["id"];

function fmtRupees(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function fmtQty(n: number) {
  if (n === Math.floor(n)) return n.toFixed(0);
  return parseFloat(n.toFixed(3)).toString();
}

export default function PavanCalculator({ rate22k, rate24k }: { rate22k: number; rate24k: number }) {
  const [value, setValue] = useState(1);
  const [fromUnit, setFromUnit] = useState<UnitId>("pavan");

  const selectedUnit = UNITS.find((u) => u.id === fromUnit)!;
  const totalGrams = value * selectedUnit.toGrams;

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-2xl border border-amber-200/50 bg-amber-50/40 p-5 dark:border-zinc-700 dark:bg-zinc-900">
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">Enter quantity</label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={0.001}
            step={0.001}
            value={value}
            onChange={(e) => setValue(Math.max(0.001, parseFloat(e.target.value) || 0.001))}
            className="w-28 rounded-xl border border-amber-300 bg-white px-3 py-2 text-lg font-bold text-zinc-900 shadow-sm outline-none focus:ring-2 focus:ring-amber-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <div className="flex flex-wrap gap-2">
            {UNITS.map((u) => (
              <button
                key={u.id}
                onClick={() => setFromUnit(u.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  fromUnit === u.id
                    ? "bg-amber-500 text-white"
                    : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-amber-50 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion result cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {UNITS.map((u) => {
          const qty = totalGrams / u.toGrams;
          const isPavan = u.id === "pavan";
          return (
            <div
              key={u.id}
              className={`rounded-xl border p-3 text-center ${
                isPavan
                  ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                  : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{u.label}</div>
              <div className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{fmtQty(qty)}</div>
              {isPavan && <div className="text-[10px] text-amber-600 dark:text-amber-400">Kerala standard</div>}
            </div>
          );
        })}
      </div>

      {/* Gold value */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">22K Value</div>
          <div className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">{fmtRupees(totalGrams * rate22k)}</div>
          <div className="text-xs text-zinc-400">{fmtQty(totalGrams)}g × {fmtRupees(rate22k)}/g</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">24K Value</div>
          <div className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-400">{fmtRupees(totalGrams * rate24k)}</div>
          <div className="text-xs text-zinc-400">{fmtQty(totalGrams)}g × {fmtRupees(rate24k)}/g</div>
        </div>
      </div>

      {/* Quick pavan presets */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {[0.5, 1, 2, 4, 8, 10, 16].map((pavans) => (
            <button
              key={pavans}
              onClick={() => { setValue(pavans); setFromUnit("pavan"); }}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 transition-colors hover:border-amber-300 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            >
              {pavans} pavan{pavans !== 0.5 && pavans !== 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        * Raw gold value only — making charges and 3% GST not included. 1 pavan = 1 sovereign = 8 grams. 1 tola = 11.664 grams.
      </p>
    </div>
  );
}
