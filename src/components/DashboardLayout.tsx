import React from "react";
import Link from "next/link";
import PriceChart from "@/components/PriceChart";
import HistoryTable from "@/components/HistoryTable";
import FAQ from "@/components/FAQ";
import TodayVsYesterday from "@/components/TodayVsYesterday";
import TopTicker from "@/components/TopTicker";
import SpotGoldTicker from "@/components/SpotGoldTicker";
import EmailAlertForm from "@/components/EmailAlertForm";
import AffiliateOffers from "@/components/AffiliateOffers";
import GoldCalculator from "@/components/GoldCalculator";
import OldGoldCalculator from "@/components/OldGoldCalculator";
import CtaBanner from "@/components/CtaBanner";
import RatesPendingBanner from "@/components/RatesPendingBanner";
import WhatsAppShare from "@/components/WhatsAppShare";
import WhatsAppFollow from "@/components/WhatsAppFollow";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationToggle from "@/components/NotificationToggle";
import PriceAlertInput from "@/components/PriceAlertInput";
import SilverRateCard from "@/components/SilverRateCard";
import ExchangeTicker from "@/components/ExchangeTicker";
import { RateCard, RateBoard } from "@/components/RateCards";
import { VerdictDot } from "@/components/VerdictPill";
import { GoldRate } from "@/lib/types";
import { getCityData, getCityTowns } from "@/lib/cityData";
import { getAllPosts } from "@/lib/mdx";

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
  "calicut",
  "thrissur",
  "kollam",
  "palakkad",
  "kannur",
  "alappuzha",
  "kottayam",
  "malappuram",
  "pathanamthitta",
  "idukki",
  "wayanad",
  "kasaragod",
];

async function getRecentNewsWithVerdicts(limit = 3) {
  const { createSupabaseReadClient } = await import("@/lib/supabase");
  const { computeStats } = await import("@/lib/commentary");
  const { computeVerdict } = await import("@/lib/verdict");
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g, rate_silver_1g")
    .eq("city", "Kochi")
    .order("date", { ascending: false })
    .limit(30);
  const all = (data ?? []) as GoldRate[];
  return all.slice(0, limit).map((row, i) => {
    const window = all.slice(i, i + 30);
    const stats = window.length >= 5 ? computeStats(window) : null;
    const verdict = stats ? computeVerdict(stats) : null;
    return { date: row.date, rate22k: row.rate_22k_1g, verdict };
  });
}

