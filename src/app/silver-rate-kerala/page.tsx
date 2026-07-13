import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "@/app/page";
import { formatCurrency } from "@/lib/format";
import SilverChartLazy from "@/components/SilverChartLazy";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const history = await getHistory();
  const today = history[0];
  const rate = today?.rate_silver_1g;

  const title = rate
    ? `Silver Rate in Kerala Today: ₹${rate}/g — Per Gram & Per Kg | LiveGold Kerala`
    : "Today's Silver Rate in Kerala — Per Gram & Per Kg | LiveGold Kerala";

  return {
    title,
    description:
      "Today's silver rate in Kerala per gram, 100g and 1kg (999 fine). The same KGSMA board rate applies in Kochi, Ernakulam, Thrissur, Kozhikode and Trivandrum. Updated daily.",
    keywords: [
      "silver rate today kerala",
      "silver rate per gram kerala",
      "silver price kerala today",
      "silver rate kochi",
      "silver price india today",
    ],
    alternates: { canonical: "/silver-rate-kerala" },
    openGraph: {
      title,
      description: "Today's silver rate in Kerala — per gram, 100g, and 1kg. Updated daily.",
      url: "https://www.livegoldkerala.com/silver-rate-kerala",
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ChangeBadge({ change }: { change: number }) {
  if (change === 0)
    return (
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        No change
      </span>
    );
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${
        up
          ? "bg-red-50 text-red-600 ring-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50"
          : "bg-green-50 text-green-600 ring-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50"
      }`}
    >
      {up ? "▲" : "▼"} ₹{Math.abs(change).toLocaleString("en-IN")} today
    </span>
  );
}

export default async function SilverRatePage() {
  const history = await getHistory();
  const today = history[0] ?? null;
  const yesterday = history[1] ?? null;

  const silverToday = today?.rate_silver_1g ?? null;
  const silverYesterday = yesterday?.rate_silver_1g ?? null;
  const change = silverToday && silverYesterday ? silverToday - silverYesterday : null;

  // 7-day range (freshness/depth signal)
  const weekVals = history.slice(0, 7).map((h) => h.rate_silver_1g).filter((v): v is number => typeof v === "number");
  const weekLow = weekVals.length ? Math.min(...weekVals) : null;
  const weekHigh = weekVals.length ? Math.max(...weekVals) : null;

  // Chronological silver series for the trend chart (oldest → newest).
  const silverSeries = [...history]
    .reverse()
    .filter((h): h is typeof h & { rate_silver_1g: number } => typeof h.rate_silver_1g === "number")
    .map((h) => ({ date: h.date, rate: h.rate_silver_1g }));

  const faqs = silverToday
    ? [
        {
          q: "What is the silver rate in Kerala today?",
          a: `Today's silver rate in Kerala is ${formatCurrency(silverToday)} per gram for 999 fine silver — that's ${formatCurrency(silverToday * 1000)} per kilogram. It is set by the Kerala Gold & Silver Merchants Association and is uniform across all districts.`,
        },
        {
          q: "Is the silver rate the same in Kochi, Thrissur and other Kerala cities?",
          a: "Yes. The KGSMA board rate is uniform across Kerala, so the silver rate today in Kochi, Ernakulam, Thrissur, Kozhikode, Kollam, Kannur and Trivandrum is the same per-gram rate shown above.",
        },
        {
          q: "What is the silver rate per kg in Kerala?",
          a: `At ${formatCurrency(silverToday)} per gram, 1 kg of 999 silver works out to ${formatCurrency(silverToday * 1000)} today (before making charges and GST).`,
        },
        {
          q: "Why is silver more volatile than gold?",
          a: "Silver responds to both precious-metal sentiment and industrial demand (electronics, solar, EVs), so its price swings more than gold's. The gold-to-silver ratio is a common gauge of relative value.",
        },
        {
          q: "What is the difference between 999 and 925 silver?",
          a: "999 is fine silver (99.9% pure) — soft, used for coins and bars. 925 is sterling silver (92.5% pure, 7.5% copper) — harder and used for most jewellery, anklets and utensils. The board rate is quoted for 999; a 925 item costs about 92.5% of it, before making charges.",
        },
        {
          q: "How much making charge do silver anklets and utensils have?",
          a: `Silver making charges vary widely — coins and bars carry little or none, while anklets and intricate jewellery run roughly 10–25% (or a flat per-gram rate). Use our silver price calculator to estimate the total at today's ${formatCurrency(silverToday)}/g rate.`,
        },
      ]
    : [];

  const denominations = silverToday
    ? [
        { label: "1 gram", value: silverToday },
        { label: "10 grams", value: silverToday * 10 },
        { label: "100 grams", value: silverToday * 100 },
        { label: "1 kilogram", value: silverToday * 1000 },
      ]
    : [];

  return (
    <>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <span className="text-base">🥈</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Kerala Board Rate · Ag 999</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            Silver Rate in Kerala Today
          </h1>
          {today && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={today.date}>{formatDate(today.date)}</time>
            </p>
          )}
        </section>

        {silverToday ? (
          <>
            {/* Main rate card */}
            <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Per gram (999 fine)</p>
                  <p className="mt-1 text-5xl font-bold tracking-tight text-slate-700 dark:text-slate-300">
                    {formatCurrency(silverToday)}
                  </p>
                </div>
                {change !== null && <ChangeBadge change={change} />}
              </div>
            </div>

            {/* Denomination table */}
            <div className="mb-8 rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Today&apos;s Silver Rate by Weight
                </h2>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {denominations.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* City coverage + 7-day range — captures "silver rate today {city}" and adds a freshness signal */}
            <p className="mb-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              The same KGSMA board rate applies right across Kerala, so the silver rate today in{" "}
              <strong className="text-zinc-700 dark:text-zinc-300">Kochi, Ernakulam, Thrissur, Kozhikode, Kollam, Kannur and Trivandrum</strong>{" "}
              is the same {formatCurrency(silverToday)}/g shown above.
              {weekLow !== null && weekHigh !== null && weekLow !== weekHigh && (
                <> Over the last 7 days it has ranged {formatCurrency(weekLow)}–{formatCurrency(weekHigh)} per gram.</>
              )}
            </p>

            {/* Silver trend chart */}
            {silverSeries.length >= 2 && (
              <div className="mb-8">
                <SilverChartLazy series={silverSeries} />
              </div>
            )}

            {/* Calculator CTA */}
            <Link
              href="/tools/silver-price-calculator"
              className="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-5 transition-colors hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div>
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Silver price calculator</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  Anklets, coins &amp; utensils — with making charges + GST at today&apos;s rate.
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-slate-600 dark:text-slate-400">Open →</span>
            </Link>
          </>
        ) : (
          <div className="mb-8 rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400">
              Silver rate data will appear here after the next daily update (~10:30 AM IST).
            </p>
          </div>
        )}

        {/* Explainer */}
        <div className="space-y-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">About Silver Rates in Kerala</h2>

          <p>
            The silver rate in Kerala is set daily by the Kerala Gold &amp; Silver Merchants Association (KGSMA), the same body that sets gold rates. Like gold, the rate is uniform across all districts — Kochi, Trivandrum, Thrissur, and Kozhikode all follow the same board rate.
          </p>

          <p>
            Kerala silver is sold as <strong className="text-zinc-700 dark:text-zinc-300">999 fine silver</strong> (99.9% purity), equivalent to international &quot;three nines&quot; grade. This is the highest purity available and is the standard for investment-grade silver coins and bars.
          </p>

          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">999 fine vs 925 sterling — which is which?</h3>
          <p>
            <strong className="text-zinc-700 dark:text-zinc-300">999 (fine)</strong> is nearly pure silver — soft, used for coins, bars and investment. <strong className="text-zinc-700 dark:text-zinc-300">925 (sterling)</strong> is 92.5% silver with 7.5% copper for hardness, used for most jewellery, anklets and cutlery because pure silver bends too easily. The board rate above is for 999; a 925 piece is priced at about 92.5% of it, plus making charges.
          </p>

          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">What Keralites buy silver for</h3>
          <ul className="ml-5 list-disc space-y-1.5">
            <li><strong className="text-zinc-700 dark:text-zinc-300">Anklets (kolusu / painjan)</strong> and toe rings — silver is traditionally worn on the feet, where gold is avoided.</li>
            <li><strong className="text-zinc-700 dark:text-zinc-300">Pooja items</strong> — lamps (nilavilakku), urulis, kindi and idols for temples and homes.</li>
            <li><strong className="text-zinc-700 dark:text-zinc-300">Gifting utensils</strong> — glasses, plates and bowls for weddings and the 28th-day (choroonu) ceremony.</li>
            <li><strong className="text-zinc-700 dark:text-zinc-300">Coins &amp; bars</strong> — 999 fine, bought as affordable precious-metal investment, especially on Akshaya Tritiya and Dhanteras.</li>
          </ul>

          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">What drives the silver price?</h3>

          <p>
            Silver tracks the international spot price (USD/troy oz on COMEX), adjusted for the INR/USD exchange rate and import duty. Silver is more volatile than gold — it responds to both precious metal sentiment and industrial demand (electronics, solar panels, EVs).
          </p>

          <p>
            Silver&apos;s gold-to-silver ratio (how many grams of silver equal one gram of gold) historically ranges from 50 to 100. When the ratio is high (silver is cheap relative to gold), silver tends to mean-revert upward over time. Currently, the ratio is around{" "}
            {silverToday && today ? (
              <strong className="text-zinc-700 dark:text-zinc-300">
                {Math.round(today.rate_22k_1g / silverToday)}:1
              </strong>
            ) : (
              "80–90:1"
            )}.
          </p>
        </div>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mt-10">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              }}
            />
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">Silver Rate FAQs</h2>
            <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
              {faqs.map((f) => (
                <div key={f.q} className="py-4">
                  <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{f.q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA to gold rates */}
        <div className="mt-8 rounded-2xl border border-amber-200/50 bg-amber-50/50 p-5 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Looking for gold rates?{" "}
            <Link href="/" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 dark:text-amber-400">
              Check today&apos;s gold rate in Kerala →
            </Link>
          </p>
        </div>
      </main>

    </>
  );
}
