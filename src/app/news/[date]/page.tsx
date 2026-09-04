import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { GoldRate } from "@/lib/types";
import { computeStats, generateCommentary } from "@/lib/commentary";
import { computeVerdict } from "@/lib/verdict";
import { formatCurrency } from "@/lib/format";
import { VerdictPill } from "@/components/VerdictPill";
import { RangeBar } from "@/components/RangeBar";
import { NewsSparkline } from "@/components/NewsSparkline";
import { RateCard, RateBoard } from "@/components/RateCards";
import RelatedTools from "@/components/RelatedTools";

export const revalidate = 86400; // daily; freshness pushed on-demand by the update-rates cron (revalidatePath)

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const MONTH_SLUGS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/** URL of the month-archive page that owns any given calendar date. */
function monthArchiveUrl(date: string): string {
  const d = new Date(date + "T00:00:00Z");
  return `/gold-rate-history/${d.getUTCFullYear()}/${MONTH_SLUGS[d.getUTCMonth()]}`;
}

type DayResolution =
  | { kind: "ok"; today: GoldRate; history: GoldRate[] }
  | { kind: "backfill"; redirectTo: string }
  | { kind: "missing" };

/**
 * Resolves what should happen at /news/{date}:
 * - "ok"       → render the daily commentary
 * - "backfill" → 301 to the month archive; those dates are calibrated
 *                estimates, not real board rates, and never had a real
 *                daily-update page. Redirecting (rather than 404-ing) tells
 *                Google the URL moved, so it stops re-crawling forever.
 * - "missing"  → 404
 */
async function resolveDay(date: string): Promise<DayResolution> {
  if (!ISO_DATE.test(date)) return { kind: "missing" };
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("daily_gold_rates")
    .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g, rate_silver_1g, consensus_sources")
    .eq("city", "Kochi")
    .lte("date", date)
    .order("date", { ascending: false })
    .limit(31);
  if (error || !data || data.length === 0 || data[0].date !== date) return { kind: "missing" };
  if ((data[0] as { consensus_sources?: string | null }).consensus_sources === "backfill-yahoo-calibrated") {
    return { kind: "backfill", redirectTo: monthArchiveUrl(date) };
  }
  return { kind: "ok", today: data[0] as GoldRate, history: data as GoldRate[] };
}


async function getNeighbours(
  date: string
): Promise<{ prev: string | null; next: string | null }> {
  const supabase = createSupabaseReadClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("daily_gold_rates")
      .select("date")
      .eq("city", "Kochi")
      .lt("date", date)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("daily_gold_rates")
      .select("date")
      .eq("city", "Kochi")
      .gt("date", date)
      .order("date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data?.date ?? null,
    next: nextRes.data?.date ?? null,
  };
}

export async function generateStaticParams() {
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date")
    .eq("city", "Kochi")
    // Real board-rate dates only — estimated backfill lives in the year pages.
    .neq("consensus_sources", "backfill-yahoo-calibrated");
  return (data ?? []).map((row: { date: string }) => ({ date: row.date }));
}

function formatLongDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// A daily update is indexable only while it's among the most-recent board-rate
// dates — the SAME window the sitemap submits (see src/app/sitemap.ts, which
// keeps newsDates.slice(-30)). Older snapshots are thin/templated, so Google
// crawls-but-won't-index them and they pile up in GSC's "Crawled - currently
// not indexed" bucket. noindex-ing them moves them to the intentional
// "Excluded by noindex" state and concentrates crawl budget on fresh pages.
// Kept follow:true so any link equity still flows. Mirroring the sitemap's
// exact cutoff guarantees no page is ever both in-sitemap and noindexed.
const RECENT_NEWS_WINDOW = 30;

async function getRecentNewsCutoff(): Promise<string | null> {
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date")
    .eq("city", "Kochi")
    .neq("consensus_sources", "backfill-yahoo-calibrated")
    .order("date", { ascending: false })
    .limit(RECENT_NEWS_WINDOW);
  const rows = data ?? [];
  // Oldest of the most-recent N dates = the indexing cutoff.
  return rows.length > 0 ? (rows[rows.length - 1].date as string) : null;
}

