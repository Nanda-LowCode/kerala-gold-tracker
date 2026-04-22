import React from "react";
import Link from "next/link";
import PriceChart from "@/components/PriceChart";
import HistoryTable from "@/components/HistoryTable";
import FAQ from "@/components/FAQ";
import TodayVsYesterday from "@/components/TodayVsYesterday";
import TopTicker from "@/components/TopTicker";
import GoldCalculator from "@/components/GoldCalculator";
import OldGoldCalculator from "@/components/OldGoldCalculator";
import CtaBanner from "@/components/CtaBanner";
import RatesPendingBanner from "@/components/RatesPendingBanner";
import WhatsAppShare from "@/components/WhatsAppShare";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationToggle from "@/components/NotificationToggle";
import TrendAnalysisIndicator from "@/components/TrendAnalysisIndicator";
import PriceAlertInput from "@/components/PriceAlertInput";
import SilverRateCard from "@/components/SilverRateCard";
import { GoldRate } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { getCityData } from "@/lib/cityData";

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Major districts for our dynamic SEO routing
export const KERALA_CITIES = [
  "trivandrum",
  "ernakulam",
  "kozhikode",
  "thrissur",
  "kollam",
  "palakkad",
  "kannur",
  "alappuzha",
  "kottayam",
  "malappuram",
];

