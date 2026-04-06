interface DayRate {
  date: string;
  rate_18k_1g: number;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function MonthlyHighLow({ history }: { history: DayRate[] }) {
  // Get current month in IST as "YYYY-MM" prefix for safe string matching
  const istToday = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); // "YYYY-MM-DD"
  const [year, month] = istToday.split("-");
  const monthPrefix = `${year}-${month}`;

  // Filter history to only current month
  const monthData = history.filter((d) => d.date.startsWith(monthPrefix));

  if (monthData.length === 0) return null;

  // Find high and low based on 22K rate
  const high = monthData.reduce((prev, curr) =>
    curr.rate_22k_1g > prev.rate_22k_1g ? curr : prev
  );
  const low = monthData.reduce((prev, curr) =>
    curr.rate_22k_1g < prev.rate_22k_1g ? curr : prev
  );

  const monthName = new Date(`${monthPrefix}-01T00:00:00`).toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" }
  );

  return (
    <section className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-lg shadow-amber-100/40">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          {monthName} · 22K Summary
        </p>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-zinc-900">
          Monthly High &amp; Low
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Per pavan (8g) price extremes this month
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Highest */}
        <div className="relative overflow-hidden rounded-xl border border-red-200/70 bg-gradient-to-br from-red-50 via-orange-50 to-red-50/40 p-5">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-300/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100/80 px-2 py-0.5 ring-1 ring-inset ring-red-200/70">
                <svg
                  className="h-3 w-3 text-red-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                  Highest
                </span>
              </div>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-red-700 sm:text-3xl">
              {fmt(high.rate_22k_1g * 8)}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-red-600/80">
              per pavan · {fmt(high.rate_22k_1g)}/g
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <svg
                className="h-3.5 w-3.5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <span className="font-medium text-zinc-600">
                {formatDate(high.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Lowest */}
        <div className="relative overflow-hidden rounded-xl border border-green-200/70 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50/40 p-5">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-green-300/25 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100/80 px-2 py-0.5 ring-1 ring-inset ring-green-200/70">
                <svg
                  className="h-3 w-3 text-green-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
                  Lowest
                </span>
              </div>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight text-green-700 sm:text-3xl">
              {fmt(low.rate_22k_1g * 8)}
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-green-600/80">
              per pavan · {fmt(low.rate_22k_1g)}/g
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <svg
                className="h-3.5 w-3.5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <span className="font-medium text-zinc-600">
                {formatDate(low.date)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
