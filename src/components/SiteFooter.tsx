import Link from "next/link";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Rates",
    links: [
      { label: "Today's Gold Rate", href: "/" },
      { label: "Yesterday's Rate", href: "/gold-rate-yesterday-kerala" },
      { label: "Old Gold Rate", href: "/old-gold-rate-kerala" },
      { label: "Rate History", href: "/gold-rate-history" },
      { label: "Price Trends Study", href: "/kerala-gold-price-trends" },
      { label: "Silver Rate", href: "/silver-rate-kerala" },
      { label: "Daily News", href: "/news" },
    ],
  },
  {
    heading: "Calculators",
    links: [
      { label: "Making Charges", href: "/tools/gold-making-charge-calculator" },
      { label: "Old Gold Exchange", href: "/tools/old-gold-exchange-calculator" },
      { label: "NRI Import Duty", href: "/tools/gold-import-duty-calculator" },
      { label: "Pavan to Gram", href: "/tools/pavan-to-gram-calculator" },
      { label: "Hallmark Value", href: "/tools/hallmark-gold-calculator" },
      { label: "Silver Calculator", href: "/tools/silver-price-calculator" },
      { label: "Wedding Budget", href: "/culture/weddings/budget-calculator" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Knowledge Hub", href: "/blog" },
      { label: "Jewellers Guide", href: "/jewellers" },
      { label: "Gold Culture", href: "/culture" },
      { label: "Festival Calendar", href: "/culture/festivals" },
      { label: "Wedding Traditions", href: "/culture/weddings" },
      { label: "Rate Widget", href: "/widget" },
    ],
  },
  {
    heading: "Site",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

/**
 * Single shared footer, rendered by the root layout on every page — replaces
 * the previously divergent per-page footers so chrome is consistent site-wide.
 * (Home/city pages additionally keep their contextual city-links block above
 * this, inside DashboardLayout.)
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200/60 bg-white/50 pt-8 pb-10 dark:border-zinc-800/80 dark:bg-zinc-950/50">
      <div className="mx-auto max-w-3xl px-4 xl:max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                {col.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-xs text-zinc-500 transition-colors hover:text-amber-700 dark:text-zinc-400 dark:hover:text-amber-400"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-8 border-t border-zinc-200/60 pt-5 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <p className="font-medium">
            Rates: All Kerala Gold &amp; Silver Merchants Association (AKGSMA) board rate · For reference only — confirm at your jeweller
          </p>
          <p className="mt-1.5">© 2026 LiveGold Kerala</p>
        </div>
      </div>
    </footer>
  );
}
