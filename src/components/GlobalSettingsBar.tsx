"use client";

import { useGlobalSettings, CurrencyOption, WeightUnitOption } from "@/hooks/useGlobalSettings";
import { Globe, Scale } from "lucide-react";

export default function GlobalSettingsBar() {
  const { currency, setCurrency, weightUnit, setWeightUnit } = useGlobalSettings();

  return (
    <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-zinc-200/60 bg-white/50 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/50">
      
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          NRI Remittance Estimator
        </h3>
      </div>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
        {/* Currency Selector */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Select Remittance Currency:
            </span>
          </div>
          <div className="relative mt-1 sm:mt-0">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyOption)}
              className="w-full appearance-none rounded-lg border border-transparent bg-zinc-100 py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:w-auto dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <option value="INR">₹ INR</option>
              <option value="AED">د.إ AED</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="hidden h-5 w-px bg-zinc-200 sm:block dark:bg-zinc-800" />

        {/* Weight Selector */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Unit:
            </span>
          </div>
          <div className="relative mt-1 sm:mt-0">
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as WeightUnitOption)}
              className="w-full appearance-none rounded-lg border border-transparent bg-zinc-100 py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:w-auto dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <option value="Gram">Grams</option>
              <option value="Pavan">Pavans (8g)</option>
              <option value="Tola">Tola (11.66g)</option>
              <option value="Troy Ounce">Troy Ounce (31.1g)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">
        Note: This estimates the foreign currency required to purchase gold inside Kerala based on today&apos;s local board rate. It does not reflect local Gulf or international retail market prices.
      </p>

    </div>
  );
}
