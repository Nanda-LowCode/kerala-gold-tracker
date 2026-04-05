import { createSupabaseClient } from "@/lib/supabase";

interface GoldRate {
  date: string;
  city: string;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

async function getLatestRate(): Promise<GoldRate | null> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("date, city, rate_22k_1g, rate_24k_1g")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data as GoldRate;
  } catch {
    return null;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const revalidate = 300; // revalidate every 5 minutes

export default async function Home() {
  const rate = await getLatestRate();

  return (
    <>
      <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <h1 className="text-xl font-bold text-amber-900 sm:text-2xl">
            Kerala Gold Tracker
          </h1>
          <p className="text-sm text-amber-700">
            Daily gold rates for Kochi, Kerala
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
        {rate ? (
          <>
            {/* Date */}
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">
                Last updated
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {formatDate(rate.date)}
              </p>
              <p className="mt-1 text-sm text-gray-500">{rate.city}</p>
            </div>

            {/* Rate Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <RateCard
                label="22 Karat Gold"
                ratePerGram={rate.rate_22k_1g}
              />
              <RateCard
                label="24 Karat Gold"
                ratePerGram={rate.rate_24k_1g}
              />
            </div>

            {/* Sovereign (8g) Section */}
            <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
                Per Sovereign (8 Grams)
              </h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-500">22K</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {formatCurrency(rate.rate_22k_1g * 8)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">24K</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {formatCurrency(rate.rate_24k_1g * 8)}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </main>

      <footer className="border-t border-amber-100 py-6 text-center text-xs text-gray-400">
        <p>Data sourced from Malabar Gold & Diamonds. For reference only.</p>
      </footer>
    </>
  );
}

function RateCard({
  label,
  ratePerGram,
}: {
  label: string;
  ratePerGram: number;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-amber-900">
        {formatCurrency(ratePerGram)}
      </p>
      <p className="mt-1 text-sm text-gray-400">per gram</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
      <div className="rounded-full bg-amber-100 p-4">
        <svg
          className="h-8 w-8 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-700">
        Rates coming soon
      </h2>
      <p className="max-w-xs text-sm text-gray-500">
        Gold rates will appear here once the first data update runs. Check back
        shortly!
      </p>
    </div>
  );
}
