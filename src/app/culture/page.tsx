import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kerala Gold & Cultural Heritage — Temples, Festivals, Weddings",
  description:
    "Explore Kerala's living gold traditions — sacred temple ornaments, festival muhurat calendars, and community-specific wedding customs across Hindu, Christian, and Muslim traditions.",
  alternates: { canonical: "/culture" },
  openGraph: {
    title: "Kerala Gold & Cultural Heritage",
    description:
      "Temples, festivals, and wedding traditions — Kerala's deep relationship with gold.",
    url: "https://www.livegoldkerala.com/culture",
  },
};

const PILLARS = [
  {
    href: "/culture/temples",
    icon: "🛕",
    title: "Temples & Sacred Gold",
    description:
      "The Thiruvabharanam procession at Sabarimala, Guruvayur Thulabharam, Padmanabhaswamy's vaults, and the sacred ornaments of Kerala's major temples.",
    count: "9 temples",
  },
  {
    href: "/culture/festivals",
    icon: "📅",
    title: "Festivals & Muhurat",
    description:
      "2026 festival calendar with verified muhurat windows for Vishu, Akshaya Tritiya, Onam, and Dhanteras. Gold-buying days highlighted.",
    count: "9 festivals",
  },
  {
    href: "/culture/weddings",
    icon: "💍",
    title: "Wedding Traditions",
    description:
      "Community-specific bridal gold across Nair, Namboothiri, Syrian Christian, Mappila Muslim, and other Kerala communities — with a live budget calculator.",
    count: "8 communities",
  },
];

const ORNAMENT_TEASERS = [
  { name: "Palakka Mala", ml: "പാലക്ക മാല", href: "/culture/ornaments/palakka-mala" },
  { name: "Kumbla Thali", ml: "കുമ്പ്ള താലി", href: "/culture/ornaments/kumbla-thali" },
  { name: "Minnu", ml: "മിന്ന്", href: "/culture/ornaments/minnu" },
  { name: "Arappatta", ml: "അരപ്പട്ട", href: "/culture/ornaments/arappatta" },
  { name: "Netti Chutti", ml: "നെറ്റിച്ചുട്ടി", href: "/culture/ornaments/netti-chutti" },
  { name: "Oddiyanam", ml: "ഒഡ്ഡ്യാണം", href: "/culture/ornaments/oddiyanam" },
];

export default function CultureHubPage() {
  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">✨</span>
          <div>
            <Link
              href="/"
              className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline"
            >
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Cultural Heritage
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Kerala Gold &amp; Cultural Heritage
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-base">
            Gold in Kerala is not merely currency — it marks births, brides, pilgrims, and
            harvests. This section documents the traditions, sacred practices, and community
            customs that shape one of India&apos;s most distinctive gold cultures.
          </p>
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            Content sourced and verified. Factual claims cite named sources; community practices
            are described, never prescribed.
          </p>
        </div>

        {/* Three pillars */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Three pillars
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PILLARS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group flex flex-col gap-3 rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="text-3xl leading-none">{p.icon}</span>
                <div>
                  <p className="font-bold text-zinc-900 group-hover:text-amber-700 dark:text-zinc-100 dark:group-hover:text-amber-400">
                    {p.title}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    {p.count}
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {p.description}
                </p>
                <span className="mt-auto text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Ornament encyclopaedia teaser */}
        <section className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-5 dark:border-amber-800/30 dark:bg-amber-950/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-zinc-800 dark:text-zinc-100">
                Ornament Encyclopaedia
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                23 Kerala gold ornaments documented with etymology, symbolism, community
                association, weight ranges, and live price calculator.
              </p>
            </div>
            <Link
              href="/culture/ornaments"
              className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
            >
              Browse all
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {ORNAMENT_TEASERS.map((o) => (
              <Link
                key={o.name}
                href={o.href}
                className="rounded-full border border-amber-200/60 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:border-amber-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                {o.name}
                <span className="ml-1.5 font-normal text-zinc-400">{o.ml}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Editorial note */}
        <section className="rounded-xl border border-zinc-200/50 bg-zinc-50/60 p-4 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          <strong className="text-zinc-700 dark:text-zinc-300">Editorial standards:</strong>{" "}
          Communities are not interchangeable — practices described here are attributed to named
          communities, not generalised as &quot;Hindu&quot; or &quot;Christian.&quot; Every
          factual claim traces to a cited source. Cultural content is reviewed by named
          contributors before publication.
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60"
          >
            ← Today&apos;s Gold Rate
          </Link>
          <Link
            href="/tools/pavan-to-gram-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          >
            Gold Calculator →
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p className="font-medium">AKGSMA · For reference only</p>
          <p className="mt-1.5">© 2026 LiveGold Kerala</p>
        </div>
      </footer>
    </>
  );
}
