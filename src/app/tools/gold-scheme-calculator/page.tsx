import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "@/app/page";
import GoldSchemeCalculator from "@/components/GoldSchemeCalculator";

export const revalidate = 86400; // daily; freshness pushed on-demand by the update-rates cron (revalidatePath)

export const metadata: Metadata = {
  title: "Gold Scheme Calculator Kerala — Is a Monthly Gold Scheme Worth It?",
  description:
    "Are jeweller gold savings schemes (Malabar, Kalyan, Josco '11+1') actually worth it? This calculator shows the truth: the 'free month' bonus vs the making charges you pay on redemption — compared to just buying gold coins.",
  alternates: { canonical: "/tools/gold-scheme-calculator" },
  openGraph: {
    title: "Gold Scheme Calculator Kerala — Is It Actually Worth It?",
    description:
      "The honest maths on jeweller monthly gold schemes: bonus vs making charges vs buying coins.",
    url: "https://www.livegoldkerala.com/tools/gold-scheme-calculator",
  },
};

export default async function GoldSchemeCalculatorPage() {
  const history = await getHistory();
  const rate22k = history[0]?.rate_22k_1g ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Gold Scheme Calculator Kerala",
    description:
      "Work out whether a jeweller's monthly gold savings scheme is worth it — bonus vs making charges vs buying gold coins.",
    url: "https://www.livegoldkerala.com/tools/gold-scheme-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are gold savings schemes worth it in Kerala?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Usually only if you were going to buy jewellery anyway and the making charge is low. The bonus (typically one free installment, ~9%) is largely cancelled by the making charge you pay on redemption, because schemes can only be redeemed for jewellery. For pure investment, buying gold coins or a gold SIP is usually better.",
        },
      },
      {
        "@type": "Question",
        name: "What is the catch with jeweller gold schemes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Three catches: you can only redeem for jewellery (so you pay making charges that eat the bonus), you can't take cash, and your rupees buy gold at the maturity-day rate — so if gold rises during the term, you get less gold.",
        },
      },
      {
        "@type": "Question",
        name: "Is a gold scheme better than buying gold coins?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For investment, coins are usually better: no making charge, near-pure 24K, and easy resale close to the gold rate. A scheme can win only when the making charge on the jewellery you buy is lower than the scheme bonus.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 md:gap-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Gold Scheme Calculator (Kerala)
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Is a jeweller&apos;s monthly gold scheme (Malabar, Kalyan, Josco &amp; co.) actually worth
            it? Enter your numbers and see the honest maths — the &ldquo;free month&rdquo; bonus vs the
            making charges you pay on redemption, next to simply buying gold coins.
          </p>
          {rate22k && (
            <p className="mt-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              Live 22K rate: ₹{rate22k.toLocaleString("en-IN")}/g ·{" "}
              <Link href="/" className="hover:underline">today&apos;s full rate</Link>
            </p>
          )}
        </div>

        <GoldSchemeCalculator rate22k={rate22k} />

        <section className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">How jeweller gold schemes actually work</h2>
          <p>
            The classic Kerala scheme is <strong className="text-zinc-700 dark:text-zinc-300">&ldquo;pay 11, get the
            12th free&rdquo;</strong>: you deposit a fixed amount each month for 11 months, and the jeweller adds
            roughly one installment as a bonus at maturity. It sounds like a ~9% return — but there are three
            things the brochure doesn&apos;t put front and centre:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong className="text-zinc-700 dark:text-zinc-300">Jewellery only.</strong> You can&apos;t take cash or plain coins — so you pay <Link href="/tools/gold-making-charge-calculator" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">making charges</Link> (8–25%) on what you buy, which often wipes out the bonus.</li>
            <li><strong className="text-zinc-700 dark:text-zinc-300">Gold-price risk.</strong> Your rupees buy gold at the <em>maturity</em> rate. If gold rises during the term (as it did through <Link href="/kerala-gold-price-trends" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">2024–2026</Link>), your money buys less.</li>
            <li><strong className="text-zinc-700 dark:text-zinc-300">No easy exit.</strong> These are lock-in deposits — you generally can&apos;t stop midway and get your money back cleanly.</li>
          </ul>
          <h2 className="pt-2 text-lg font-bold text-zinc-800 dark:text-zinc-200">So when does a scheme make sense?</h2>
          <p>
            Only when you were <strong className="text-zinc-700 dark:text-zinc-300">going to buy that jewellery anyway</strong> and
            the making charge is low — then the bonus is a genuine discount. If your goal is to <em>invest</em> in gold,
            a <Link href="/blog/best-gold-coins-to-buy-kerala" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">plain gold coin</Link> or a
            gold SIP almost always beats it: no making charge, near-pure 24K, and resale close to the board rate.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/tools/gold-making-charge-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            Making Charge Calculator →
          </Link>
          <Link href="/blog/best-gold-coins-to-buy-kerala" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Best Gold Coins to Buy →
          </Link>
        </div>
      </main>
    </>
  );
}
