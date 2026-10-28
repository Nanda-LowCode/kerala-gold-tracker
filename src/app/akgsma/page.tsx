import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "@/app/page";

export const revalidate = 86400; // daily; freshness pushed on-demand by the update-rates cron (revalidatePath)

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// Targets the "akgsma" query cluster — ~20k monthly impressions across
// "akgsma" (19,734 imp alone, pos 4-5, 0.26% CTR), "akgsma rate",
// "akgsma gold rate today", "kerala gold and silver merchants association",
// "kerala gold association" etc. No dedicated page existed before, so we
// were losing clicks to akgsma.in despite ranking page 1 for the brand term.

export async function generateMetadata(): Promise<Metadata> {
  const history = await getHistory();
  const today = history[0] ?? null;

  const title = today
    ? `AKGSMA — All Kerala Gold & Silver Merchants Association (22K ₹${today.rate_22k_1g}/g Today)`
    : "AKGSMA — All Kerala Gold & Silver Merchants Association (Today's Board Rate)";

  const description = today
    ? `AKGSMA is the All Kerala Gold & Silver Merchants Association — the body whose daily board rate is used across every Kerala jewellery showroom. Today: 22K ₹${today.rate_22k_1g}/g (${inr(today.rate_22k_1g * 8)}/pavan), 24K ₹${today.rate_24k_1g}/g. Updated 10 AM IST.`
    : "AKGSMA is the All Kerala Gold & Silver Merchants Association — the body whose daily board rate is used across every Kerala jewellery showroom. 22K, 24K and 18K rates per gram and per pavan, updated 10 AM IST.";

  return {
    title,
    description,
    alternates: { canonical: "/akgsma" },
    openGraph: {
      title,
      description,
      url: "https://www.livegoldkerala.com/akgsma",
    },
  };
}

