"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Plus, Trash2, Pencil, Lock, X } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import AnimatedNumber from "@/components/AnimatedNumber";
import {
  computePortfolio,
  subscribeHoldings,
  getHoldingsSnapshot,
  getHoldingsServerSnapshot,
  saveHoldings,
  newId,
  shiftYearsUTC,
  KARATS,
  type Holding,
  type Karat,
  type ResolvedRate,
} from "@/lib/holdings";

const AllocationChart = dynamic(() => import("@/components/AllocationChart"), {
  ssr: false,
  loading: () => <div aria-hidden className="h-[200px] animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />,
});

/** Matches the API's cap, so a large first load is chunked rather than rejected. */
const MAX_DATES_PER_REQUEST = 30;
const EARLIEST_DATE = "2020-04-06";

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function formatDay(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Subscribe-to-nothing store used purely to tell hydration from first paint. */
const noopSubscribe = () => () => {};

export default function MyGoldClient({ today }: { today: ResolvedRate }) {
  const holdings = useSyncExternalStore(
    subscribeHoldings,
    getHoldingsSnapshot,
    getHoldingsServerSnapshot
  );

  // False during SSR and the hydration render, true afterwards — so a returning
  // user with saved holdings never flashes the "nothing added yet" state.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const [rates, setRates] = useState<Record<string, ResolvedRate | null>>({});

  // Arriving from the pavan converter carries the weight across, so the visitor
  // lands with the form half-filled instead of facing an empty one.
  const searchParams = useSearchParams();

  // Form state
  const [grams, setGrams] = useState(() => {
    const g = Number(searchParams.get("g"));
    return Number.isFinite(g) && g > 0 ? String(g) : "";
  });
  const [karat, setKarat] = useState<Karat>(22);
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [label, setLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Dates already requested, so re-renders never refetch the same day.
  const requestedRef = useRef<Set<string>>(new Set());

  const ensureRates = useCallback((dates: string[]) => {
    const needed = [...new Set(dates)].filter(
      (d) => d && !requestedRef.current.has(d)
    );
    if (needed.length === 0) return;
    needed.forEach((d) => requestedRef.current.add(d));

    for (const group of chunk(needed, MAX_DATES_PER_REQUEST)) {
      fetch(`/api/rates/lookup?dates=${group.join(",")}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data && typeof data === "object" && !data.error) {
            setRates((prev) => ({ ...prev, ...data }));
          }
        })
        .catch(() => {
          // Leave these dates resolved-as-missing; the row shows "add price
          // manually" rather than a hard error.
          group.forEach((d) => requestedRef.current.delete(d));
        });
    }
  }, []);

  // Resolve cost basis for any auto-priced holding.
  useEffect(() => {
    ensureRates(
      holdings.filter((h) => h.pricePerGram === undefined).map((h) => h.purchaseDate)
    );
  }, [holdings, ensureRates]);

  // Also resolve the date currently in the form, to preview the board rate.
  useEffect(() => {
    if (date >= EARLIEST_DATE && date <= today.date) ensureRates([date]);
  }, [date, today.date, ensureRates]);

  const { rows, totals } = computePortfolio(holdings, rates, today);

  const formPreview = date ? rates[date] : undefined;

  function resetForm() {
    setGrams("");
    setKarat(22);
    setDate("");
    setPrice("");
    setLabel("");
    setEditingId(null);
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const g = Number(grams);
    if (!g || g <= 0 || !date) return;

    const p = Number(price);
    const entry: Holding = {
      id: editingId ?? newId(),
      grams: g,
      karat,
      purchaseDate: date,
      pricePerGram: price.trim() && p > 0 ? p : undefined,
      label: label.trim() || undefined,
    };

    saveHoldings(
      editingId ? holdings.map((h) => (h.id === editingId ? entry : h)) : [...holdings, entry]
    );
    resetForm();
  }

  function editHolding(h: Holding) {
    setEditingId(h.id);
    setGrams(String(h.grams));
    setKarat(h.karat);
    setDate(h.purchaseDate);
    setPrice(h.pricePerGram !== undefined ? String(h.pricePerGram) : "");
    setLabel(h.label ?? "");
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function deleteHolding(id: string) {
    saveHoldings(holdings.filter((h) => h.id !== id));
    if (editingId === id) resetForm();
  }

  function addExample() {
    saveHoldings([
      {
        id: newId(),
        grams: 8,
        karat: 22,
        purchaseDate: shiftYearsUTC(today.date, -2),
        label: "Example — 1 pavan",
      },
    ]);
  }

  const gainPositive = totals.gain >= 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      {holdings.length > 0 && (
        <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Current value
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            <AnimatedNumber value={totals.currentValue} format={formatCurrency} />
          </p>

          {totals.invested > 0 && (
            <p
              className={`mt-1.5 text-sm font-semibold ${
                gainPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {gainPositive ? "▲" : "▼"} {formatCurrency(Math.abs(totals.gain))} (
              {gainPositive ? "+" : "−"}
              {Math.abs(totals.gainPct).toFixed(1)}%)
              <span className="ml-1.5 font-normal text-zinc-500 dark:text-zinc-400">
                on {formatCurrency(totals.invested)} invested
              </span>
            </p>
          )}

          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] text-zinc-500 dark:text-zinc-400">Total weight</dt>
              <dd className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                {totals.totalGrams.toFixed(1)} g
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-zinc-500 dark:text-zinc-400">In pavan</dt>
              <dd className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                {(totals.totalGrams / 8).toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-zinc-500 dark:text-zinc-400">Pure gold</dt>
              <dd className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                {totals.pureGrams.toFixed(1)} g
              </dd>
            </div>
          </dl>

          {totals.totalGrams > 0 && (
            <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <AllocationChart gramsByKarat={totals.gramsByKarat} />
            </div>
          )}

          <p className="mt-4 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            Valued at today&apos;s board rate ({formatDay(today.date)}): 22K{" "}
            {formatCurrency(today.rate_22k_1g)}/g · 24K {formatCurrency(today.rate_24k_1g)}/g.
            This is the metal value only — it excludes making charges and GST.
          </p>
        </section>
      )}

      {/* Holdings */}
      {holdings.length === 0 && hydrated ? (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Nothing added yet
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            Add a purchase below and we&apos;ll look up the Kerala board rate for the day you
            bought it — no need to dig out the bill.
          </p>
          <button
            onClick={addExample}
            className="mt-4 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Try it with an example
          </button>
        </section>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map(({ holding, costPerGram, pricedFrom, isManualPrice, invested, currentValue, gain, gainPct }) => {
            const up = (gain ?? 0) >= 0;
            return (
              <article
                key={holding.id}
                className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {holding.label ?? `${holding.grams} g of ${holding.karat}K`}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {holding.grams} g · {holding.karat}K · bought {formatDay(holding.purchaseDate)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => editHolding(holding)}
                      aria-label="Edit holding"
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteHolding(holding.id)}
                      aria-label="Delete holding"
                      className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-zinc-400">Invested</dt>
                    <dd className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {invested === null ? "—" : formatCurrency(invested)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-zinc-400">Now</dt>
                    <dd className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {formatCurrency(currentValue)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-wider text-zinc-400">Gain</dt>
                    <dd
                      className={`text-sm font-semibold ${
                        gain === null
                          ? "text-zinc-400"
                          : up
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {gain === null
                        ? "—"
                        : `${up ? "+" : "−"}${formatCurrency(Math.abs(gain))}`}
                      {gainPct !== null && (
                        <span className="ml-1 text-[11px] font-normal">
                          ({up ? "+" : "−"}
                          {Math.abs(gainPct).toFixed(1)}%)
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>

                <p className="mt-2.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {costPerGram === null ? (
                    <>No board rate found for this date — edit the holding to enter what you paid.</>
                  ) : isManualPrice ? (
                    <>Your price: {formatCurrency(costPerGram)}/g</>
                  ) : (
                    <>
                      Board rate {formatCurrency(costPerGram)}/g
                      {pricedFrom && pricedFrom !== holding.purchaseDate && (
                        <> (nearest trading day, {formatDay(pricedFrom)})</>
                      )}
                    </>
                  )}
                </p>
              </article>
            );
          })}
        </div>
      )}

      {/* Add / edit form */}
      <form
        onSubmit={submitForm}
        className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            {editingId ? "Edit holding" : "Add a purchase"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <X className="h-3 w-3" /> Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Weight (grams)
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              required
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              placeholder="8"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Purity
            </span>
            <select
              value={karat}
              onChange={(e) => setKarat(Number(e.target.value) as Karat)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {KARATS.map((k) => (
                <option key={k} value={k}>
                  {k}K{k === 22 ? " (916)" : k === 24 ? " (999)" : " (750)"}
                </option>
              ))}
            </select>
          </label>

          <label className="col-span-2 block">
            <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Date bought
            </span>
            <input
              type="date"
              required
              min={EARLIEST_DATE}
              max={today.date}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>

          <label className="col-span-2 block">
            <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Price paid per gram{" "}
              <span className="font-normal text-zinc-400">— optional</span>
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="1"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={
                formPreview
                  ? `Board rate that day: ${
                      karat === 24
                        ? formPreview.rate_24k_1g
                        : karat === 18
                          ? formPreview.rate_18k_1g
                          : formPreview.rate_22k_1g
                    }`
                  : "Leave blank to use the board rate"
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <span className="mt-1 block text-[11px] text-zinc-500 dark:text-zinc-400">
              Leave blank and we&apos;ll use the Kerala board rate for that date. Enter a figure
              if you want to include what you actually paid.
            </span>
          </label>

          <label className="col-span-2 block">
            <span className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Label <span className="font-normal text-zinc-400">— optional</span>
            </span>
            <input
              type="text"
              maxLength={40}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Wedding chain"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-[0.99] dark:bg-amber-600 dark:hover:bg-amber-500"
        >
          <Plus className="h-4 w-4" />
          {editingId ? "Save changes" : "Add to my gold"}
        </button>
      </form>

      <p className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        <Lock className="mt-0.5 h-3 w-3 shrink-0" />
        <span>
          Your holdings are stored only in this browser — they never reach our servers, and we
          can&apos;t see them. Clearing your browser data will erase them.
        </span>
      </p>
    </div>
  );
}
