import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About LiveGold Kerala — Data Sources & Methodology",
  description:
    "How LiveGold Kerala tracks daily gold and silver rates in Kerala — data sources, update schedule, and how the Kerala board rate works.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">✨</span>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg">
                LiveGold{" "}
                <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  Kerala
                </span>
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            ← Today&apos;s Rate
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            About LiveGold Kerala
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            How we track gold and silver rates, where the data comes from, and what the Kerala board rate means.
          </p>
        </div>

        <div className="space-y-8">
          {/* What is this */}
          <section className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">What is LiveGold Kerala?</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              LiveGold Kerala is a free tool that tracks the official daily gold and silver rates published by the Kerala Gold &amp; Silver Merchants Association (KGSMA). Our goal is simple: show you the correct rate before you walk into a jewellery shop, so you can buy or sell with confidence.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              We also offer calculators for making charges, old gold exchange estimates, and NRI import duty — all the numbers you need in one place.
            </p>
          </section>

          {/* Data Sources */}
          <section className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Data Sources</h2>
            <div className="mt-4 space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">1</div>
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">Malabar Gold &amp; Diamonds (Primary)</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    We fetch the official Kerala rate directly from Malabar Gold &amp; Diamonds' rate API. As Kerala's largest jewellery chain, their published rate matches the KGSMA board rate exactly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">2</div>
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">BankBazaar Kerala (Fallback)</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    If the primary source is unavailable, we fall back to BankBazaar's Kerala gold and silver rate pages. Both sources consistently report the same KGSMA board rate.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How Kerala board rate works */}
          <section className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">How the Kerala Board Rate Works</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              The Kerala Gold &amp; Silver Merchants Association sets a single daily rate that applies uniformly to all jewellers across the state — from Trivandrum to Kasaragod. This is why the gold rate in Kochi, Thrissur, and Kozhikode is identical on any given day.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              The board rate is derived from the international gold spot price (USD/troy oz), adjusted for the current INR/USD exchange rate and the prevailing import duty (6% basic customs duty as of 2024). It is announced each morning and remains fixed for that trading day.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              The rates shown are for the metal only. When you buy jewellery, you will also pay making charges (6–15%) and 3% GST. Use our{" "}
              <Link href="/tools/gold-making-charge-calculator" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 dark:text-amber-400">
                Making Charge Calculator
              </Link>{" "}
              to estimate the final price.
            </p>
          </section>

          {/* Update schedule */}
          <section className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Update Schedule</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Update time", value: "~10:30 AM IST" },
                { label: "Frequency", value: "Once daily" },
                { label: "Market days", value: "Mon – Sat" },
                { label: "Sunday", value: "Market closed" },
                { label: "Gold karats", value: "18K, 22K, 24K" },
                { label: "Silver", value: "999 fine, per gram" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="rounded-2xl border border-amber-200/50 bg-amber-50/50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Disclaimer</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              All rates on LiveGold Kerala are for reference purposes only. While we strive to show accurate and up-to-date information, we make no guarantees. Always confirm the rate with your jeweller at the time of purchase. This site is not affiliated with the Kerala Gold &amp; Silver Merchants Association or any jewellery brand.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Found an incorrect rate or have a suggestion? Email us at{" "}
              <a href="mailto:nanda1994dec@gmail.com" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 dark:text-amber-400">
                nanda1994dec@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 py-8 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        <p>© 2026 LiveGold Kerala · <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300">Home</Link></p>
      </footer>
    </>
  );
}
