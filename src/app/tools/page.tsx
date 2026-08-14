import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gold Calculators for Kerala — Making Charge, Pavan & Hallmark",
  description:
    "Free gold & silver calculators for Kerala: making-charge estimator, old-gold exchange value, NRI import duty, hallmark purity, pavan-to-gram conversion, and a silver price calculator.",
  alternates: { canonical: "/tools" },
};

interface ToolEntry {
  slug: string;
  title: string;
  blurb: string;
  badge: string;
  /** Overrides the default /tools/{slug} path for tools that live elsewhere. */
  href?: string;
}

const TOOLS: ToolEntry[] = [
  {
    slug: "my-gold",
    href: "/my-gold",
    title: "My Gold",
    blurb:
      "Add the gold you own and see what it's worth today — each purchase priced from the actual board rate on the day you bought it.",
    badge: "New",
  },
  {
    slug: "gold-making-charge-calculator",
    title: "Making Charge Calculator",
    blurb:
      "See exactly how much you're paying above the gold rate — making charges, wastage, GST, broken down to the rupee.",
    badge: "Most popular",
  },
  {
    slug: "old-gold-exchange-calculator",
    title: "Old Gold Exchange Estimator",
    blurb:
      "Estimate what your old jewellery will fetch at exchange — by purity, weight, and today's board rate.",
    badge: "Resale",
  },
  {
    slug: "gold-import-duty-calculator",
    title: "NRI Import Duty Calculator",
    blurb:
      "Flying back with gold? Calculate the customs duty you'll owe based on weight, gender, and stay duration.",
    badge: "NRI",
  },
  {
    slug: "hallmark-gold-calculator",
    title: "Hallmark Purity Calculator",
    blurb:
      "Convert any karat to BIS 916/750 equivalence and check the true gold value of a stamped piece.",
    badge: "Purity",
  },
  {
    slug: "pavan-to-gram-calculator",
    title: "Gram to Pavan Converter",
    blurb:
      "Convert grams to pavan (sovereign), tola and ounce — 8g, 20g, 40g and more — with today's gold value.",
    badge: "Units",
  },
  {
    slug: "gold-scheme-calculator",
    title: "Gold Scheme Calculator",
    blurb:
      "Is a jeweller's monthly gold scheme worth it? See the 'free month' bonus vs the making charges — and vs buying coins.",
    badge: "Schemes",
  },
  {
    slug: "silver-price-calculator",
    title: "Silver Price Calculator",
    blurb:
      "Price silver anklets, coins and utensils — enter weight and purity (999 or 925) for the total with making charges and GST.",
    badge: "Silver",
  },
];

export default function ToolsIndex() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:gap-10 md:py-12">
      <header className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-500">
          For Kerala buyers
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
          Gold{" "}
          <span className="bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500">
            Calculators
          </span>{" "}
          &amp; Tools
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
          Five purpose-built calculators for Kerala buyers, sellers, and Gulf NRIs.
          Every tool reads today&apos;s verified Kerala board rate.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TOOLS.map((tool, i) => (
          <li key={tool.slug} className={i === 0 ? "sm:col-span-2" : ""}>
            <Link
              href={tool.href ?? `/tools/${tool.slug}`}
              className={`group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border bg-white p-5 shadow-md transition-all hover:-translate-y-0.5 dark:bg-zinc-900 md:p-6 ${
                i === 0
                  ? "border-amber-300 shadow-amber-200/40 hover:shadow-xl hover:shadow-amber-300/40 dark:border-amber-500/40 dark:shadow-none"
                  : "border-zinc-200/70 shadow-amber-100/30 hover:border-amber-200 hover:shadow-lg dark:border-zinc-800 dark:shadow-none dark:hover:border-amber-800/40"
              }`}
            >
              {/* Decorative glow */}
              <div
                aria-hidden
                className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${
                  i === 0
                    ? "bg-gradient-to-br from-amber-300/50 to-transparent dark:from-amber-600/20"
                    : "bg-gradient-to-br from-amber-200/30 to-transparent dark:from-zinc-800/80"
                }`}
              />

              <div className="relative flex items-start justify-between gap-3">
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase tracking-[0.18em] ring-1 ring-inset ${
                    i === 0
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white ring-amber-600/30 shadow-sm"
                      : "bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-900/40"
                  }`}
                >
                  {tool.badge}
                </span>
                <svg
                  aria-hidden
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                    i === 0
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-zinc-500 group-hover:text-amber-700 dark:group-hover:text-amber-400"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="relative flex flex-1 flex-col gap-1.5">
                <h2
                  className={`text-lg font-bold leading-tight tracking-tight md:text-xl ${
                    i === 0
                      ? "bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500"
                      : "text-zinc-900 group-hover:text-amber-800 dark:text-zinc-100 dark:group-hover:text-amber-300"
                  }`}
                >
                  {tool.title}
                </h2>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {tool.blurb}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <section className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md shadow-amber-200/40 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900 dark:shadow-none md:p-6">
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Every calculator reads from the verified{" "}
          <Link
            href="/"
            className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500"
          >
            Kerala board rate
          </Link>{" "}
          published daily at 10 AM IST by AKGSMA &mdash; the same number used at the
          showroom counter, so your estimates match what you&apos;ll be quoted.
        </p>
      </section>
    </main>
  );
}
