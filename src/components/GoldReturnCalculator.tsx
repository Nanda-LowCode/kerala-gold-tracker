"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AnimatedNumber from "@/components/AnimatedNumber";
import { formatCurrency } from "@/lib/format";
import { rateForKarat, type Karat, type ResolvedRate } from "@/lib/holdings";

/**
 * "What if I'd bought" — historical gold return calculator.
 *
 * Reuses /api/rates/lookup (built for the tracker) to look up the board rate
 * on any past date back to 2020-04-06. That's the site's genuinely
 * hard-to-replicate data — no generic online return calculator has the real
 * AKGSMA daily board rate; they all use an approximated spot conversion.
 *
 * The tool is intentionally speculative rather than personal (that's what
 * /my-gold is for). But it hands off cleanly: the "Track this" CTA carries
 * grams + date + karat into the tracker via query params so a curious
 * "wow, gold has done 2x" moment turns into an actual portfolio entry.
 */

const EARLIEST_DATE = "2020-04-06";

type LookupState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; rate: ResolvedRate }
  | { kind: "missing" };

/** Same shape as /api/rates/lookup returns. */
type LookupResponse = Record<string, ResolvedRate | null>;

function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00Z").getTime();
  const b = new Date(toISO + "T00:00:00Z").getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

function shiftYearsUTC(date: string, delta: number): string {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCFullYear(d.getUTCFullYear() + delta);
  return d.toISOString().slice(0, 10);
}

function formatDay(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function GoldReturnCalculator({ today }: { today: ResolvedRate }) {
  // Defaults let the page render a meaningful answer the moment it loads —
  // no empty-form dead state. ₹50,000 five years ago is a common relatable
  // amount and a long-enough window to show real appreciation.
  const [amount, setAmount] = useState<string>("50000");
  const defaultDate = shiftYearsUTC(today.date, -5);
  const [startDate, setStartDate] = useState<string>(
    defaultDate >= EARLIEST_DATE ? defaultDate : EARLIEST_DATE,
  );
  const [karat, setKarat] = useState<Karat>(22);
  const [lookup, setLookup] = useState<LookupState>({ kind: "idle" });

  // Fetch the historical rate whenever the start date changes.
  useEffect(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return;
    if (startDate < EARLIEST_DATE || startDate > today.date) {
      setLookup({ kind: "missing" });
      return;
    }
    const controller = new AbortController();
    setLookup({ kind: "loading" });
    fetch(`/api/rates/lookup?dates=${startDate}`, { signal: controller.signal })
      .then((r) => (r.ok ? (r.json() as Promise<LookupResponse>) : Promise.reject(r)))
      .then((data) => {
        const row = data[startDate];
        if (!row) setLookup({ kind: "missing" });
        else setLookup({ kind: "ok", rate: row });
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setLookup({ kind: "missing" });
      });
    return () => controller.abort();
  }, [startDate, today.date]);

  const parsedAmount = Number(amount);
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const result = useMemo(() => {
    if (lookup.kind !== "ok" || !amountValid) return null;
    const historicalRate = rateForKarat(lookup.rate, karat);
    if (!historicalRate) return null;
    const grams = parsedAmount / historicalRate;
    const todayRate = rateForKarat(today, karat);
    const todayValue = grams * todayRate;
    const absoluteReturn = todayValue - parsedAmount;
    const pctReturn = (absoluteReturn / parsedAmount) * 100;
    const days = daysBetween(startDate, today.date);
    const years = Math.max(days / 365.25, 1 / 365.25);
    const annualizedReturn = (Math.pow(todayValue / parsedAmount, 1 / years) - 1) * 100;
    return {
      grams,
      historicalRate,
      todayValue,
      absoluteReturn,
      pctReturn,
      annualizedReturn,
      pricedFrom: lookup.rate.date,
    };
  }, [lookup, amountValid, parsedAmount, karat, today, startDate]);

  // Preset chips — the three most-scanned windows on a return calculator.
  const presets: { label: string; years: number }[] = [
    { label: "1 year ago", years: 1 },
    { label: "3 years ago", years: 3 },
    { label: "5 years ago", years: 5 },
  ];

  const isUp = (result?.absoluteReturn ?? 0) >= 0;

  return (
    <div className="space-y-5">
      {/* Input */}
      <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Amount invested
            </span>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-zinc-500">
                ₹
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={100}
                step={100}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-8 pr-3 text-lg font-bold tracking-tight text-zinc-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-100"
                placeholder="50000"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Bought on
            </span>
            <input
              type="date"
              min={EARLIEST_DATE}
              max={today.date}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-3 py-3 text-base font-semibold text-zinc-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-100"
            />
          </label>
        </div>

        {/* Preset chips + karat toggle */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {presets.map((p) => {
            const target = shiftYearsUTC(today.date, -p.years);
            const clamped = target < EARLIEST_DATE ? EARLIEST_DATE : target;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setStartDate(clamped)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  startDate === clamped
                    ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600/60 dark:bg-amber-950/30 dark:text-amber-300"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                }`}
              >
                {p.label}
              </button>
            );
          })}
          <span className="ml-auto flex gap-1 rounded-xl bg-zinc-100/70 p-1 dark:bg-zinc-800/70">
            {([22, 24] as Karat[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKarat(k)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  karat === k
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {k}K
              </button>
            ))}
          </span>
        </div>
      </section>

      {/* Result */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-lg shadow-amber-100/50 dark:border-amber-800/50 dark:from-amber-950/30 dark:to-zinc-900 dark:shadow-none">
        {lookup.kind === "loading" && !result ? (
          <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Looking up the board rate for {formatDay(startDate)}…
          </p>
        ) : lookup.kind === "missing" ? (
          <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No rate on file for that date. Try a date after {formatDay(EARLIEST_DATE)}.
          </p>
        ) : !amountValid ? (
          <p className="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Enter an amount to see the return.
          </p>
        ) : result ? (
          <>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {formatCurrency(parsedAmount)} in {karat}K gold on{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {formatDay(result.pricedFrom)}
              </strong>{" "}
              — bought about{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                {result.grams.toFixed(2)} g
              </strong>{" "}
              at {formatCurrency(result.historicalRate)}/g. Today that gold is worth:
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
              <AnimatedNumber value={result.todayValue} format={formatCurrency} />
            </p>
            <p
              className={`mt-1 text-sm font-semibold ${
                isUp
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isUp ? "▲" : "▼"} {formatCurrency(Math.abs(result.absoluteReturn))} (
              {isUp ? "+" : "−"}
              {Math.abs(result.pctReturn).toFixed(1)}%) total ·{" "}
              {isUp ? "+" : "−"}
              {Math.abs(result.annualizedReturn).toFixed(1)}% / year
            </p>

            {/* Hand-off to the tracker with everything pre-filled. The
                theoretical "would have bought X grams on Y date" becomes a
                real holding one tap later. */}
            <Link
              href={`/my-gold?g=${result.grams.toFixed(2)}&d=${result.pricedFrom}&k=${karat}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              Track this in My Gold →
            </Link>
            <p className="mt-3 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Board rate only. Making charges, GST and jeweller premium not included. Past
              performance is not a guarantee — but it is the actual AKGSMA history, not an
              estimate.
            </p>
          </>
        ) : null}
      </section>
    </div>
  );
}
