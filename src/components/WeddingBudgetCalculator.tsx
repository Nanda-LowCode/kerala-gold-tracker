"use client";

import { useState, useMemo } from "react";
import type { WeddingCommunity } from "@/lib/database.types";
import type { OrnamentRow } from "@/app/culture/weddings/budget-calculator/page";

const PAVAN_GRAMS = 8;
const GST_RATE = 0.03;

const COMMUNITIES: { value: WeddingCommunity; label: string; tradition: string }[] = [
  { value: "nair",            label: "Nair",              tradition: "Hindu" },
  { value: "namboothiri",     label: "Namboothiri",       tradition: "Hindu" },
  { value: "ezhava",          label: "Ezhava",            tradition: "Hindu" },
  { value: "syrian-christian",label: "Syrian Christian",  tradition: "Christian" },
  { value: "latin-catholic",  label: "Latin Catholic",    tradition: "Christian" },
  { value: "marthoma",        label: "Marthoma",          tradition: "Christian" },
  { value: "mappila-muslim",  label: "Mappila Muslim",    tradition: "Muslim" },
  { value: "sunni-muslim",    label: "Sunni Muslim",      tradition: "Muslim" },
];

const MUSLIM_COMMUNITIES: WeddingCommunity[] = ["mappila-muslim", "sunni-muslim"];

type Props = {
  ornaments: OrnamentRow[];
  rate22k: number;
};

