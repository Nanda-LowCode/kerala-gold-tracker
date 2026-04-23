import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import HallmarkCalculator from "@/components/HallmarkCalculator";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Hallmark Gold Value Calculator — 916, 750, 999 | LiveGold Kerala",
  description:
    "Calculate the gold value for any hallmark purity (999, 916, 750, 585, 375) based on today's Kerala gold rate. Instantly see the price per gram and total value for your weight.",
  alternates: { canonical: "/tools/hallmark-gold-calculator" },
  openGraph: {
    title: "Hallmark Gold Value Calculator — 916, 750, 999",
    description: "Find the gold value for 24K, 22K, 18K, 14K, and 9K jewellery based on today's live Kerala rate.",
    url: "https://www.livegoldkerala.com/tools/hallmark-gold-calculator",
  },
};

async function getLatestRate24k(): Promise<number | null> {
  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("rate_24k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data.rate_24k_1g;
  } catch {
    return null;
  }
}

const HALLMARK_INFO = [
  { badge: "999", karat: "24K", meaning: "Pure gold (99.9%). Used for investment bars, coins, and digital gold." },
  { badge: "916", karat: "22K", meaning: "91.6% pure. The most popular purity for jewellery in Kerala. Durable and bright." },
  { badge: "750", karat: "18K", meaning: "75% pure. Preferred for diamond-studded and lightweight daily-wear pieces." },
  { badge: "585", karat: "14K", meaning: "58.5% pure. Common in western-style rings and pendants. More affordable." },
  { badge: "375", karat: "9K", meaning: "37.5% pure. Entry-level gold, used in budget jewellery segments." },
];

export default async function HallmarkGoldCalculatorPage() {
  const rate24k = await getLatestRate24k();

  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">✨</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Tools · Hallmark Calculator
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Hallmark Gold Value Calculator
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Find the gold value for any BIS hallmark purity — 999, 916, 750, 585, or 375 — based on today&apos;s Kerala board rate.
          </p>
        </div>

        {rate24k ? (
          <HallmarkCalculator rate24k={rate24k} />
        ) : (
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Gold rates are currently unavailable. Please check back shortly.</p>
          </div>
        )}

        {/* Explainer */}
        <section className="space-y-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 md:text-lg">What do BIS hallmark numbers mean?</h2>
          <p>
            In India, gold jewellery is hallmarked by the Bureau of Indian Standards (BIS). The
            hallmark number tells you how much pure gold is present per 1,000 parts — so{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">916 means 916 grams of pure gold per kilogram</strong>, or 91.6% purity.
          </p>
          <div className="space-y-3">
            {HALLMARK_INFO.map((h) => (
              <div key={h.badge} className="flex gap-3">
                <span className="mt-0.5 shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-500/40">
                  {h.badge}
                </span>
                <p>
                  <strong className="text-zinc-800 dark:text-zinc-200">{h.karat} ({h.badge})</strong> — {h.meaning}
                </p>
              </div>
            ))}
          </div>
          <p>
            When you buy jewellery, ask for a BIS hallmarked piece. The hallmark guarantees the
            purity is independently certified — this protects you from impure gold and makes resale
            easier. Since August 2021, BIS hallmarking is mandatory for all gold jewellery sold in
            India.
          </p>
          <p>
            The calculator above uses today&apos;s official Kerala board rate for 24K gold as the
            base and derives all other karats proportionally. This gives you the raw gold value.
            Add making charges (typically 8–25%) and 3% GST to estimate the full showroom price.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Today&apos;s Gold Rate
          </Link>
          <Link href="/tools/gold-making-charge-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Making Charge Calculator →
          </Link>
          <Link href="/tools/old-gold-exchange-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Old Gold Exchange →
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p className="font-medium">Data sourced from Malabar Gold &amp; Diamonds · For reference only</p>
          <p className="mt-1.5">© 2026 LiveGold Kerala</p>
        </div>
      </footer>
    </>
  );
}
