import Link from "next/link";

/**
 * Compact "you might also need" chip strip for calculator pages.
 *
 * Goes right after the main result of a calculator, while the visitor is
 * still looking at their answer — the moment when "what else can I check?"
 * is naturally in mind. Deliberately lighter than <RelatedTools>: no
 * blurbs, no cards, just labels in a single horizontally-scrollable row.
 *
 * <RelatedTools> at the bottom of the page still exists and shows the
 * fuller grid; this is the above-the-fold shortcut.
 */

interface Sibling {
  href: string;
  label: string;
  /** One-char/emoji glyph — scanability without weight. Optional. */
  icon?: string;
}

// Ordered by "most natural next tool after any calculator": showroom price
// (making charge), purity, resale/exchange, NRI import, silver, monthly scheme.
const CALCULATORS: Sibling[] = [
  { href: "/tools/gold-making-charge-calculator", label: "Making Charge", icon: "🧾" },
  { href: "/tools/hallmark-gold-calculator", label: "Hallmark & Purity", icon: "✓" },
  { href: "/tools/pavan-to-gram-calculator", label: "Gram ↔ Pavan", icon: "⚖️" },
  { href: "/tools/old-gold-exchange-calculator", label: "Old Gold Exchange", icon: "↺" },
  { href: "/tools/gold-import-duty-calculator", label: "NRI Import Duty", icon: "✈️" },
  { href: "/tools/gold-scheme-calculator", label: "Monthly Scheme", icon: "📅" },
  { href: "/tools/silver-price-calculator", label: "Silver Price", icon: "🥈" },
];

export default function SiblingCalculators({
  exclude = [],
  heading = "You might also need",
  limit = 4,
}: {
  /** Href(s) to hide — typically the current page. */
  exclude?: string[];
  heading?: string;
  /** Cap the number of chips shown. Order in CALCULATORS defines priority. */
  limit?: number;
}) {
  const items = CALCULATORS.filter((c) => !exclude.includes(c.href)).slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section aria-label={heading} className="not-prose">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
        {heading}
      </p>
      {/* Horizontal scroll on mobile, wraps on desktop. -mx-4 lets the row
          bleed to the phone edges so partial chips signal "swipe for more". */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0">
        {items.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-amber-700/50 dark:hover:bg-amber-950/20 dark:hover:text-amber-400"
          >
            {c.icon && <span aria-hidden>{c.icon}</span>}
            {c.label}
            <span aria-hidden className="text-zinc-400 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
