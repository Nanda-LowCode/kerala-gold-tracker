import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "@/app/page";

export const revalidate = 86400; // daily; freshness pushed on-demand by the update-rates cron (revalidatePath)

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// Targets the "old gold rate today" cluster (GSC: ~10 queries at pos 4–9 with
// no dedicated page) — people selling or exchanging old jewellery who want
// today's resale value, not the showroom buying rate.

export async function generateMetadata(): Promise<Metadata> {
  const history = await getHistory();
  const today = history[0] ?? null;

  const title = today
    ? `Old Gold Rate Today in Kerala: 22K ₹${today.rate_22k_1g}/g — Resale & Exchange Value`
    : "Old Gold Rate Today in Kerala — Resale & Exchange Value";

  return {
    title,
    description: today
      ? `Selling old gold today? Jewellers value old 22K gold at today's board rate of ₹${today.rate_22k_1g}/g minus 2–5% melting/wastage — roughly ${inr(today.rate_22k_1g * 0.95)}–${inr(today.rate_22k_1g * 0.98)} per gram cash. Exchange for new jewellery usually credits closer to the full rate.`
      : "Today's old gold resale and exchange value in Kerala: board rate minus typical 2–5% melting and wastage deductions, per purity.",
    alternates: { canonical: "/old-gold-rate-kerala" },
    openGraph: {
      title,
      description: "What jewellers actually pay for old gold in Kerala today — resale vs exchange, per purity.",
      url: "https://www.livegoldkerala.com/old-gold-rate-kerala",
    },
  };
}

export default async function OldGoldRatePage() {
  const history = await getHistory();
  const today = history[0] ?? null;

  if (!today) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center text-sm text-zinc-500">
        Rates are being updated. Check back shortly.
      </main>
    );
  }

  const dateFormatted = new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Old-gold value = today's board rate for the metal content, minus the
  // typical 2–5% melting/wastage deduction on a cash sale.
  const purities = [
    { label: "22K (916)", rate: today.rate_22k_1g },
    { label: "18K (750)", rate: today.rate_18k_1g },
    { label: "24K (999)", rate: today.rate_24k_1g },
  ].map((p) => ({
    ...p,
    low: p.rate * 0.95,
    high: p.rate * 0.98,
  }));

  const faqs = [
    {
      q: "What is the old gold rate today in Kerala?",
      a: `Old gold is valued at today's board rate for its actual purity. For 22K (916) that's ₹${today.rate_22k_1g.toLocaleString("en-IN")} per gram today (${dateFormatted}). On a cash sale, jewellers typically deduct 2–5% for melting loss and margin, so expect roughly ${inr(today.rate_22k_1g * 0.95)}–${inr(today.rate_22k_1g * 0.98)} per gram in hand.`,
    },
    {
      q: "Do jewellers pay the full gold rate for old gold?",
      a: "Not usually on a cash sale — most deduct 2–5% for melting loss, impurities, solder and their margin. If you exchange old gold for new jewellery at the same shop, the credit is usually much closer to the full board rate (the deduction shifts into the making charge of the new piece).",
    },
    {
      q: "Is hallmarked old gold worth more?",
      a: "Yes in practice: BIS-hallmarked (916) jewellery with the original bill gets the smallest deductions, because the purity doesn't need to be re-assayed. Unhallmarked or bill-less gold is often tested (or valued conservatively) and can see larger cuts.",
    },
    {
      q: "Do I get money for the making charges I originally paid?",
      a: "No. Making charges are labour — they aren't recoverable on resale. You're paid for the metal content only, which is why comparing the per-gram rate and the deduction percentage across shops matters.",
    },
  ];

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Old Gold Rate Today in Kerala
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <time dateTime={today.date}>{dateFormatted}</time> — old gold is bought at today&apos;s{" "}
          <Link href="/" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
            Kerala board rate
          </Link>{" "}
          for its actual purity, minus a melting/wastage deduction (typically <strong>2–5%</strong> on
          a cash sale). Making charges you originally paid are not recoverable.
        </p>

        {/* Payout table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              What your old gold is worth today (per gram)
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-800/30">
                <th className="px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500">Purity</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">Board rate</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">Typical cash payout*</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {purities.map((p) => (
                <tr key={p.label}>
                  <td className="px-5 py-3.5 font-bold text-zinc-800 dark:text-zinc-200">{p.label}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-zinc-900 dark:text-zinc-100">{inr(p.rate)}</td>
                  <td className="px-5 py-3.5 text-right text-zinc-600 dark:text-zinc-400">
                    {inr(p.low)} – {inr(p.high)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-zinc-100 px-5 py-3 text-[11px] leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            * After the typical 2–5% melting/wastage deduction on a cash sale. Exchanging for new
            jewellery at the same shop usually credits closer to the full board rate. Hallmarked gold
            with the original bill gets the best terms.
          </p>
        </section>

        {/* Calculator CTA */}
        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Get your exact number</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Enter weight, purity and the shop&apos;s deduction — see your net cash value at today&apos;s rate.
            </p>
          </div>
          <Link
            href="/tools/old-gold-exchange-calculator"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition-all hover:brightness-110"
          >
            Old Gold Calculator →
          </Link>
        </section>

        {/* Sell vs exchange */}
        <section className="mt-8 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Selling vs exchanging — which pays more?</h2>
          <p>
            <strong>Exchange (old for new)</strong> usually gives the better headline value — most
            Kerala jewellers credit at or near the full board rate when you buy new jewellery from
            them, and festival seasons bring &quot;zero deduction&quot; exchange offers. The catch: you pay
            making charges and GST on the new piece.
          </p>
          <p>
            <strong>Cash sale</strong> is cleaner if you don&apos;t want new jewellery: expect the 2–5%
            deduction at established jewellers (pawn-type shops often cut 5–8%). Always compare at
            least two shops, carry the original bill, and check the weight on their scale. Full
            walkthrough:{" "}
            <Link href="/blog/how-to-sell-old-gold-kerala" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
              how to sell old gold in Kerala
            </Link>.
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Old gold FAQs</h2>
          <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
            {faqs.map((f) => (
              <div key={f.q} className="py-4">
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{f.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Today&apos;s Gold Rate
          </Link>
          <Link href="/tools/hallmark-gold-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Hallmark Value Calculator →
          </Link>
        </div>
      </main>
    </>
  );
}
