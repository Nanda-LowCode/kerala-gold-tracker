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
      <div className="hidden md:block mx-auto w-full max-w-3xl px-4 pt-8">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-sm shadow-amber-900/5">
          <div className="mb-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-zinc-400">
              {monthNameLong} · 22K Summary
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
              Monthly High & Low
            </h3>
            <p className="mt-0.5 text-sm font-medium text-zinc-500">
              Per pavan (8g) price extremes this month
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Highest Card */}
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Highest
              </span>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-red-700">
                {formatINR(highest.rate_22k_1g * 8)}
              </p>
              <p className="mt-1 text-xs font-medium text-red-600/70">
                per pavan · {formatINR(highest.rate_22k_1g)}/g
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatShortDate(highest.date, true)}
              </div>
            </div>

            {/* Lowest Card */}
            <div className="rounded-xl border border-green-100 bg-green-50/50 p-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                Lowest
              </span>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-green-700">
                {formatINR(lowest.rate_22k_1g * 8)}
              </p>
              <p className="mt-1 text-xs font-medium text-green-600/70">
                per pavan · {formatINR(lowest.rate_22k_1g)}/g
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatShortDate(lowest.date, true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