type RouteParams = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { date } = await params;
  const r = await resolveDay(date);
  if (r.kind === "backfill") permanentRedirect(r.redirectTo);
  if (r.kind === "missing") {
    return { title: "Daily Update Not Found", robots: { index: false } };
  }
  const { today } = r;
  const longDate = formatLongDate(today.date);
  const title = `Kerala Gold Rate on ${longDate}: 22K at ₹${today.rate_22k_1g.toLocaleString("en-IN")}/g`;
  const description = `Kerala gold rate on ${longDate}: 22K at ₹${today.rate_22k_1g}/g (₹${(today.rate_22k_1g * 8).toLocaleString("en-IN")}/pavan), 24K at ₹${today.rate_24k_1g}/g. Daily commentary and trend context.`;

  // Noindex daily snapshots older than the sitemap's recent window (thin/
  // templated pages that otherwise clog "Crawled - not indexed").
  const cutoff = await getRecentNewsCutoff();
  const isRecent = !cutoff || today.date >= cutoff;

  return {
    title,
    description,
    alternates: { canonical: `/news/${today.date}` },
    openGraph: { title, description, type: "article" },
    ...(isRecent ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function NewsDay({ params }: RouteParams) {
  const { date } = await params;
  const r = await resolveDay(date);
  if (r.kind === "backfill") permanentRedirect(r.redirectTo);
  if (r.kind === "missing") notFound();

  const { today, history } = r;
  const stats = computeStats(history);
  const paragraphs = generateCommentary(stats);
  const verdict = computeVerdict(stats);
  const { prev, next } = await getNeighbours(today.date);

  const longDate = formatLongDate(today.date);
  const pavan22k = today.rate_22k_1g * 8;
  const rate21k = today.rate_22k_1g * (21 / 22);
  const yest = stats.yesterday;
  const change18k = yest ? today.rate_18k_1g - yest.rate_18k_1g : null;
  const change21k = yest ? rate21k - yest.rate_22k_1g * (21 / 22) : null;
  const change24k = yest ? today.rate_24k_1g - yest.rate_24k_1g : null;

  const sparklineData = [...history]
    .slice(0, 30)
    .reverse()
    .map((r) => ({ date: r.date, rate: r.rate_22k_1g }));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: `Kerala Gold Rate on ${longDate}`,
    datePublished: `${today.date}T10:30:00+05:30`,
    dateModified: `${today.date}T10:30:00+05:30`,
    author: { "@type": "Organization", name: "Live Gold Kerala" },
    publisher: {
      "@type": "Organization",
      name: "Live Gold Kerala",
      url: "https://www.livegoldkerala.com",
    },
    mainEntityOfPage: `https://www.livegoldkerala.com/news/${today.date}`,
    image: [
      {
        "@type": "ImageObject",
        url: "https://www.livegoldkerala.com/opengraph-image",
        width: 1200,
        height: 630,
      },
    ],
    description: `Kerala gold rate on ${longDate}: 22K at ₹${today.rate_22k_1g}/g (₹${(today.rate_22k_1g * 8).toLocaleString("en-IN")}/pavan), 24K at ₹${today.rate_24k_1g}/g. Daily commentary and trend context.`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.livegoldkerala.com" },
      { "@type": "ListItem", position: 2, name: "Daily Updates", item: "https://www.livegoldkerala.com/news" },
      {
        "@type": "ListItem",
        position: 3,
        name: longDate,
        item: `https://www.livegoldkerala.com/news/${today.date}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 md:gap-7 md:py-10">
        {/* Trust + breadcrumb */}
        <div className="flex flex-col items-start gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <svg className="h-3 w-3 text-emerald-600 dark:text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              Verified Kerala Board Rate
            </span>
          </span>
          <nav className="text-[11px] text-zinc-500">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/news" className="hover:underline">Daily Updates</Link>
            <span className="mx-1">/</span>
            <span>{longDate}</span>
          </nav>
        </div>

        {/* H1 + verdict */}
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Kerala Gold Rate on {longDate}
          </h1>
          {verdict && <VerdictPill verdict={verdict} size="lg" />}
        </header>

        {/* Range bar */}
        {stats.monthHigh !== null && stats.monthLow !== null && (
          <section className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none md:p-5">
            <RangeBar
              low={stats.monthLow}
              high={stats.monthHigh}
              current={today.rate_22k_1g}
              label="30-day range — 22K"
            />
          </section>
        )}

        {/* Rate cards — homepage style */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <RateCard
            label="22 Karat Gold"
            purity="916 Hallmark"
            ratePerGram={today.rate_22k_1g}
            change={stats.change22k}
            pavanRate={pavan22k}
            featured
          />
          <RateBoard
            rows={[
              { label: "24 Karat", purity: "999 Fine", ratePerGram: today.rate_24k_1g, pavanRate: today.rate_24k_1g * 8, change: change24k },
              { label: "21 Karat", purity: "875 · Gulf imports", ratePerGram: rate21k, pavanRate: rate21k * 8, change: change21k },
              { label: "18 Karat", purity: "750", ratePerGram: today.rate_18k_1g, pavanRate: today.rate_18k_1g * 8, change: change18k },
            ]}
          />
        </div>

        {/* Sparkline + 7-day summary */}
        {stats.weekHigh !== null && (
          <section className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                30-day trend — 22K
              </p>
            </div>
            <div className="px-5 pt-4">
              <NewsSparkline data={sparklineData} highlightDate={today.date} height={140} />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-5 pb-5 pt-3 text-xs sm:grid-cols-4">
              <SummaryStat label="7-day high" value={formatCurrency(stats.weekHigh)} />
              <SummaryStat label="7-day low" value={formatCurrency(stats.weekLow!)} />
              <SummaryStat label="7-day avg" value={formatCurrency(stats.weekAvg!)} />
              <SummaryStat
                label="7-day net"
                value={
                  stats.weekNetChange !== null
                    ? (stats.weekNetChange > 0 ? "+" : "") + stats.weekNetChange.toFixed(0)
                    : "—"
                }
              />
            </div>
          </section>
        )}

        {/* Commentary with drop cap */}
        <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none md:p-6">
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Market commentary
          </h2>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 ${
                i === 1
                  ? "mt-3 first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-black first-letter:leading-[0.85] first-letter:text-amber-600 dark:first-letter:text-amber-400"
                  : "mt-3"
              } ${i === 0 ? "font-medium text-zinc-800 dark:text-zinc-200" : ""}`}
            >
              {p}
            </p>
          ))}
        </section>

        {/* Prev/next as cards */}
        <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {prev ? <NavCard direction="prev" date={prev} /> : <div />}
          {next ? <NavCard direction="next" date={next} /> : <div />}
        </nav>

        <RelatedTools heading="Gold tools & guides" />

        {/* CTA + internal links — these daily pages rank well, so they pass
            authority to the city pages and money guides linked from here. */}
        <section className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md shadow-amber-200/40 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900 dark:shadow-none">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            See today&apos;s live rate on the{" "}
            <Link href="/" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              homepage
            </Link>{" "}
            · try the{" "}
            <Link href="/tools/gold-making-charge-calculator" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              making charge calculator
            </Link>{" "}
            · read about{" "}
            <Link href="/blog/gold-tax-gst-kerala-2026" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              gold tax &amp; GST in Kerala
            </Link>{" "}
            · or browse the full{" "}
            <Link href="/news" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              daily archive
            </Link>
            .
          </p>
          <p className="mt-3 border-t border-amber-200/50 pt-3 text-xs text-zinc-500 dark:border-amber-900/30 dark:text-zinc-400">
            Gold rate by city:{" "}
            {[
              ["Kozhikode", "/kozhikode"],
              ["Thrissur", "/thrissur"],
              ["Ernakulam", "/ernakulam"],
              ["Trivandrum", "/trivandrum"],
              ["Kollam", "/kollam"],
            ].map(([name, href], i) => (
              <span key={href}>
                {i > 0 && " · "}
                <Link href={href} className="font-medium text-amber-700 hover:underline dark:text-amber-400">
                  {name}
                </Link>
              </span>
            ))}
          </p>
        </section>
      </main>
    </>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-zinc-800 dark:text-zinc-200">
        {value}
      </p>
    </div>
  );
}

async function NavCard({ direction, date }: { direction: "prev" | "next"; date: string }) {
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("rate_22k_1g")
    .eq("city", "Kochi")
    .eq("date", date)
    .maybeSingle();
  const rate = (data?.rate_22k_1g ?? null) as number | null;
  const shortDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return (
    <Link
      href={`/news/${date}`}
      className={`group flex items-center justify-between gap-3 rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40 ${
        direction === "next" ? "sm:text-right" : ""
      }`}
    >
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {direction === "prev" ? "Previous" : "Next"}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
          {direction === "prev" ? "← " : ""}{shortDate}{direction === "next" ? " →" : ""}
        </p>
        {rate !== null && (
          <p className="text-xs text-zinc-500">22K {formatCurrency(rate)}/g</p>
        )}
      </div>
    </Link>
  );
}
