import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kerala Gold Ornament Encyclopaedia — Palakka Mala, Kumbla Thali, Minnu & More",
  description:
    "23 Kerala gold ornaments documented — Palakka Mala, Kasu Mala, Kumbla Thali, Minnu, Oddiyanam, Arappatta and more. Etymology, symbolism, community association, weight ranges.",
  alternates: { canonical: "/culture/ornaments" },
  openGraph: {
    title: "Kerala Gold Ornament Encyclopaedia",
    description: "23 Kerala gold ornaments — etymology, symbolism, and community traditions.",
    url: "https://www.livegoldkerala.com/culture/ornaments",
  },
};

type Ornament = {
  slug: string;
  name_en: string;
  name_ml: string | null;
  transliteration: string | null;
  community_tags: string[] | null;
  typical_weight_pavan_min: number | null;
  typical_weight_pavan_max: number | null;
};

const COMMUNITY_LABEL: Record<string, string> = {
  nair: "Nair",
  namboothiri: "Namboothiri",
  ezhava: "Ezhava",
  "syrian-christian": "Syrian Christian",
  "mappila-muslim": "Mappila Muslim",
};

async function getOrnaments(): Promise<Ornament[]> {
  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase
      .from("ornaments")
      .select("slug, name_en, name_ml, transliteration, community_tags, typical_weight_pavan_min, typical_weight_pavan_max")
      .order("name_en", { ascending: true });
    return (data ?? []) as Ornament[];
  } catch {
    return [];
  }
}

export default async function OrnamentsPage() {
  const ornaments = await getOrnaments();

  // Group by primary community tag
  const hindu = ornaments.filter((o) =>
    o.community_tags?.some((t) => ["nair", "namboothiri", "ezhava"].includes(t)) &&
    !o.community_tags?.includes("mappila-muslim") &&
    !o.community_tags?.includes("syrian-christian")
  );
  const christian = ornaments.filter((o) => o.community_tags?.includes("syrian-christian"));
  const muslim = ornaments.filter((o) => o.community_tags?.includes("mappila-muslim"));

  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">✨</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Link href="/culture" className="hover:text-zinc-600">Culture</Link>
              {" · "}Ornament Encyclopaedia
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Kerala Gold Ornament Encyclopaedia
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {ornaments.length} ornaments documented — etymology, symbolism, community association,
            typical weight ranges, and live price reference. Sacred ornaments are described
            without monetary valuation.
          </p>
        </div>

        {[
          { label: "Hindu tradition", items: hindu },
          { label: "Syrian Christian tradition", items: christian },
          { label: "Mappila Muslim tradition", items: muslim },
        ].map(({ label, items }) => items.length > 0 && (
          <section key={label} className="space-y-3">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">{label}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((o) => (
                <Link
                  key={o.slug}
                  href={`/culture/ornaments/${o.slug}`}
                  className="group flex flex-col gap-1 rounded-xl border border-zinc-200/60 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
                        {o.name_en}
                      </p>
                      {o.name_ml && (
                        <p className="text-xs text-zinc-400">{o.name_ml}</p>
                      )}
                    </div>
                    {o.typical_weight_pavan_min && (
                      <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-800/30">
                        {o.typical_weight_pavan_min}–{o.typical_weight_pavan_max} pavan
                      </span>
                    )}
                  </div>
                  {o.community_tags && o.community_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {o.community_tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] text-zinc-400">
                          {COMMUNITY_LABEL[tag] ?? tag}
                          {o.community_tags!.indexOf(tag) < Math.min(o.community_tags!.length, 3) - 1 ? " ·" : ""}
                        </span>
                      ))}
                      {o.community_tags.length > 3 && (
                        <span className="text-[10px] text-zinc-400">+{o.community_tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/culture" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Cultural Hub
          </Link>
          <Link href="/culture/weddings" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Wedding Traditions →
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
