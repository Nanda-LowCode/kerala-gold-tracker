import { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kerala Wedding Gold Traditions by Community — Nair, Syrian Christian, Mappila Muslim",
  description:
    "Community-specific bridal gold traditions in Kerala — Nair Kumbla Thali, Namboothiri Malarthi Thali, Syrian Christian Minnu, Mappila Muslim Valayidal and Mahr. Wedding budget calculator included.",
  alternates: { canonical: "/culture/weddings" },
  openGraph: {
    title: "Kerala Wedding Gold Traditions by Community",
    description:
      "Nair, Namboothiri, Ezhava, Syrian Christian, Latin Catholic, Mappila Muslim wedding gold customs — with budget calculator.",
    url: "https://www.livegoldkerala.com/culture/weddings",
  },
};

const COMMUNITIES = [
  {
    slug: "nair",
    href: "/culture/weddings/hindu/nair",
    name: "Nair",
    tradition: "Hindu",
    thali: "Kumbla Thali (കുമ്പ്ള താലി)",
    note: "Leaf-shaped Thali. Talikettu ceremony. Kasavu saree. Sadya feast.",
    keyOrnaments: ["Kumbla Thali", "Kasu Mala", "Palakka Mala", "Oddiyanam"],
  },
  {
    slug: "namboothiri",
    href: "/culture/weddings/hindu/namboothiri",
    name: "Namboothiri",
    tradition: "Hindu",
    thali: "Malarthi Thali (മലർത്തി താലി)",
    note: "4-day ritual sequence. Simpler bridal ornament set despite elaborate ceremony.",
    keyOrnaments: ["Malarthi Thali", "Netti Chutti", "Thadavala bangles"],
  },
  {
    slug: "ezhava",
    href: "/culture/weddings/hindu/ezhava",
    name: "Ezhava",
    tradition: "Hindu",
    thali: "Community Thali",
    note: "Shares several ornament traditions with Nair community; distinct ceremonial customs.",
    keyOrnaments: ["Thali", "Manga Mala", "Palakka Mala", "Mullamottu Mala"],
  },
  {
    slug: "syrian-christian",
    href: "/culture/weddings/christian/syrian",
    name: "Syrian Christian",
    tradition: "Christian",
    thali: "Minnu (മിന്ന്)",
    note: "Leaf-shaped pendant with embedded cross. Minnukettu parallels Talikettu. Manthrakodi saree gifted by groom.",
    keyOrnaments: ["Minnu", "Karimani Mala", "Manthrakodi"],
  },
  {
    slug: "latin-catholic",
    href: "/culture/weddings/christian/latin",
    name: "Latin Catholic",
    tradition: "Christian",
    thali: "Wedding ring (primary)",
    note: "Coastal communities; more western influence. Wedding ring central; gold customs vary by family.",
    keyOrnaments: ["Wedding ring", "Chains", "Bangles"],
  },
  {
    slug: "marthoma",
    href: "/culture/weddings/christian/marthoma",
    name: "Marthoma",
    tradition: "Christian",
    thali: "Distinct from Syrian Catholic",
    note: "Reformed Syrian tradition. Church ceremony central. Gold customs broadly similar to Syrian Christian but distinct liturgically.",
    keyOrnaments: ["Minnu (variant)", "Chains", "Bangles"],
  },
  {
    slug: "mappila-muslim",
    href: "/culture/weddings/muslim/mappila",
    name: "Mappila (Malabar)",
    tradition: "Muslim",
    thali: "Mahr (mandatory gift, groom to bride)",
    note: "Valayidal: groom's family gifts gold bangles to bride. Mailanchi Raavu. Nikah with Mahr. Mahr is the bride's right — not dowry.",
    keyOrnaments: ["Valayidal bangles", "Jhoomar", "Arappatta", "Mahr"],
  },
  {
    slug: "sunni-muslim",
    href: "/culture/weddings/muslim/sunni",
    name: "Sunni Muslim",
    tradition: "Muslim",
    thali: "Mahr (mandatory)",
    note: "Kerala Sunni tradition. Mahr amount agreed before Nikah. Gold gifted to bride becomes her sole property.",
    keyOrnaments: ["Mahr", "Bangles", "Necklaces"],
  },
];

const TRADITION_COLOR: Record<string, string> = {
  Hindu: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Christian: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Muslim: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export default function WeddingsPage() {
  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">💍</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Link href="/culture" className="hover:text-zinc-600">Culture</Link>
              {" · "}Wedding Traditions
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Wedding Gold Traditions by Community
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Kerala&apos;s communities have distinct bridal gold customs shaped by centuries of
            tradition. Each community is documented separately — Nair, Namboothiri, Ezhava,
            Syrian Christian, Latin Catholic, Marthoma, Mappila Muslim, and Sunni Muslim
            practices are not interchangeable.
          </p>
        </div>

        {/* Editorial note */}
        <div className="rounded-xl border border-zinc-200/50 bg-zinc-50/60 px-4 py-3 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          <strong className="text-zinc-700 dark:text-zinc-300">How to read these pages:</strong>{" "}
          Phrasing is descriptive — &quot;In Nair tradition…&quot; or &quot;Some families…&quot; — never
          universal. Ornament weights are indicative community averages, not requirements.
          The Mahr in Muslim traditions is the bride&apos;s right by Islamic law — it flows from
          groom to bride and must never be confused with dowry.
        </div>

        {/* Community cards */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
            Select a community
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {COMMUNITIES.map((c) => (
              <Link
                key={c.slug}
                href={c.href}
                className="group flex flex-col gap-3 rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-zinc-900 group-hover:text-amber-700 dark:text-zinc-100 dark:group-hover:text-amber-400">
                    {c.name}
                  </p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${TRADITION_COLOR[c.tradition]}`}>
                    {c.tradition}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    Central ornament
                  </p>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">{c.thali}</p>
                </div>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{c.note}</p>
                <div className="flex flex-wrap gap-1">
                  {c.keyOrnaments.map((o) => (
                    <span key={o} className="rounded-full border border-zinc-200/60 px-2 py-0.5 text-[10px] text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      {o}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Budget calculator CTA */}
        <section className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-5 dark:border-amber-800/30 dark:bg-amber-950/10">
          <h2 className="font-bold text-zinc-800 dark:text-zinc-100">
            Wedding Budget Calculator
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Select your community, toggle ornaments on/off, adjust pavan weights, and get
            an instant estimate with making charges and GST — all at today&apos;s Kerala board rate.
          </p>
          <Link
            href="/culture/weddings/budget-calculator"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
          >
            Open budget calculator →
          </Link>
        </section>

        {/* Glossary teaser */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            Wedding ornament glossary
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Thali", "Minnu", "Mahr", "Valayidal", "Manthrakodi", "Kumbla", "Malarthi", "Talikettu", "Minnukettu", "Nikah"].map((term) => (
              <Link
                key={term}
                href={`/culture/weddings/glossary/${term.toLowerCase()}`}
                className="rounded-full border border-zinc-200/60 bg-white px-3 py-1 text-xs font-medium text-zinc-600 hover:border-amber-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              >
                {term}
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/culture" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Cultural Hub
          </Link>
          <Link href="/culture/festivals" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Festival Calendar →
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