export default function WeddingBudgetCalculator({ ornaments, rate22k }: Props) {
  const [community, setCommunity] = useState<WeddingCommunity>("nair");
  const [makingPct, setMakingPct] = useState(12);
  const [mahrGrams, setMahrGrams] = useState(0);

  const communityOrnaments = useMemo(
    () => ornaments.filter((o) => o.community === community),
    [ornaments, community]
  );

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [pavans, setPavans] = useState<Record<string, number>>({});

  const getPavan = (slug: string, def: number | null) =>
    pavans[slug] ?? def ?? 1;

  const isChecked = (slug: string, required: boolean) =>
    checked[slug] !== undefined ? checked[slug] : required;

  const { goldGrams, goldValue, makingCharge, mahrValue, subtotal, gst, grandTotal } =
    useMemo(() => {
      const goldGrams = communityOrnaments.reduce((sum, o) => {
        if (!isChecked(o.slug, o.is_required)) return sum;
        return sum + getPavan(o.slug, o.default_pavan) * PAVAN_GRAMS;
      }, 0);
      const goldValue = goldGrams * rate22k;
      const makingCharge = goldValue * (makingPct / 100);
      const isMuslim = MUSLIM_COMMUNITIES.includes(community);
      const mahrValue = isMuslim ? mahrGrams * rate22k : 0;
      const subtotal = goldValue + makingCharge + mahrValue;
      const gst = subtotal * GST_RATE;
      const grandTotal = subtotal + gst;
      return { goldGrams, goldValue, makingCharge, mahrValue, subtotal, gst, grandTotal };
    }, [communityOrnaments, checked, pavans, rate22k, makingPct, mahrGrams, community]);

  const isMuslim = MUSLIM_COMMUNITIES.includes(community);

  const fmt = (n: number) =>
    "₹" + Math.round(n).toLocaleString("en-IN");

  return (
    <div className="space-y-6">
      {/* Community selector */}
      <section className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Select Community
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMUNITIES.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setCommunity(c.value);
                setChecked({});
                setPavans({});
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                community === c.value
                  ? "bg-amber-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Mahr notice for Muslim communities */}
      {isMuslim && (
        <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-4 py-3 text-xs text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-300">
          <strong>Mahr is a separate field below.</strong> It flows from groom to bride and is her absolute property under Islamic law. It is not dowry and is kept separate from the wedding ornament estimate.
        </div>
      )}

      {/* Ornament list */}
      {communityOrnaments.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ornament defaults for this community are being prepared. Check back soon.
        </p>
      ) : (
        <section className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Ornaments
          </label>
          <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200/60 dark:divide-zinc-800 dark:border-zinc-800">
            {communityOrnaments.map((o) => {
              const active = isChecked(o.slug, o.is_required);
              const pavan = getPavan(o.slug, o.default_pavan);
              return (
                <div
                  key={o.slug}
                  className={`flex items-center gap-3 px-4 py-3 ${active ? "" : "opacity-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) =>
                      setChecked((prev) => ({ ...prev, [o.slug]: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-zinc-300 accent-amber-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {o.name_en}
                    </p>
                    {o.name_ml && (
                      <p className="text-xs text-zinc-400">{o.name_ml}</p>
                    )}
                    {o.is_required && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Traditional
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() =>
                        setPavans((prev) => ({
                          ...prev,
                          [o.slug]: Math.max(0.5, (prev[o.slug] ?? o.default_pavan ?? 1) - 0.5),
                        }))
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      −
                    </button>
                    <span className="w-14 text-center text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {pavan} pavan
                    </span>
                    <button
                      onClick={() =>
                        setPavans((prev) => ({
                          ...prev,
                          [o.slug]: (prev[o.slug] ?? o.default_pavan ?? 1) + 0.5,
                        }))
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      +
                    </button>
                  </div>
                  <div className="w-24 text-right shrink-0">
                    {active && rate22k > 0 ? (
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        {fmt(pavan * PAVAN_GRAMS * rate22k)}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Making charge slider */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Making Charge
          </label>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{makingPct}%</span>
        </div>
        <input
          type="range"
          min={8}
          max={25}
          step={1}
          value={makingPct}
          onChange={(e) => setMakingPct(Number(e.target.value))}
          className="w-full accent-amber-600"
        />
        <div className="flex justify-between text-[10px] text-zinc-400">
          <span>8% (minimum)</span>
          <span>25% (premium)</span>
        </div>
      </section>

      {/* Mahr input for Muslim communities */}
      {isMuslim && (
        <section className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Mahr — Bride&apos;s Gold (grams)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              step={1}
              value={mahrGrams}
              onChange={(e) => setMahrGrams(Math.max(0, Number(e.target.value)))}
              className="w-32 rounded-lg border border-zinc-200/60 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 outline-none ring-0 focus:border-amber-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              placeholder="e.g. 80"
            />
            <span className="text-xs text-zinc-500">grams</span>
            {mahrGrams > 0 && rate22k > 0 && (
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                ≈ {fmt(mahrGrams * rate22k)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-400">
            Enter the Mahr in grams of gold. This is entirely the bride&apos;s property.
          </p>
        </section>
      )}

      {/* Summary */}
      {rate22k > 0 && (
        <section className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-5 py-4 dark:border-amber-800/30 dark:bg-amber-950/10">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Estimate
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Gold ({goldGrams.toFixed(1)} g × ₹{rate22k.toLocaleString("en-IN")}/g)</span>
              <span className="font-medium">{fmt(goldValue)}</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Making charge ({makingPct}%)</span>
              <span className="font-medium">{fmt(makingCharge)}</span>
            </div>
            {isMuslim && mahrGrams > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                <span>Mahr ({mahrGrams} g — bride&apos;s property)</span>
                <span className="font-medium">{fmt(mahrValue)}</span>
              </div>
            )}
            <div className="border-t border-zinc-200/60 pt-2 dark:border-zinc-700">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span className="font-medium">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>GST (3%)</span>
                <span className="font-medium">{fmt(gst)}</span>
              </div>
            </div>
            <div className="border-t border-amber-200 pt-2 dark:border-amber-800/40">
              <div className="flex justify-between text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                <span>Estimated Total</span>
                <span>{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-zinc-400 dark:text-zinc-500">
            Estimate based on 22K rate. Actual cost depends on specific designs, jeweller, and current market.
          </p>
        </section>
      )}

      {rate22k === 0 && (
        <p className="text-center text-sm text-zinc-400">
          Gold rate unavailable — estimates paused. Check back shortly.
        </p>
      )}
    </div>
  );
}
