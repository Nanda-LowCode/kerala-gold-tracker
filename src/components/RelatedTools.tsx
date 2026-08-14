import Link from "next/link";

// Curated onward links (tools + top guides). Rendered as a compact grid to
// lift pages-per-visit — more internal navigation = more pageviews (and better
// internal linking for SEO). Order = rough priority; each page excludes itself.
const LINKS: { href: string; label: string; blurb: string }[] = [
  { href: "/", label: "Today's Gold Rate", blurb: "Live 22K & 24K Kerala rate" },
  { href: "/my-gold", label: "My Gold", blurb: "Track what your gold is worth" },
  { href: "/tools/gold-making-charge-calculator", label: "Making Charge Calculator", blurb: "Real showroom price + GST" },
  { href: "/tools/pavan-to-gram-calculator", label: "Gram ↔ Pavan Converter", blurb: "Convert + today's value" },
  { href: "/tools/hallmark-gold-calculator", label: "Hallmark Value", blurb: "916 / 750 / 999 gold value" },
  { href: "/tools/gold-scheme-calculator", label: "Gold Scheme Calculator", blurb: "Is a monthly scheme worth it?" },
  { href: "/tools/old-gold-exchange-calculator", label: "Old Gold Exchange", blurb: "Resale / exchange value" },
  { href: "/tools/gold-import-duty-calculator", label: "NRI Import Duty", blurb: "Carrying gold to India" },
  { href: "/tools/silver-price-calculator", label: "Silver Price Calculator", blurb: "Silver + making + GST" },
  { href: "/blog/best-gold-coins-to-buy-kerala", label: "Best Gold Coins to Buy", blurb: "Where & what to buy" },
  { href: "/blog/gold-tax-gst-kerala-2026", label: "Gold Tax in Kerala", blurb: "GST + making charges" },
];

export default function RelatedTools({
  exclude = [],
  heading = "Explore more calculators & guides",
  limit = 6,
}: {
  exclude?: string[];
  heading?: string;
  limit?: number;
}) {
  const items = LINKS.filter((l) => !exclude.includes(l.href)).slice(0, limit);

  return (
    <section className="not-prose rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-bold text-zinc-800 dark:text-zinc-100">{heading}</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {items.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group rounded-xl border border-zinc-200/70 bg-zinc-50/60 p-3 no-underline transition-colors hover:border-amber-300 hover:bg-amber-50/60 dark:border-zinc-800 dark:bg-zinc-950/40 dark:hover:border-amber-700/50 dark:hover:bg-amber-950/10"
          >
            <p className="text-xs font-bold text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
              {l.label}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">{l.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
