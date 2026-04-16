"use client";

import { useState, useRef } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { formatCurrency } from "@/lib/format";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

interface OldGoldCalculatorProps {
  rate18k: number;
  rate22k: number;
}

export default function OldGoldCalculator({
  rate18k,
  rate22k,
}: OldGoldCalculatorProps) {
  const [karat, setKarat] = useState<"18k" | "22k">("22k");
  const [weightGrams, setWeightGrams] = useState<number | "">(8);
  const [deductionPercent, setDeductionPercent] = useState<number | "">(3);
  const gaFired = useRef(false);

  const { weightUnit, formatGlobalPrice, weightMultiplier } = useGlobalSettings();

  const rates = {
    "18k": rate18k,
    "22k": rate22k,
  };

  const currentRate = rates[karat];
  const parsedWeight = typeof weightGrams === "number" ? weightGrams : 0;
  const parsedDeduction = typeof deductionPercent === "number" ? deductionPercent : 0;

  const actualWeightInGrams = parsedWeight * weightMultiplier;
  const grossValue = actualWeightInGrams * currentRate;
  const deductionAmount = grossValue * (parsedDeduction / 100);
  const netValue = grossValue - deductionAmount;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-lg shadow-amber-100/40 dark:shadow-none md:p-8">
      <div className="relative">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Old Gold Exchange Value
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Estimate the cash or exchange value of your old gold after melting loss and wastage deductions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs Section */}
          <div className="space-y-6">
            {/* Karat Selection */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Old Gold Purity
              </label>
              <div className="flex gap-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/70 p-1">
                {(["22k", "18k"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKarat(k)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-all ${
                      karat === k
                        ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-900/50 dark:bg-zinc-700 dark:ring-zinc-600/50"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {k === "22k" ? "22K (916)" : "18K (750)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Input */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400" htmlFor="old-weight-input">
                Weight ({weightUnit})
              </label>
              <div className="relative">
                <input
                  id="old-weight-input"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={weightGrams}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                    setWeightGrams(val);
                  }}
                  onBlur={() => {
                    if (!gaFired.current && typeof weightGrams === "number") {
                      sendGAEvent({ event: "use_old_gold_calculator", weight: weightGrams });
                      gaFired.current = true;
                    }
                  }}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-4 py-2.5 pr-12 text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-500/10 dark:focus:ring-zinc-500/20"
                  placeholder="e.g. 8"
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-zinc-400 pointer-events-none">
                  {weightUnit === "Gram" ? "g" : ""}
                </span>
              </div>
            </div>

            {/* Deduction Slider & Input */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400" htmlFor="deduction-slider">
                  Melting Loss / Wastage (%)
                </label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  id="deduction-slider"
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={parsedDeduction}
                  onChange={(e) => setDeductionPercent(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 dark:bg-zinc-800 accent-zinc-500 hover:accent-zinc-600 dark:accent-zinc-400 dark:hover:accent-zinc-300"
                />
                <div className="relative w-24 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={deductionPercent}
                    onChange={(e) => setDeductionPercent(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-3 py-1.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-500/10 dark:focus:ring-zinc-500/20"
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-xs font-bold text-zinc-400 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col justify-center rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950/50 dark:to-zinc-900/50 p-6 ring-1 ring-inset ring-zinc-200/80 dark:ring-zinc-800/80">
            <h3 className="mb-2 text-center text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Estimated Cash Value
            </h3>
            
            <p className="text-center text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 drop-shadow-sm">
              {formatGlobalPrice(netValue)}
            </p>

            <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 pt-4 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 space-y-1">
              <p>Gross Value: {formatGlobalPrice(grossValue)}</p>
              <p className="text-red-500/90 dark:text-red-400/90">- {parsedDeduction}% Deduction: {formatGlobalPrice(deductionAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
