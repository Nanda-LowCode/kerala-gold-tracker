"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";

interface GoldCalculatorProps {
  rate18k: number;
  rate22k: number;
  rate24k: number;
}

export default function GoldCalculator({
  rate18k,
  rate22k,
  rate24k,
}: GoldCalculatorProps) {
  const [karat, setKarat] = useState<"18k" | "22k" | "24k">("18k");
  const [weightGrams, setWeightGrams] = useState<number | "">(8); // Defaults to 1 pavan (8g)
  const [makingChargePercent, setMakingChargePercent] = useState<number | "">(10);

  const rates = {
    "18k": rate18k,
    "22k": rate22k,
    "24k": rate24k,
  };

  const currentRate = rates[karat];
  const parsedWeight = typeof weightGrams === "number" ? weightGrams : 0;
  const parsedMaking = typeof makingChargePercent === "number" ? makingChargePercent : 0;

  const pavans = parsedWeight / 8;
  const basePrice = parsedWeight * currentRate;
  const makingCharges = basePrice * (parsedMaking / 100);
  const gst = (basePrice + makingCharges) * 0.03;
  const totalPrice = basePrice + makingCharges + gst;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-amber-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-lg shadow-amber-100/40 dark:shadow-none md:p-8" aria-labelledby="calculator-heading">
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-amber-100/60 to-transparent dark:from-amber-900/10 blur-3xl" />
      
      <div className="relative">
        <div className="mb-6">
          <h2 id="calculator-heading" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Jewelry Estimator & Calculator
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Automatically convert to Pavans and estimate jewelry cost including making charges and 3% GST.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs Section */}
          <div className="space-y-6">
            {/* Karat Selection */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Gold Purity
              </label>
              <div className="flex gap-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/70 p-1">
                {(["18k", "22k", "24k"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKarat(k)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-all ${
                      karat === k
                        ? "bg-amber-500 text-white shadow-sm ring-1 ring-amber-600/50 dark:bg-amber-600 dark:ring-amber-500/50"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {k.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Input */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400" htmlFor="weight-input">
                  Weight (Grams)
                </label>
                <div className="rounded-full bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-200/60 dark:ring-amber-900/50">
                  {parsedWeight > 0 ? `~ ${pavans.toFixed(2)} Pavan${pavans !== 1 ? 's' : ''}` : '0 Pavans'}
                </div>
              </div>
              <div className="relative">
                <input
                  id="weight-input"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-4 py-2.5 pr-12 text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20"
                  placeholder="e.g. 8"
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-zinc-400 pointer-events-none">
                  g
                </span>
              </div>
            </div>

            {/* Making Charges Slider & Input */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400" htmlFor="making-slider">
                  Making Charges (%)
                </label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  id="making-slider"
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={parsedMaking}
                  onChange={(e) => setMakingChargePercent(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 dark:bg-zinc-800 accent-amber-500 hover:accent-amber-600"
                />
                <div className="relative w-20 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={makingChargePercent}
                    onChange={(e) => setMakingChargePercent(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-3 py-1.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20"
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-xs font-bold text-zinc-400 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col rounded-xl bg-zinc-50 dark:bg-zinc-950/50 p-5 ring-1 ring-inset ring-zinc-200/80 dark:ring-zinc-800/80">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Estimated Breakdown
            </h3>
            
            
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Gold Value ({karat.toUpperCase()})</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(basePrice)}</span>
            </div>
            
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Making Charges ({parsedMaking}%)</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(makingCharges)}</span>
            </div>
            
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">GST (3%)</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{formatCurrency(gst)}</span>
            </div>

            <div className="mt-auto border-t border-zinc-200/80 dark:border-zinc-800/80 pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500">
                    Total Estimate
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">Incl. taxes & making</p>
                </div>
                <p className="bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
