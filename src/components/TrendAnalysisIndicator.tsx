import React from "react";
import { GoldRate } from "@/lib/types";
import { TrendingUp, TrendingDown, Clock, Info } from "lucide-react";

export default function TrendAnalysisIndicator({ history }: { history: GoldRate[] }) {
  if (!history || history.length < 5) return null;

  const todayStr = history[0].date;
  const todayRate = history[0].rate_22k_1g;
  
  // Look at last 15 days (or max available up to 15)
  const recentHistory = history.slice(0, 15);
  
  let minRate = Infinity;
  let maxRate = -Infinity;
  
  recentHistory.forEach((day) => {
    if (day.rate_22k_1g < minRate) minRate = day.rate_22k_1g;
    if (day.rate_22k_1g > maxRate) maxRate = day.rate_22k_1g;
  });

  const isLow = todayRate <= minRate;
  const isHigh = todayRate >= maxRate;
  
  // 7-day trend analysis
  const weekAgo = history[Math.min(7, history.length - 1)].rate_22k_1g;
  const weeklyDelta = todayRate - weekAgo;
  
  let insight = "";
  let type: "neutral" | "positive" | "negative" | "warning" = "neutral";

  if (isLow && recentHistory.length >= 7) {
    insight = `Price is at a ${recentHistory.length}-day low. Potentially a good time to buy.`;
    type = "positive";
  } else if (isHigh && recentHistory.length >= 7) {
    insight = `Price is at a ${recentHistory.length}-day peak.`;
    type = "warning";
  } else if (weeklyDelta > 150) {
    insight = `Rapid upward trend detected this week (Up ₹${weeklyDelta}/g).`;
    type = "negative"; // bad for buyers
  } else if (weeklyDelta < -150) {
    insight = `Strong downward trend this week (Down ₹${Math.abs(weeklyDelta)}/g).`;
    type = "positive"; // good for buyers
  } else {
    // We don't render anything if there's no strong signal.
    // Or we could show a neutral message:
    insight = `Price is relatively stable over the last 7 days.`;
    type = "neutral";
  }
  
  // If no insight generated, don't mount
  if (!insight) return null;

  const getStyles = () => {
    switch (type) {
      case "positive":
        return {
          bg: "bg-green-50 dark:bg-green-950/40",
          border: "border-green-200/60 dark:border-green-900/50",
          text: "text-green-800 dark:text-green-300",
          icon: <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400" />
        };
      case "negative":
        return {
          bg: "bg-red-50 dark:bg-red-950/40",
          border: "border-red-200/60 dark:border-red-900/50",
          text: "text-red-800 dark:text-red-300",
          icon: <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
        };
      case "warning":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/40",
          border: "border-amber-200/60 dark:border-amber-900/50",
          text: "text-amber-800 dark:text-amber-300",
          icon: <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        };
      default:
        return {
          bg: "bg-zinc-50 dark:bg-zinc-900/50",
          border: "border-zinc-200/60 dark:border-zinc-800",
          text: "text-zinc-700 dark:text-zinc-300",
          icon: <Clock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        };
    }
  };

  const st = getStyles();

  return (
    <div className={`mb-4 flex sm:inline-flex items-center gap-2.5 rounded-2xl sm:rounded-full border px-4 py-2.5 shadow-sm backdrop-blur-md transition-all ${st.bg} ${st.border}`}>
      <div className="shrink-0 p-1 bg-white/50 dark:bg-black/20 rounded-full">
         {st.icon}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 opacity-80 shrink-0">
          AI Trend Logic
        </span>
        <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
        <span className={`text-sm font-semibold tracking-tight ${st.text}`}>
          {insight}
        </span>
      </div>
    </div>
  );
}
