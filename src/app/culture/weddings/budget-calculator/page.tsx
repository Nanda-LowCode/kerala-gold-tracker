import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { WeddingCommunity } from "@/lib/database.types";
import WeddingBudgetCalculator from "@/components/WeddingBudgetCalculator";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kerala Wedding Gold Budget Calculator — All Communities | LiveGold Kerala",
  description:
    "Estimate gold jewellery cost for a Kerala wedding. Supports Nair, Namboothiri, Ezhava, Syrian Christian, Mappila Muslim, and more. Includes making charge, GST, Mahr input.",
  alternates: { canonical: "/culture/weddings/budget-calculator" },
  openGraph: {
    title: "Kerala Wedding Gold Budget Calculator",
    description: "Estimate wedding gold cost by community — live 22K rate, making charge, GST.",
    url: "https://www.livegoldkerala.com/culture/weddings/budget-calculator",
  },
};

export type OrnamentRow = {
  slug: string;
  name_en: string;
  name_ml: string | null;
  community: WeddingCommunity;
  default_pavan: number | null;
  is_required: boolean;
  notes: string | null;
};

async function getData(): Promise<{ ornaments: OrnamentRow[]; rate22k: number | null }> {
  const supabase = createSupabaseReadClient();

  const [defaultsResult, ornamentsResult, rateResult] = await Promise.all([
    supabase
      .from("wedding_ornament_defaults")
      .select("community, ornament_id, default_pavan, is_required, notes"),
    supabase
      .from("ornaments")
      .select("id, slug, name_en, name_ml"),
    supabase
      .from("daily_gold_rates")
      .select("rate_22k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const ornamentMap = new Map(
    (ornamentsResult.data ?? []).map((o) => [o.id, o])
  );

  const rows: OrnamentRow[] = (defaultsResult.data ?? []).flatMap((d) => {
    const orn = ornamentMap.get(d.ornament_id);
    if (!orn) return [];
    return [{
      slug: orn.slug,
      name_en: orn.name_en,
      name_ml: orn.name_ml ?? null,
      community: d.community as WeddingCommunity,
      default_pavan: d.default_pavan ?? null,
      is_required: d.is_required,
      notes: d.notes ?? null,
    }];
  });

  const rate22k = rateResult.data?.rate_22k_1g ?? null;

  return { ornaments: rows, rate22k };
}

export default async function BudgetCalculatorPage() {
  const { ornaments, rate22k } = await getData();

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
              <Link href="/culture/weddings" className="hover:text-zinc-600">Weddings</Link>
              {" · "}Budget Calculator
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Wedding Gold Budget Calculator
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Estimate gold jewellery cost for a Kerala wedding. Select your community, adjust quantities,
            set making charge, and get a live estimate based on today&apos;s 22K rate.
          </p>
          {rate22k && (
            <p className="mt-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              Live 22K rate (Kochi): ₹{rate22k.toLocaleString("en-IN")}/g
            </p>
          )}
        </div>

        <WeddingBudgetCalculator ornaments={ornaments} rate22k={rate22k ?? 0} />

        <div className="rounded-lg border border-zinc-100 bg-zinc-50/50 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400">
          <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only.
          Actual jewellery prices depend on the specific jeweller, design, making charges, stone
          settings, and other factors. For Mappila Muslim families, Mahr is the bride&apos;s absolute
          property by Islamic law — it is not dowry. Verify current gold rates with certified jewellers
          before making purchase decisions.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/culture/weddings" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Wedding Traditions
          </Link>
          <Link href="/tools/pavan-to-gram-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Pavan Calculator →
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