export default async function AkgsmaPage() {
  const history = await getHistory();
  const today = history[0] ?? null;
  const yesterday = history[1] ?? null;

  if (!today) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center text-sm text-zinc-500">
        AKGSMA rates are being updated. Check back shortly.
      </main>
    );
  }

  const dateFormatted = new Date(today.date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );

  const change22k = yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : 0;
  const changeDir = change22k === 0 ? "flat" : change22k > 0 ? "up" : "down";

  const faqs = [
    {
      q: "What does AKGSMA stand for?",
      a: "AKGSMA is the All Kerala Gold and Silver Merchants Association — the state-level industry body representing gold and silver jewellery merchants across Kerala. It is the authority behind the daily board rate used at every jewellery showroom in the state.",
    },
    {
      q: "What is the AKGSMA rate?",
      a: "The AKGSMA rate (also called the Kerala board rate) is the single reference price for gold and silver published by the association each morning. Every jewellery showroom in Kerala — large chains and small independents alike — uses the same AKGSMA rate as the base for their day's sales, before making charges and GST are added.",
    },
    {
      q: "At what time does the AKGSMA rate update?",
      a: "The daily AKGSMA board rate is set in the morning and typically published by around 10 AM IST. Once set, it stays the same for the rest of the day across every district in Kerala. International bullion markets move around the clock, but the AKGSMA board number is a single-point-in-time anchor for the day's retail sales.",
    },
    {
      q: "Why is the gold rate the same across all Kerala districts?",
      a: "Because every participating jeweller works off the single AKGSMA board rate. Unlike many Indian states where city-level rates can diverge, Kerala's uniform rate means the price per gram in Thiruvananthapuram, Kochi, Thrissur, Kozhikode and every town in between is identical for a given purity on a given day. What varies between showrooms is only making charges, wastage, and hallmarking.",
    },
    {
      q: "Where can I check today's AKGSMA rate?",
      a: "This page shows the live AKGSMA board rate for 22K (916), 24K (999) and 18K (750) gold, updated daily. For the full historical archive, see the gold rate history. For today's rate converted to pavan, grams, sovereign and tola, use the pavan calculator.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "All Kerala Gold and Silver Merchants Association",
    alternateName: "AKGSMA",
    description:
      "The All Kerala Gold and Silver Merchants Association (AKGSMA) is the state-level industry body in Kerala, India, representing gold and silver jewellery merchants and publishing the daily reference board rate used across every jewellery showroom in the state.",
    areaServed: { "@type": "AdministrativeArea", name: "Kerala, India" },
  };

  const dirSymbol = changeDir === "up" ? "▲" : changeDir === "down" ? "▼" : "—";
  const dirClass =
    changeDir === "up"
      ? "text-rose-600 dark:text-rose-400"
      : changeDir === "down"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-zinc-500";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <header className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-500">
            Kerala board rate authority
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            AKGSMA — All Kerala Gold &amp; Silver Merchants Association
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
            AKGSMA is the state-level body that publishes the single daily board
            rate every Kerala jewellery showroom uses. One number across every
            district, set each morning around 10 AM IST.
          </p>
        </header>

        {/* Live rate card */}
        <section
          aria-label="Today's AKGSMA board rate"
          className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md shadow-amber-200/40 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900 dark:shadow-none md:p-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500">
              Today&apos;s AKGSMA rate
            </h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {dateFormatted}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                22K (916)
              </p>
              <p className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {inr(today.rate_22k_1g)}
                <span className="text-sm font-normal text-zinc-500">/g</span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {inr(today.rate_22k_1g * 8)} / pavan
              </p>
              {yesterday && (
                <p className={`mt-0.5 text-xs ${dirClass}`}>
                  {dirSymbol} {inr(Math.abs(change22k))}/g vs yesterday
                </p>
              )}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                24K (999)
              </p>
              <p className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {inr(today.rate_24k_1g)}
                <span className="text-sm font-normal text-zinc-500">/g</span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {inr(today.rate_24k_1g * 10)} / 10 g
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                18K (750)
              </p>
              <p className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                {inr(today.rate_18k_1g)}
                <span className="text-sm font-normal text-zinc-500">/g</span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {inr(today.rate_18k_1g * 8)} / pavan
              </p>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="space-y-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 md:text-base">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 md:text-xl">
              What is AKGSMA?
            </h2>
            <p className="mt-2">
              AKGSMA — the{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                All Kerala Gold and Silver Merchants Association
              </strong>{" "}
              — is the state-level body representing gold and silver jewellery
              merchants across Kerala. Its most visible function is publishing
              the single daily reference rate (the &ldquo;board rate&rdquo;)
              used at every participating jeweller&apos;s counter — from the
              large chains like Malabar, Kalyan, Joyalukkas, Bhima and
              Chemmanur down to independent family shops in every town.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 md:text-xl">
              How the AKGSMA board rate works
            </h2>
            <p className="mt-2">
              Each morning the association sets the day&apos;s price for 22K
              (916), 24K (999) and 18K (750) gold, plus silver. That number is
              the base rate for every retail transaction in Kerala that day —
              what changes between showrooms is only the{" "}
              <Link href="/tools/gold-making-charge-calculator" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500 dark:text-amber-400">
                making charge
              </Link>
              , wastage, and the 3% GST applied on top. Once the board rate is
              published it generally stays fixed for the rest of the day, even
              as international spot gold moves overnight on New York and London
              exchanges.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 md:text-xl">
              Why one rate for all of Kerala
            </h2>
            <p className="mt-2">
              Many Indian states see city-level divergence — Mumbai, Chennai and
              Hyderabad can carry noticeably different rates on the same day.
              Kerala doesn&apos;t. Because every participating jeweller works
              off the AKGSMA number, the per-gram price in{" "}
              <Link href="/trivandrum" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500 dark:text-amber-400">
                Thiruvananthapuram
              </Link>
              ,{" "}
              <Link href="/ernakulam" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500 dark:text-amber-400">
                Ernakulam
              </Link>
              ,{" "}
              <Link href="/thrissur" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500 dark:text-amber-400">
                Thrissur
              </Link>{" "}
              and{" "}
              <Link href="/kozhikode" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500 dark:text-amber-400">
                Kozhikode
              </Link>{" "}
              is identical for a given purity on a given day. Comparing
              showrooms is purely a comparison of making charges and wastage,
              not of the metal itself.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 md:text-xl">
              How this site tracks AKGSMA
            </h2>
            <p className="mt-2">
              LiveGold Kerala reads the AKGSMA board rate every morning and
              publishes it here, on the{" "}
              <Link href="/" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500 dark:text-amber-400">
                homepage
              </Link>
              , on every city page, and in the daily{" "}
              <Link href="/news" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500 dark:text-amber-400">
                news archive
              </Link>
              . Every historical day since launch is in the{" "}
              <Link href="/gold-rate-history" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500 dark:text-amber-400">
                full rate history
              </Link>
              , so you can see how the AKGSMA rate has moved over the past
              months and years.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 md:text-xl">
            Frequently asked about AKGSMA
          </h2>
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-zinc-200/70 bg-white p-4 open:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-zinc-900 marker:hidden dark:text-zinc-100">
                <span className="inline-flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-0.5 text-amber-700 transition-transform group-open:rotate-90 dark:text-amber-500"
                  >
                    ›
                  </span>
                  <span>{f.q}</span>
                </span>
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {f.a}
              </p>
            </details>
          ))}
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60"
          >
            ← Today&apos;s Rate
          </Link>
          <Link
            href="/gold-rate-history"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          >
            Full Rate History →
          </Link>
          <Link
            href="/tools/pavan-to-gram-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          >
            Pavan Calculator →
          </Link>
        </div>
      </main>
    </>
  );
}
