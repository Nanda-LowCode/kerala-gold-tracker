import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | LiveGold Kerala",
  description: "Terms of use for LiveGold Kerala gold rate tracker.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 dark:text-amber-400">
        ← Back to Gold Rates
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Terms of Use</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Last updated: 22 April 2026</p>

      <div className="prose prose-zinc dark:prose-invert mt-8 max-w-none text-sm leading-relaxed">
        <h2>For reference only</h2>
        <p>
          All gold and silver rate information on LiveGold Kerala is provided for general
          reference purposes only. Rates are sourced from publicly available data (Malabar Gold
          &amp; Diamonds, Kerala Gold &amp; Silver Merchants Association) and may differ from
          prices charged by individual jewellers. Always confirm the final rate at the point of
          purchase.
        </p>

        <h2>No financial advice</h2>
        <p>
          Nothing on this site constitutes financial, investment, or commodity-trading advice.
          Gold prices are volatile. Past performance is not indicative of future results. Consult
          a qualified financial adviser before making investment decisions.
        </p>

        <h2>Calculator accuracy</h2>
        <p>
          Our calculators (making-charge, old-gold exchange, import duty) use standard industry
          formulas. Outputs are estimates only. Actual costs may vary based on jeweller-specific
          charges, GST computation methods, and hallmarking fees.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The LiveGold Kerala name, logo, and original content are the property of the site
          owner. Gold rate data sourced from public associations is attributed accordingly.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          LiveGold Kerala is not liable for any financial loss arising from reliance on rates or
          calculator outputs displayed on this site. Use of this site is at your own risk.
        </p>

        <h2>Changes</h2>
        <p>
          These terms may be updated at any time. Continued use of the site after changes
          constitutes acceptance of the revised terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Visit our{" "}
          <Link href="/contact" className="text-amber-700 underline dark:text-amber-400">
            contact page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
