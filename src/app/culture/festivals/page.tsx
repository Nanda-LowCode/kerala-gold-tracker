import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kerala Festival Gold Calendar 2026 — Vishu, Akshaya Tritiya, Onam Muhurat",
  description:
    "2026 festival dates and gold-buying muhurats for Kerala — Vishu (Apr 15), Akshaya Tritiya (Apr 19), Onam (Aug 25), Dhanteras, and Pushya Nakshatra dates with auspicious windows.",
  alternates: { canonical: "/culture/festivals" },
  openGraph: {
    title: "Kerala Festival Calendar 2026 — Gold Muhurat Dates",
    description: "Verified muhurat windows for Akshaya Tritiya, Vishu, Onam, and Dhanteras 2026.",
    url: "https://www.livegoldkerala.com/culture/festivals",
  },
};

type FestivalRow = {
  id: number;
  slug: string;
  name_en: string;
  name_ml: string;
  category: string | null;
  is_gold_buying_day: boolean;
};

type DateRow = {
  festival_id: number;
  date: string;
  muhurat_start: string | null;
  muhurat_end: string | null;
  notes: string | null;
};

async function getFestivalData() {
  try {
    const supabase = createSupabaseReadClient();
    const today = new Date().toISOString().split("T")[0];

    const [{ data: festivals }, { data: upcoming }, { data: past }] = await Promise.all([
      supabase
        .from("festivals")
        .select("id, slug, name_en, name_ml, category, is_gold_buying_day")
        .order("name_en", { ascending: true }),
      supabase
        .from("festival_dates")
        .select("festival_id, date, muhurat_start, muhurat_end, notes")
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(10),
      supabase
        .from("festival_dates")
        .select("festival_id, date, muhurat_start, muhurat_end, notes")
        .lt("date", today)
        .order("date", { ascending: false })
        .limit(4),
    ]);

    return {
      festivals: (festivals ?? []) as FestivalRow[],
      upcoming: (upcoming ?? []) as DateRow[],
      past: (past ?? []) as DateRow[],
    };
  } catch {
    return { festivals: [], upcoming: [], past: [] };
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function daysUntil(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00").getTime();
  const now = new Date().setHours(0, 0, 0, 0);
  return Math.round((d - now) / 86400000);
}

const CATEGORY_LABEL: Record<string, string> = {
  hindu: "Hindu",
  christian: "Christian",
  muslim: "Muslim",
  cultural: "Cultural",
  national: "National",
};

export default async function FestivalsPage() {
  const { festivals, upcoming, past } = await getFestivalData();
  const festivalMap = new Map(festivals.map((f) => [f.id, f]));

  const upcomingWithFestival = upcoming
    .map((d) => ({ ...d, festival: festivalMap.get(d.festival_id) }))
    .filter((d) => d.festival);

  const pastWithFestival = past
    .map((d) => ({ ...d, festival: festivalMap.get(d.festival_id) }))
    .filter((d) => d.festival);

  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">📅</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Link href="/culture" className="hover:text-zinc-600">Culture</Link>
              {" · "}Festivals &amp; Muhurat
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Kerala Festival Calendar 2026
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Verified dates and muhurat windows for major Kerala festivals. Gold-buying days
            are marked — days considered auspicious by tradition for purchasing gold jewellery.
          </p>
        </div>

        {/* Upcoming dates */}
        {upcomingWithFestival.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
              Upcoming dates
            </h2>
            <div className="space-y-2">
              {upcomingWithFestival.map((d) => {
                const until = daysUntil(d.date);
                return (
                  <div
                    key={d.date + d.festival_id}
                    className="flex flex-col gap-1.5 rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-start sm:gap-4"
                  >
                    <div className="shrink-0 rounded-xl bg-amber-50 px-3 py-2 text-center dark:bg-amber-950/20">
                      <p className="text-lg font-bold leading-none text-amber-700 dark:text-amber-400">
                        {new Date(d.date + "T00:00:00").getDate()}
                      </p>
                      <p className="text-[10px] font-semibold uppercase text-zinc-400">
                        {new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short" })}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {d.festival?.name_en}
                        </p>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          {d.festival?.name_ml}
                        </span>
                        {d.festival?.is_gold_buying_day && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            Gold day
                          </span>
                        )}
                        {until === 0 ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700 dark:bg-green-900/40 dark:text-green-400">
                            Today
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-400">in {until} days</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {formatDate(d.date)}
                      </p>
                      {d.muhurat_start && d.muhurat_end && (
                        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                          Muhurat: {formatTime(d.muhurat_start)} – {formatTime(d.muhurat_end)}
                        </p>
                      )}
                      {d.notes && (
                        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2">
                          {d.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Past dates (2026) */}
        {pastWithFestival.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Earlier in 2026
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {pastWithFestival.map((d) => (
                    <tr key={d.date + d.festival_id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/50">
                      <td className="px-4 py-3 text-xs text-zinc-400">{formatShortDate(d.date)}</td>
                      <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                        {d.festival?.name_en}
                        <span className="ml-2 text-xs font-normal text-zinc-400">{d.festival?.name_ml}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {d.festival?.is_gold_buying_day && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 ring-1 ring-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-800/40">
                            Gold day
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* All festivals grid */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
            All festivals
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {festivals.map((f) => (
              <div
                key={f.slug}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/60 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">{f.name_en}</p>
                  <p className="text-xs text-zinc-400">{f.name_ml}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {f.is_gold_buying_day && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      Gold day
                    </span>
                  )}
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {f.category ? CATEGORY_LABEL[f.category] : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          * Dates sourced from DrikPanchang and ProKerala. Muhurat timings calculated for Kerala (IST).
          Verify with a local panchangam for precise auspicious windows.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/culture" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Cultural Hub
          </Link>
          <Link href="/culture/temples" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Temples →
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Today&apos;s Rate →
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
