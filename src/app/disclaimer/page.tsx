import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer | LiveGold Kerala",
  description: "Disclaimer for LiveGold Kerala gold rate tracker. Rates are for reference only and not financial advice.",
  alternates: { canonical: "/disclaimer" },
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 dark:text-amber-400">
        ← Back to Gold Rates
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Disclaimer</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Last updated: 23 April 2026</p>

      <div className="prose prose-zinc dark:prose-invert mt-8 max-w-none text-sm leading-relaxed">
        <h2>For reference only</h2>
        <p>
          All gold and silver rate information published on LiveGold Kerala is provided strictly for
          general reference and informational purposes. Rates are sourced from publicly available
          data (Malabar Gold &amp; Diamonds, Kerala Gold &amp; Silver Merchants Association) and
          are updated once daily. Actual prices charged by individual jewellers may vary based on
          making charges, wastage, hallmarking fees, and GST computation methods. Always confirm
          the final rate at the point of purchase.
        </p>

        <h2>Not financial or investment advice</h2>
        <p>
          Nothing on this website constitutes financial, investment, commodity-trading, or legal
          advice. Gold and silver prices are volatile commodities. Past performance and historical
          rate trends displayed on this site are not indicative of future results. Decisions to
          buy, sell, or hold gold should be made in consultation with a qualified financial adviser.
          LiveGold Kerala accepts no responsibility for any financial loss arising directly or
          indirectly from reliance on the information provided.
        </p>

        <h2>Calculator outputs are estimates</h2>
        <p>
          Our calculators — including the Making Charge Calculator, Old Gold Exchange Estimator,
          NRI Import Duty Calculator, and Hallmark Gold Value Calculator — apply standard industry
          formulas. Results are indicative estimates only. Actual costs, exchange values, or duty
          amounts may differ based on the specific jeweller, customs officer assessment, prevailing
          tax rules, and applicable exemptions. Verify all figures independently before transacting.
        </p>

        <h2>Rate accuracy</h2>
        <p>
          While we make every effort to publish accurate and timely data, LiveGold Kerala does not
          guarantee the completeness, accuracy, or timeliness of rates. There may be a delay
          between the official board rate announcement and our update, particularly on public
          holidays, Sundays, or in the event of technical issues.
        </p>

        <h2>External links</h2>
        <p>
          This site may contain links to third-party websites. LiveGold Kerala is not responsible
          for the content, accuracy, or practices of any linked sites.
        </p>

        <h2>Contact</h2>
        <p>
          If you believe any information on this site is inaccurate, please contact us via our{" "}
          <Link href="/contact" className="text-amber-700 underline dark:text-amber-400">
            contact page
          </Link>
          . We verify and correct errors as quickly as possible.
        </p>
      </div>
    </main>
  );
}