export default async function DashboardLayout({
  history,
  cityName,
  displayName,
}: {
  history: GoldRate[];
  cityName: string;
  /** Region label shown in the H1/headings. Defaults to cityName; the homepage
   *  passes "Kerala" so it claims the high-volume Kerala head terms while still
   *  using Kochi as the reference data city. */
  displayName?: string;
}) {
  const region = displayName ?? cityName;
  const today = history[0] ?? null;
  const yesterday = history[1] ?? null;
  const cityData = getCityData(cityName);
  const cityTowns = getCityTowns(cityName);
  const recentNewsEntries = await getRecentNewsWithVerdicts(3);

  const rate21k = today ? today.rate_22k_1g * (21 / 22) : 0;
  const yesterday21k = yesterday ? yesterday.rate_22k_1g * (21 / 22) : null;

  const change18k =
    today && yesterday ? today.rate_18k_1g - yesterday.rate_18k_1g : null;
  const change21k =
    today && yesterday21k !== null ? rate21k - yesterday21k : null;
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
        description: `Today's 22 Karat (916) gold rate per gram and per pavan (8g) in ${cityName}, Kerala. Updated daily at 10:00 AM IST.`,
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
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "IN",
            returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted"
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: 0,
              currency: "INR"
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "IN"
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 0,
                unitCode: "DAY"
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 0,
                maxValue: 0,
                unitCode: "DAY"
              }
            }
          }
        },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Purity", value: "22K (916 Hallmark)" },
          { "@type": "PropertyValue", name: "Price per Pavan (8g)", value: `₹${(today.rate_22k_1g * 8).toLocaleString("en-IN")}` },
          { "@type": "PropertyValue", name: "24K Rate per Gram", value: `₹${today.rate_24k_1g.toLocaleString("en-IN")}` },
          { "@type": "PropertyValue", name: "21K Rate per Gram", value: `₹${Math.round(today.rate_22k_1g * 21 / 22).toLocaleString("en-IN")}` },
          { "@type": "PropertyValue", name: "18K Rate per Gram", value: `₹${today.rate_18k_1g.toLocaleString("en-IN")}` },
        ],
        dateModified: `${today.date}T10:00:00+05:30`,
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
      {/* Page action bar — page-specific actions only; site brand lives in SiteNav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center justify-end gap-3 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <a
              href="/api/og/gold-rate-card"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 shadow-sm transition-colors hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-900/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Share
            </a>
            <NotificationToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Below xl this is a single centered column (mobile/laptop unchanged).
          At xl it becomes a 3-col grid: the primary funnel keeps its tuned
          ~2/3 width and the secondary rail fills the previously-empty space. */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-3 md:gap-8 md:py-10 xl:grid xl:max-w-6xl xl:grid-cols-3 xl:items-start xl:gap-8">
        <div className="flex flex-col gap-4 md:gap-8 xl:col-span-2">
        {today ? (
          <>
            {/* Hero: trust badge + date -> Squished aggressively for mobile */}
            <section className="animate-rise flex flex-col items-center text-center">
              <div className="pulse-glow inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 sm:px-3 sm:py-1 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
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
              <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:mt-4 md:text-3xl">
                Today&apos;s Gold Rate in {region}
              </h1>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 md:mt-1 md:text-sm">
                <time dateTime={`${today.date}T10:00:00+05:30`}>{formatDate(today.date)}</time> · Updated by 10 AM IST · {region}
              </p>
              {/* At-a-glance daily trend signal — the "reason to come back" cue */}
              {change22k !== null && yesterday && (
                <p
                  className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                    change22k > 0
                      ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
                      : change22k < 0
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400"
                  }`}
                >
                  <span aria-hidden>{change22k > 0 ? "▲" : change22k < 0 ? "▼" : "—"}</span>
                  {change22k === 0
                    ? "No change since yesterday"
                    : `${change22k > 0 ? "Up" : "Down"} ₹${Math.abs(change22k).toLocaleString("en-IN")}/g (22K) since yesterday · ${((Math.abs(change22k) / yesterday.rate_22k_1g) * 100).toFixed(2)}%`}
                </p>
              )}
            </section>

            {/* Rate Cards: 22K hero + rate board — lead with the number users came for,
                so today's rate is the first thing visible above the fold on mobile. */}
            <div className="animate-rise animate-rise-1 flex flex-col gap-3 sm:gap-4">
              <RateCard
                label="22 Karat Gold"
                purity="916 Hallmark"
                ratePerGram={today.rate_22k_1g}
                change={change22k}
                pavanRate={today.rate_22k_1g * 8}
                featured
                animate
              />
              <RateBoard
                rows={[
                  { label: "24 Karat", purity: "999 Fine", ratePerGram: today.rate_24k_1g, pavanRate: today.rate_24k_1g * 8, change: change24k },
                  { label: "21 Karat", purity: "875 · Gulf imports", ratePerGram: rate21k, pavanRate: rate21k * 8, change: change21k },
                  { label: "18 Karat", purity: "750", ratePerGram: today.rate_18k_1g, pavanRate: today.rate_18k_1g * 8, change: change18k },
                ]}
              />
            </div>

            {/* Data-trust note — explains the 24K derivation so it doesn't look "wrong" vs aggregators */}
            <p className="-mt-1 text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
              22K &amp; 18K are the official AKGSMA Kerala board rates. 24K is derived from the 916 rate by purity (22K&nbsp;&times;&nbsp;24&frasl;22), reflecting pure-gold value.
            </p>

            {/* Price Trend chart — surfaced high, right under today's rate. */}
            <PriceChart history={chartData} />

            {/* Live international spot price — adds "live market" freshness, clearly
                distinct from the once-daily board rate. */}
            <SpotGoldTicker />

            {/* City-specific market overview — surfaces unique, keyword-relevant content
                HIGH on city pages (the homepage uses the Kerala framing instead). This is
                what lifts city pages out of the duplicate-content trap. */}
            {cityName !== "Kochi" && cityData && (
              <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
                <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-lg">
                  Gold Rate in {cityName} Today — {cityData.insightTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {cityData.insightContent}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Today&apos;s 22K (916 hallmark) gold rate in {cityName} is ₹{today.rate_22k_1g.toLocaleString("en-IN")} per
                  gram — that&apos;s ₹{(today.rate_22k_1g * 8).toLocaleString("en-IN")} per pavan (8&nbsp;g) — with 24K at
                  ₹{today.rate_24k_1g.toLocaleString("en-IN")} per gram. These are the official Kerala Gold &amp; Silver
                  Merchants Association board rates, which apply uniformly across {cityName} and the rest of Kerala.
                </p>
                {cityTowns.length > 0 && (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    The same board rate applies right across {cityName} district, so the gold rate today
                    in {cityTowns.slice(0, -1).join(", ")} and {cityTowns[cityTowns.length - 1]} is the
                    same {cityName} rate of ₹{today.rate_22k_1g.toLocaleString("en-IN")}/g for 22K shown
                    above — there is no separate town-wise gold rate in Kerala.
                  </p>
                )}
              </section>
            )}

            {/* Pending rates notice (hidden once today's data arrives) — below the rate
                so users see the number first, then the "yesterday's rate" caveat. */}
            <RatesPendingBanner latestDate={today.date} />

            {/* Silver Rate Card */}
            {today.rate_silver_1g && (
              <SilverRateCard
                ratePerGram={today.rate_silver_1g}
                change={changeSilver}
              />
            )}

            {/* Today vs. Yesterday multi-weight comparison — directly under rate cards */}
            <TodayVsYesterday today={today} yesterday={yesterday} />

            {/* Live Exchange Rate Ticker — USD/AED/QAR/OMR to INR */}
            <ExchangeTicker />

            {/* Share today's rate — WhatsApp text + Image download in one card */}
            {change22k !== null && (
              <section className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none md:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Share today&apos;s rate
                  </p>
                  <p className="hidden text-[10px] text-zinc-400 sm:block">
                    WhatsApp · Instagram · anywhere
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <WhatsAppShare
                    currentRate22k={today.rate_22k_1g}
                    priceChange={change22k}
                  />
                  <a
                    href="/api/og/gold-rate-card"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-3 text-sm font-semibold text-amber-800 shadow-sm transition-all hover:bg-amber-100/70 hover:border-amber-300 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Rate Card
                  </a>
                </div>
              </section>
            )}

            {/* Follow on WhatsApp — daily-rate retention loop (renders only when configured) */}
            <WhatsAppFollow />

            {/* CTA Banner — drives scroll to calculator */}
            <CtaBanner />

            {/* Month High/Low — secondary context, moved down from the top so the
                page leads with today's rate, not month extremes. */}
            {today && <TopTicker history={history} cityName={cityName} />}

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

            {/* Email price alert — universal channel (works without push permission) */}
            <EmailAlertForm currentRate={today.rate_22k_1g} />

            {/* Affiliate / lead-gen offers — env-gated, renders only when configured */}
            <AffiliateOffers />

            {/* History Table */}
            <HistoryTable history={history} />
          </>
        ) : (
          <EmptyState />
        )}
        </div>

        {/* Secondary rail — daily updates, articles, trust note & FAQ.
            Below xl it stacks under the primary funnel (mobile order unchanged);
            at xl it becomes a sticky sidebar that fills the desktop width. */}
        <aside className="flex flex-col gap-4 md:gap-8 xl:col-span-1 xl:sticky xl:top-24 xl:self-start">

        {/* Daily news section — fresh-content signal for SEO */}
        <RecentDailyUpdates entries={recentNewsEntries} />

        {/* Blog links — direct crawl path from indexed homepage to blog articles */}
        <RecentArticles />

        {/* Insight & Standardisation Notice. The rich block is homepage-only — city
            pages now carry their unique overview HIGH in the primary column, so here
            they get the lighter standardisation note (no duplicate content). */}
        {cityName === "Kochi" && cityData ? (
          <div className="rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-white p-5 text-left shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900/50">
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 md:text-base">
              <svg className="h-4 w-4 md:h-5 md:w-5 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              {cityData.insightTitle}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-sm">
              {cityData.insightContent}
            </p>
            <p className="mt-3 border-t border-amber-100/60 pt-2 text-[10px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-500 sm:text-xs">
              * Gold rates in Kerala are standardised across all districts by the Kerala Gold &amp; Silver Merchants Association. The daily board rate applies equally to {region}.
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
        <FAQ cityName={region} />
        </aside>
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

          <div className="mb-8">
            <h3 className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              Popular
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Link
                href="/tools/gold-making-charge-calculator"
                className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Tool</p>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Making Charge Calculator</p>
              </Link>
              <Link
                href="/tools/gold-import-duty-calculator"
                className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Tool</p>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">NRI Import Duty Calculator</p>
              </Link>
              <Link
                href="/silver-rate-kerala"
                className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rates</p>
                <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Silver Rate Kerala</p>
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-zinc-400 dark:text-zinc-500">
            <p className="font-medium">
              AKGSMA · For reference only
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


function RecentDailyUpdates({
  entries,
}: {
  entries: { date: string; rate22k: number; verdict: import("@/lib/verdict").Verdict | null }[];
}) {
  if (entries.length === 0) return null;
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Daily Market Updates
        </h2>
        <Link
          href="/news"
          className="text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
        >
          All updates →
        </Link>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {entries.map((e) => (
          <Link
            key={e.date}
            href={`/news/${e.date}`}
            className="group rounded-xl border border-zinc-200/60 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {new Date(e.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              {e.verdict && <VerdictDot verdict={e.verdict} />}
            </div>
            <p className="mt-0.5 text-sm font-semibold leading-snug text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
              22K at ₹{e.rate22k.toLocaleString("en-IN")}/g
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {e.verdict ? e.verdict.headline : "Daily update"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function RecentArticles() {
  const posts = getAllPosts().slice(0, 4);
  if (posts.length === 0) return null;
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          From the Blog
        </h2>
        <Link
          href="/blog"
          className="text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
        >
          All articles →
        </Link>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-zinc-200/60 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              {new Date(post.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-snug text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
              {post.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
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
