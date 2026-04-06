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

  const formatShortDate = (dString: string) => {
    return new Date(dString + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthName = new Date(history[0].date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { month: "short" }
  );

  return (
    <div className="w-full bg-gradient-to-r from-amber-50/90 via-amber-100/30 to-amber-50/90 py-1.5 px-2 text-center text-[10px] sm:text-[11px] font-semibold tracking-wide text-zinc-600 border-b border-amber-200/50 shadow-sm shadow-amber-100/20">
      <span className="uppercase text-amber-800 font-extrabold mr-1.5 sm:mr-2">{monthName} 22K <span className="hidden sm:inline">TREND</span></span>
      <span className="inline-block whitespace-nowrap">
        📈 Hi: <span className="text-zinc-900">{formatINR(highest.rate_22k_1g)}</span> <span className="font-medium text-zinc-400">({formatShortDate(highest.date)})</span>
      </span>
      <span className="mx-1.5 sm:mx-2 text-zinc-300">|</span>
      <span className="inline-block whitespace-nowrap">
        📉 Lo: <span className="text-zinc-900">{formatINR(lowest.rate_22k_1g)}</span> <span className="font-medium text-zinc-400">({formatShortDate(lowest.date)})</span>
      </span>
    </div>
  );
}