export default function DashboardLayout({
  history,
  cityName,
}: {
  history: GoldRate[];
  cityName: string;
}) {
  const today = history[0] ?? null;
  const yesterday = history[1] ?? null;
  const cityData = getCityData(cityName);

  const change18k =
    today && yesterday ? today.rate_18k_1g - yesterday.rate_18k_1g : null;
  const change22k =
    today && yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : null;
  const change24k =
    today && yesterday ? today.rate_24k_1g - yesterday.rate_24k_1g : null;
  const changeSilver =
    today?.rate_silver_1g && yesterday?.rate_silver_1g
      ? today.rate_silver_1g - yesterday.rate_silver_1g
      : null;
  const chartData = [...history].reverse();

  const citySlug = cityName.toLowerCase() === "kochi" ? "" : `/${cityName.toLowerCase()}`;
  const pageUrl = `https://www.livegoldkerala.com${citySlug}`;
  const priceValidUntil = today
    ? new Date(new Date(today.date + "T00:00:00").getTime() + 86400000).toISOString().slice(0, 10)
    : "";

  const productJsonLd = today
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: `22K Gold Rate in ${cityName}, Kerala`,
        description: `Today's 22 Karat (916) gold rate per gram and per pavan (8g) in ${cityName}, Kerala. Updated daily at 10:15 AM IST.`,
        image: "https://www.livegoldkerala.com/opengraph-image",
        brand: { "@type": "Brand", name: "Live Gold Kerala" },
        offers: {
          "@type": "Offer",
          url: pageUrl,
          priceCurrency: "INR",
          price: today.rate_22k_1g.toFixed(2),
          priceValidUntil,
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "Live Gold Kerala", url: "https://www.livegoldkerala.com" },
        },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Purity", value: "22K (916 Hallmark)" },
          { "@type": "PropertyValue", name: "Price per Pavan (8g)", value: `₹${(today.rate_22k_1g * 8).toLocaleString("en-IN")}` },
          { "@type": "PropertyValue", name: "24K Rate per Gram", value: `₹${today.rate_24k_1g.toLocaleString("en-IN")}` },
          { "@type": "PropertyValue", name: "18K Rate per Gram", value: `₹${today.rate_18k_1g.toLocaleString("en-IN")}` },
        ],
        dateModified: `${today.date}T10:15:00+05:30`,
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.livegoldkerala.com" },
      { "@type": "ListItem", position: 2, name: "Gold Rate Kerala", item: "https://www.livegoldkerala.com" },
      ...(cityName.toLowerCase() !== "kochi"
        ? [{ "@type": "ListItem", position: 3, name: `Gold Rate ${cityName}`, item: pageUrl }]
        : []),
    ],
  };

  return (
    <>
      {productJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* Premium sticky header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">✨</span>
            <div>
              <p className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg">
                LiveGold{" "}
                <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                  Kerala
                </span>
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                {cityName} · Realtime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-green-200 bg-green-50/80 px-3 py-1.5 dark:border-green-900/50 dark:bg-green-950/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                Live Updates
              </span>
            </div>
            <NotificationToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Top Ticker - highly integrated below header */}
      {today && <TopTicker history={history} cityName={cityName} />}

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-3 md:gap-8 md:py-10">
        {today ? (
          <>
            {/* Hero: trust badge + date -> Squished aggressively for mobile */}
            <section className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <svg
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 dark:text-emerald-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Verified Kerala Board Rate
                </span>
              </div>
              <h1 className="mt-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:mt-4 md:text-3xl">
                Today&apos;s Gold Rate in {cityName}
              </h1>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 md:mt-1 md:text-sm">
                <time dateTime={`${today.date}T10:15:00+05:30`}>{formatDate(today.date)}</time> · Updated 10:15 AM IST · {cityName}
              </p>
              {cityName !== "Kochi" && (
                <p className="mt-2 flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/60 px-3 py-1 text-[11px] text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400">
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Kerala gold rate is uniform across all districts (Kerala Board Rate)
                </p>
              )}
            </section>

            {/* Pending rates notice (hidden once today's data arrives) */}
            <RatesPendingBanner latestDate={today.date} />

            {/* AI Trend Analysis Pill */}
            <div className="flex justify-center md:justify-start">
              <TrendAnalysisIndicator history={history} />
            </div>

            {/* Rate Cards: Hero 22K + split 24K/18K */}
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {/* 22K hero — full width on mobile, first col on desktop */}
              <RateCard
                label="22 Karat Gold"
                purity="916 Hallmark"
                ratePerGram={today.rate_22k_1g}
                change={change22k}
                pavanRate={today.rate_22k_1g * 8}
                featured
              />
              {/* 24K & 18K side-by-side on mobile */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:contents">
                <RateCard
                  label="24 Karat Gold"
                  purity="999 Fine"
                  ratePerGram={today.rate_24k_1g}
                  change={change24k}
                  pavanRate={today.rate_24k_1g * 8}
                  compact
                />
                <RateCard
                  label="18 Karat Gold"
                  purity="750"
                  ratePerGram={today.rate_18k_1g}
                  change={change18k}
                  pavanRate={today.rate_18k_1g * 8}
                  compact
                />
              </div>
            </div>

            {/* Silver Rate Card */}
            {today.rate_silver_1g && (
              <SilverRateCard
                ratePerGram={today.rate_silver_1g}
                change={changeSilver}
              />
            )}

            {/* WhatsApp viral share button */}
            {change22k !== null && (
              <WhatsAppShare
                currentRate22k={today.rate_22k_1g}
                priceChange={change22k}
              />
            )}

            {/* CTA Banner — drives scroll to calculator */}
            <CtaBanner />

            {/* Price Chart */}
            <PriceChart history={chartData} />

            {/* Old Gold Calculator Component */}
            <OldGoldCalculator 
              rate18k={today.rate_18k_1g} 
              rate22k={today.rate_22k_1g} 
            />

            {/* Gold Calculator Component */}
            <div id="estimator-section">
              <GoldCalculator
                rate18k={today.rate_18k_1g}
                rate22k={today.rate_22k_1g}
                rate24k={today.rate_24k_1g}
              />
            </div>

            {/* Price Drop Alert — only visible to push-subscribed users */}
            <PriceAlertInput currentRate={today.rate_22k_1g} />

            {/* Internal links to dedicated tool pages */}
            <p className="text-center text-sm text-zinc-500">
              Need a detailed breakdown? Try our dedicated{" "}
              <Link
                href="/tools/gold-making-charge-calculator"
                className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 transition-colors hover:text-amber-900 hover:decoration-amber-500"
              >
                Making Charge Calculator
              </Link>
              ,{" "}
              <Link
                href="/tools/old-gold-exchange-calculator"
                className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 transition-colors hover:text-amber-900 hover:decoration-amber-500"
              >
                Old Gold Exchange Estimator
              </Link>
              , or our new{" "}
              <Link
                href="/tools/gold-import-duty-calculator"
                className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 transition-colors hover:text-amber-900 hover:decoration-amber-500"
              >
                NRI Import Duty Calculator
              </Link>
              .
            </p>

            {/* Today vs. Yesterday multi-weight comparison */}
            <TodayVsYesterday today={today} yesterday={yesterday} />

            {/* History Table */}
            <HistoryTable history={history} />
          </>
        ) : (
          <EmptyState />
        )}

        {/* City Insight & Standardisation Notice */}
        {cityData ? (
          <div className="rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-white p-5 text-left shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 md:text-base">
              <svg className="h-4 w-4 md:h-5 md:w-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              {cityData.insightTitle}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-sm">
              {cityData.insightContent}
            </p>
            <p className="mt-3 border-t border-amber-100/60 pt-2 text-[10px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-500 sm:text-xs">
              * Gold rates in Kerala are standardised across all districts by the Kerala Gold &amp; Silver Merchants Association. The daily board rate applies equally to {cityName}.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-4 text-center dark:border-zinc-800/50 dark:bg-zinc-900/30">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 md:text-sm">
              * Gold rates in Kerala are standardised across all districts by the Kerala Gold &amp; Silver Merchants Association.
            </p>
          </div>
        )}

        {/* FAQ — perfectly localised per city for SEO uniqueness and crawling priority */}
        <FAQ cityName={cityName} />
      </main>

      {/* FOOTER & INTERNAL CRAWLER LINKS FOR programmatic SEO */}
      <footer className="border-t border-zinc-200/60 bg-white/50 pt-8 pb-12 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8 rounded-2xl bg-zinc-50/50 p-6 text-center shadow-inner dark:bg-zinc-900/50 dark:shadow-none">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Check Daily Rates Around Kerala
            </h3>
            <ul className="flex flex-wrap justify-center gap-2 md:gap-3">
              <li>
                <Link
                  href="/"
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    cityName === "Kochi"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                      : "bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800 dark:hover:bg-zinc-800"
                  }`}
                >
                  Kochi
                </Link>
              </li>
              {KERALA_CITIES.map((c) => {
                const formattedName = c.charAt(0).toUpperCase() + c.slice(1);
                const isActive = cityName.toLowerCase() === c;
                return (
                  <li key={c}>
                    <Link
                      href={`/${c}`}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                          : "bg-white text-zinc-600 shadow-sm ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {formattedName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            <Link
              href="/tools/gold-making-charge-calculator"
              className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Tool</p>
              <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Making Charge Calculator</p>
            </Link>
            <Link
              href="/tools/old-gold-exchange-calculator"
              className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Tool</p>
              <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Old Gold Exchange Estimator</p>
            </Link>
            <Link
              href="/tools/gold-import-duty-calculator"
              className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Tool</p>
              <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">NRI Import Duty Calculator</p>
            </Link>
            <Link
              href="/blog"
              className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Learn</p>
              <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Gold Knowledge Hub</p>
            </Link>
            <Link
              href="/silver-rate-kerala"
              className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rates</p>
              <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Silver Rate Kerala</p>
            </Link>
          </div>

          <div className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            <p className="font-medium">
              Data sourced from Malabar Gold &amp; Diamonds · For reference only
            </p>
            <p className="mt-1.5">
              © 2026 LiveGold Kerala ·{" "}
              <Link href="/about" className="hover:text-zinc-600 dark:hover:text-zinc-300">About</Link>{" "}·{" "}
              <Link href="/contact" className="hover:text-zinc-600 dark:hover:text-zinc-300">Contact</Link>{" "}·{" "}
              <Link href="/privacy" className="hover:text-zinc-600 dark:hover:text-zinc-300">Privacy</Link>{" "}·{" "}
              <Link href="/terms" className="hover:text-zinc-600 dark:hover:text-zinc-300">Terms</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function RateCard({
  label,
  purity,
  ratePerGram,
  change,
  pavanRate,
  featured = false,
  compact = false,
}: {
  label: string;
  purity: string;
  ratePerGram: number;
  change: number | null;
  pavanRate?: number;
  featured?: boolean;
  compact?: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900 transition-all hover:-translate-y-0.5 ${
        compact ? "p-4 md:p-5 lg:p-6" : "p-5 md:p-6"
      } ${
        featured
          ? "border-amber-300 ring-2 ring-amber-400/50 shadow-xl shadow-amber-300/40 hover:shadow-2xl hover:shadow-amber-400/50 dark:border-amber-500/50 dark:shadow-amber-900/20"
          : "border-zinc-200/70 shadow-md shadow-amber-100/40 hover:shadow-lg hover:shadow-amber-200/50 dark:border-zinc-800 dark:shadow-none dark:hover:border-zinc-700"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${
          featured
            ? "bg-gradient-to-br from-amber-300/50 to-transparent dark:from-amber-600/20"
            : "bg-gradient-to-br from-amber-200/30 to-transparent dark:from-zinc-800/80"
        }`}
      />

      <div className="relative">
        <div className="mb-2 flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between">
          <p className={`font-semibold text-zinc-800 dark:text-zinc-200 ${compact ? "text-sm" : "text-base"}`}>{label}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {featured && (
              <span className="shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm ring-1 ring-inset ring-amber-600/30">
                ★ Popular
              </span>
            )}
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                featured
                  ? "bg-amber-100 text-amber-800 ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-500/40"
                  : "bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
              }`}
            >
              {purity}
            </span>
          </div>
        </div>

        <p
          className={`bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text font-bold tracking-tight text-transparent ${
            compact
              ? "mt-2 text-2xl md:text-3xl"
              : "mt-2 text-3xl md:text-4xl"
          }`}
        >
          {formatCurrency(ratePerGram)}
        </p>
        
        {pavanRate && (
          <p className="mt-0.5 text-[11px] font-medium text-zinc-400">
            ({formatCurrency(pavanRate)} per Pavan)
          </p>
        )}

        <div className={`flex items-center justify-between ${compact ? "mt-2" : "mt-2 sm:mt-3"}`}>
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-zinc-400">
            per gram
          </span>
          {change !== null && <ChangeBadge change={change} />}
        </div>

      </div>
    </article>
  );
}

function ChangeBadge({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-[11px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        No change
      </span>
    );
  }
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-[11px] font-semibold ring-1 ring-inset ${
        up
          ? "bg-red-50 text-red-600 ring-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50"
          : "bg-green-50 text-green-600 ring-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50"
      }`}
    >
      {up ? "\u25B2" : "\u25BC"} {up ? "+" : ""}
      {change.toLocaleString("en-IN")}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200/70 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-12 text-center shadow-lg shadow-amber-100/30 dark:shadow-none">
      <div className="rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 p-4 shadow-inner dark:shadow-none">
        <svg
          className="h-8 w-8 text-amber-700"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Rates coming soon</h2>
      <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
        Gold rates will appear here once the first data update runs. Check back
        shortly!
      </p>
    </div>
  );
}
