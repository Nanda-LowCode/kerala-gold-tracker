import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kerala Temples & Sacred Gold — Sabarimala, Guruvayur, Padmanabhaswamy",
  description:
    "Sacred gold traditions of Kerala's major temples — Thiruvabharanam at Sabarimala, Thulabharam at Guruvayur, the Padmanabhaswamy vaults, Thrissur Pooram, and more.",
  alternates: { canonical: "/culture/temples" },
  openGraph: {
    title: "Kerala Temples & Sacred Gold",
    description:
      "Sacred ornaments, rituals, and traditions at Sabarimala, Guruvayur, Padmanabhaswamy, and 6 more major Kerala temples.",
    url: "https://www.livegoldkerala.com/culture/temples",
  },
};

type Temple = {
  slug: string;
  name_en: string | null;
  name_ml: string | null;
  district: string | null;
  deity: string | null;
  lat: number | null;
  lng: number | null;
};

async function getTemples(): Promise<Temple[]> {
  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase
      .from("temples")
      .select("slug, name_en, name_ml, district, deity, lat, lng")
      .order("name_en", { ascending: true });
    return (data ?? []) as Temple[];
  } catch {
    return [];
  }
}

function mapsUrl(t: Temple): string {
  if (t.lat && t.lng) return `https://maps.google.com/?q=${t.lat},${t.lng}`;
  return `https://maps.google.com/?q=${encodeURIComponent((t.name_en ?? "") + " temple Kerala")}`;
}

// Highlight content for the 3 anchor temples
const FEATURED: Record<string, { summary: string; highlight: string }> = {
  sabarimala: {
    summary:
      "The Thiruvabharanam — Lord Ayyappa's sacred ornaments — travel 83 km on foot from Pandalam to Sabarimala each January. The procession is one of the most significant rituals in Kerala's pilgrimage tradition.",
    highlight: "Thiruvabharanam procession",
  },
  guruvayur: {
    summary:
      "Thulabharam is performed here daily: devotees are weighed against an offering — banana, jaggery, or gold — as a form of complete devotion. Gold Thulabharam is the most revered variant.",
    highlight: "Gold Thulabharam",
  },
  padmanabhaswamy: {
    summary:
      "The 2011 Supreme Court-ordered discovery revealed one of the world's largest collections of gold and precious stones, accumulated over millennia from Sangam-era rulers to the Travancore dynasty.",
    highlight: "Historic treasure",
  },
};

export default async function TemplesPage() {
  const temples = await getTemples();

  const featured = temples.filter((t) => t.slug in FEATURED);
  const others = temples.filter((t) => !(t.slug in FEATURED));

  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">🛕</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Link href="/culture" className="hover:text-zinc-600">Culture</Link>
              {" · "}Temples &amp; Sacred Gold
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Temples &amp; Sacred Gold
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Kerala&apos;s major temples hold some of the subcontinent&apos;s most significant
            collections of sacred gold — not as wealth, but as offerings accumulated over
            millennia of devotion. These pages document the ornaments, rituals, and traditions
            associated with each temple.
          </p>
        </div>

        {/* Important notice */}
        <div className="rounded-xl border border-amber-200/50 bg-amber-50/40 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/10 dark:text-amber-300">
          Sacred ornaments are not commodities. These pages describe traditions and history;
          they do not estimate the monetary value of temple gold or sacred objects.
        </div>

        {/* Featured temples (with detailed content) */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
            Anchor temples
          </h2>
          <div className="space-y-3">
            {featured.map((t) => {
              const info = FEATURED[t.slug];
              return (
                <Link
                  key={t.slug}
                  href={`/culture/temples/${t.slug}`}
                  className="group flex flex-col gap-2 rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-zinc-900 group-hover:text-amber-700 dark:text-zinc-100 dark:group-hover:text-amber-400">
                        {t.name_en}
                      </p>
                      <p className="text-xs text-zinc-400">{t.name_ml} · {t.district}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      {info.highlight}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {info.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      Read more →
                    </span>
                    <a
                      href={mapsUrl(t)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                      Google Maps
                    </a>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Other temples */}
        {others.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
              More temples
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {others.map((t) => (
                <Link
                  key={t.slug}
                  href={`/culture/temples/${t.slug}`}
                  className="group rounded-xl border border-zinc-200/60 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40"
                >
                  <p className="font-medium text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
                    {t.name_en}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">{t.name_ml} · {t.district}</p>
                  {t.deity && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{t.deity}</p>
                  )}
                  <a
                    href={mapsUrl(t)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                    Google Maps
                  </a>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
            Gold in Kerala&apos;s temple tradition
          </h2>
          <p>
            Temple gold in Kerala serves a fundamentally different purpose than market gold. It
            accumulates through vazhipadu (offerings) over centuries and is considered the
            property of the deity — administered by devaswom boards, not traded. The Travancore
            Devaswom Board, Cochin Devaswom Board, and Guruvayur Devaswom are the principal
            administrative bodies.
          </p>
          <p>
            The practice of weighing devotees against gold (Thulabharam) at Guruvayur, or
            adorning the deity with the Thiruvabharanam at Sabarimala, reflects the theological
            principle that gold given with devotion transcends its material value. This
            distinction — between sacred gold and commodity gold — is central to understanding
            these traditions.
          </p>
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
