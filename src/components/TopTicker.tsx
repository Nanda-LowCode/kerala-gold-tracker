import React from 'react';

interface GoldRate {
  date: string;
  city: string;
  rate_18k_1g: number;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

export default function TopTicker({ history }: { history: GoldRate[] }) {
  if (!history || history.length < 2) return null;
  
  const latestDateStr = history[0].date;
  const latestMonth = latestDateStr.substring(0, 7); 
  
  const currentMonthData = history.filter((r) => r.date.startsWith(latestMonth));

  if (currentMonthData.length < 2) return null;

  const sortedBy22k = [...currentMonthData].sort(
    (a, b) => a.rate_22k_1g - b.rate_22k_1g
  );
  
  const lowest = sortedBy22k[0];
  const highest = sortedBy22k[sortedBy22k.length - 1];

  if (lowest.rate_22k_1g === highest.rate_22k_1g) return null;

  const formatShortDate = (dString: string, full = false) => {
    return new Date(dString + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      weekday: full ? "short" : undefined,
    });
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthNameShort = new Date(history[0].date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { month: "short" }
  );

  const monthNameLong = new Date(history[0].date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { month: "long", year: "numeric" }
  );

  return (
    <>
      {/* MOBILE TICKER: Hidden on md screens */}
      <div className="md:hidden w-full bg-gradient-to-r from-amber-50/90 via-amber-100/30 to-amber-50/90 py-1.5 px-2 text-center text-[10px] sm:text-[11px] font-semibold tracking-wide text-zinc-600 border-b border-amber-200/50 shadow-sm shadow-amber-100/20">
        <span className="uppercase text-amber-800 font-extrabold mr-1.5 sm:mr-2">{monthNameShort} 22K</span>
        <span className="inline-block whitespace-nowrap">
          📈 Hi: <span className="text-zinc-900">{formatINR(highest.rate_22k_1g)}</span> <span className="font-medium text-zinc-400">({formatShortDate(highest.date)})</span>
        </span>
        <span className="mx-1.5 sm:mx-2 text-zinc-300">|</span>
        <span className="inline-block whitespace-nowrap">
          📉 Lo: <span className="text-zinc-900">{formatINR(lowest.rate_22k_1g)}</span> <span className="font-medium text-zinc-400">({formatShortDate(lowest.date)})</span>
        </span>
      </div>

      {/* DESKTOP DASHBOARD WIDGET: Hidden on mobile screens */}
      <div className="hidden md:block mx-auto w-full max-w-3xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm shadow-amber-900/5">
          <div className="flex items-center justify-between">
            <div className="mb-0">
              <h3 className="text-base font-bold tracking-tight text-zinc-900">
                {monthNameLong} High & Low
              </h3>
              <p className="mt-0.5 text-xs font-medium text-zinc-500">
                22K Per Pavan extremes
              </p>
            </div>
            
            <div className="flex gap-4">
              {/* Highest Card */}
              <div className="rounded-lg border border-red-100 bg-red-50/50 px-4 py-2 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-0.5 flex items-center justify-end gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Highest ({formatShortDate(highest.date, false)})
                </p>
                <p className="text-xl font-extrabold tracking-tight text-red-700">
                  {formatINR(highest.rate_22k_1g * 8)}
                </p>
              </div>

              {/* Lowest Card */}
              <div className="rounded-lg border border-green-100 bg-green-50/50 px-4 py-2 text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-green-700 mb-0.5 flex items-center justify-end gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  Lowest ({formatShortDate(lowest.date, false)})
                </p>
                <p className="text-xl font-extrabold tracking-tight text-green-700">
                  {formatINR(lowest.rate_22k_1g * 8)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
