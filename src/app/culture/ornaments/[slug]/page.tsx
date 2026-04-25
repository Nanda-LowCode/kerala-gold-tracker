import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 86400;

type Ornament = {
  slug: string;
  name_en: string;
  name_ml: string | null;
  transliteration: string | null;
  community_tags: string[] | null;
  typical_weight_pavan_min: number | null;
  typical_weight_pavan_max: number | null;
  description_en: string | null;
  symbolism_en: string | null;
};

const COMMUNITY_LABEL: Record<string, string> = {
  nair: "Nair",
  namboothiri: "Namboothiri",
  ezhava: "Ezhava",
  "syrian-christian": "Syrian Christian",
  "mappila-muslim": "Mappila Muslim",
  "latin-catholic": "Latin Catholic",
  "marthoma": "Marthoma",
  "sunni-muslim": "Sunni Muslim",
};

async function getOrnament(slug: string): Promise<Ornament | null> {
  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase
      .from("ornaments")
      .select("slug, name_en, name_ml, transliteration, community_tags, typical_weight_pavan_min, typical_weight_pavan_max, description_en, symbolism_en")
      .eq("slug", slug)
      .single();
    return data as Ornament | null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase.from("ornaments").select("slug");
    return (data ?? []).map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ornament = await getOrnament(slug);
  if (!ornament) return { title: "Ornament Not Found" };

  const desc = ornament.description_en
    ? ornament.description_en.slice(0, 155)
    : `${ornament.name_en} — Kerala gold ornament. Etymology, symbolism, community tradition, and weight range.`;

  return {
    title: `${ornament.name_en} (${ornament.name_ml ?? ornament.transliteration ?? ornament.slug}) — Kerala Gold Ornament | LiveGold Kerala`,
    description: desc,
    alternates: { canonical: `/culture/ornaments/${slug}` },
    openGraph: {
      title: `${ornament.name_en} — Kerala Gold Ornament`,
      description: desc,
      url: `https://www.livegoldkerala.com/culture/ornaments/${slug}`,
    },
  };
}

export default async function OrnamentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ornament = await getOrnament(slug);
  if (!ornament) notFound();

  const PAVAN_GRAMS = 8;
  const minGrams = ornament.typical_weight_pavan_min
    ? ornament.typical_weight_pavan_min * PAVAN_GRAMS
    : null;
  const maxGrams = ornament.typical_weight_pavan_max
    ? ornament.typical_weight_pavan_max * PAVAN_GRAMS
    : null;

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
              {" · "}
              <Link href="/culture/ornaments" className="hover:text-zinc-600">Ornaments</Link>
              {" · "}{ornament.name_en}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            {ornament.name_en}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {ornament.name_ml && (
              <span className="text-base text-zinc-500 dark:text-zinc-400">{ornament.name_ml}</span>
            )}
            {ornament.transliteration && (
              <span className="text-sm italic text-zinc-400 dark:text-zinc-500">{ornament.transliteration}</span>
            )}
          </div>
          {ornament.community_tags && ornament.community_tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ornament.community_tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-800/30"
                >
                  {COMMUNITY_LABEL[tag] ?? tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {ornament.description_en && (
          <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
            <p>{ornament.description_en}</p>
          </div>
        )}

        {ornament.symbolism_en && (
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Symbolism</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
              {ornament.symbolism_en}
            </p>
          </section>
        )}

        {(ornament.typical_weight_pavan_min || ornament.typical_weight_pavan_max) && (
          <section className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-5 py-4 dark:border-amber-800/30 dark:bg-amber-950/10">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Typical Weight Range
            </h2>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">In Pavan</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {ornament.typical_weight_pavan_min ?? "—"}–{ornament.typical_weight_pavan_max ?? "—"} pavan
                </p>
              </div>
              {minGrams && maxGrams && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">In Grams (1 pavan = 8 g)</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {minGrams}–{maxGrams} g
                  </p>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              Weight ranges are typical; actual pieces vary by jeweller and design.
            </p>
            <Link
              href="/tools/pavan-to-gram-calculator"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
            >
              Calculate live price with today&apos;s rate →
            </Link>
          </section>
        )}

        <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400">
          <strong>Note:</strong> This encyclopaedia is maintained with care but is for cultural reference only. Weight ranges are typical; consult a certified jeweller for purchase decisions. Gold prices fluctuate daily — use the calculator above for live pricing.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/culture/ornaments" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Ornament Encyclopaedia
          </Link>
          <Link href="/culture/weddings/budget-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Wedding Budget Calculator →
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
