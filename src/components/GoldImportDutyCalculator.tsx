"use client";

import { useState } from "react";
import { Calculator, Plane, Scale, User, CalendarClock, DollarSign } from "lucide-react";

type Gender = "Male" | "Female";
type StayDuration = "> 1 Year" | "6 to 12 Months" | "< 6 Months";

export default function GoldImportDutyCalculator({
  initialGoldRate = 7500, // Reasonable default if live scraper fails
}: {
  initialGoldRate?: number;
}) {
  const [gender, setGender] = useState<Gender>("Male");
  const [stayDuration, setStayDuration] = useState<StayDuration>("> 1 Year");
  const [goldWeight, setGoldWeight] = useState<number>(50);
  const [currentGoldRate, setCurrentGoldRate] = useState<number>(initialGoldRate);

  // Math Logic (2026 Rules)
  let dutyFreeAllowance = 0;
  if (stayDuration === "> 1 Year") {
    dutyFreeAllowance = gender === "Female" ? 40 : 20;
  }

  const taxableWeight = Math.max(0, (goldWeight || 0) - dutyFreeAllowance);
  
  const taxRatePercent = stayDuration === "< 6 Months" ? 36 : 6;
  const applicableDutyPercentDisplay = `${taxRatePercent}%`;

  const totalEstimatedDuty = taxableWeight * (currentGoldRate || 0) * (taxRatePercent / 100);

  // Format currency securely
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 shadow-xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80 text-left">
      <div className="border-b border-zinc-200/50 bg-gradient-to-r from-amber-50 to-amber-100/50 p-6 dark:border-zinc-800/50 dark:from-zinc-900 dark:to-zinc-900/30">
        <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-amber-900 sm:text-2xl dark:text-amber-500">
          <Plane className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          NRI Gold Import Duty Calculator
        </h2>
        <p className="mt-2 text-sm text-amber-800/80 dark:text-zinc-400">
          Calculate customs duty based on updated weight-based limits to bring jewelry safely into India.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Gender */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <User className="h-4 w-4 text-zinc-400" /> Passenger Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="Male">Male User</option>
              <option value="Female">Female User</option>
            </select>
          </div>

          {/* Stay Duration */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <CalendarClock className="h-4 w-4 text-zinc-400" /> Gulf/Abroad Stay Duration
            </label>
            <select
              value={stayDuration}
              onChange={(e) => setStayDuration(e.target.value as StayDuration)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <option value="> 1 Year">More than 1 Year</option>
              <option value="6 to 12 Months">6 to 12 Months</option>
              <option value="< 6 Months">Less than 6 Months</option>
            </select>
          </div>

          {/* Gold Weight */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <Scale className="h-4 w-4 text-zinc-400" /> Total Gold Weight (Grams)
            </label>
            <input
              type="number"
              min="0"
              value={goldWeight}
              onChange={(e) => setGoldWeight(Number(e.target.value))}
              placeholder="e.g. 50"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Current Rate */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <DollarSign className="h-4 w-4 text-zinc-400" /> 1g Gold Rate (in INR)
            </label>
            <input
              type="number"
              min="0"
              value={currentGoldRate}
              onChange={(e) => setCurrentGoldRate(Number(e.target.value))}
              placeholder="e.g. 14000"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8 rounded-2xl bg-zinc-50 border border-zinc-200/80 p-6 dark:bg-zinc-900/50 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-5">
            <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Airport Customs Breakdown
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Free Allowance</p>
              <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-500">{dutyFreeAllowance} Grams</p>
            </div>
            
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Taxable Weight</p>
              <p className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-500">{taxableWeight} Grams</p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Duty Applied</p>
              <p className="mt-1 text-xl font-bold text-zinc-800 dark:text-zinc-200">{applicableDutyPercentDisplay}</p>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-5 dark:bg-amber-950/20 dark:border-amber-900/40 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-600">Total Customs Duty to Pay</p>
              <p className="text-xs text-amber-700/80 dark:text-amber-700 mt-1">Payable in INR at Airport Customs</p>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight mt-3 sm:mt-0 drop-shadow-sm">
              {formatCurrency(totalEstimatedDuty)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
