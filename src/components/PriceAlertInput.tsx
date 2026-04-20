"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, X } from "lucide-react";

async function getSubscriptionEndpoint(): Promise<string | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub?.endpoint ?? null;
  } catch {
    return null;
  }
}

export default function PriceAlertInput({ currentRate }: { currentRate: number }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [targetRate, setTargetRate] = useState("");
  const [savedTarget, setSavedTarget] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    // Check if user has push enabled and load saved alert from localStorage
    getSubscriptionEndpoint().then((ep) => {
      if (ep) {
        setIsSubscribed(true);
        const stored = localStorage.getItem("gold_alert_target");
        if (stored) setSavedTarget(Number(stored));
      }
    });
  }, []);

  if (!isSubscribed) return null;

  async function handleSave() {
    const rate = Number(targetRate);
    if (!rate || rate < 1000 || rate > 200000) return;

    setStatus("saving");
    const endpoint = await getSubscriptionEndpoint();
    if (!endpoint) { setStatus("error"); return; }

    const res = await fetch("/api/notifications/set-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, targetRate: rate }),
    });

    if (res.ok) {
      setSavedTarget(rate);
      localStorage.setItem("gold_alert_target", String(rate));
      setTargetRate("");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  async function handleClear() {
    const endpoint = await getSubscriptionEndpoint();
    if (!endpoint) return;
    await fetch("/api/notifications/set-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, targetRate: null }),
    });
    setSavedTarget(null);
    localStorage.removeItem("gold_alert_target");
  }

  return (
    <section className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
      <div className="mb-3 flex items-center gap-2">
        <BellRing className="h-4 w-4 text-amber-600 dark:text-amber-500" />
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Price Drop Alert</h3>
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
          22K
        </span>
      </div>

      {savedTarget ? (
        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 dark:border-green-900/50 dark:bg-green-950/30">
          <div>
            <p className="text-xs font-medium text-green-800 dark:text-green-300">
              Alert set — notify when 22K drops to
            </p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">
              ₹{savedTarget.toLocaleString("en-IN")}/g
            </p>
            <p className="text-[11px] text-green-600/70 dark:text-green-600">
              Current rate: ₹{currentRate.toLocaleString("en-IN")}/g
            </p>
          </div>
          <button
            onClick={handleClear}
            className="rounded-full p-1.5 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/40"
            aria-label="Clear alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400">₹</span>
            <input
              type="number"
              min={1000}
              max={200000}
              step={10}
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder={`e.g. ${Math.floor(currentRate * 0.97).toLocaleString("en-IN")}`}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-7 pr-3 text-sm font-medium text-zinc-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={status === "saving" || !targetRate}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-600 disabled:opacity-50 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            <Bell className="h-3.5 w-3.5" />
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved!" : "Set Alert"}
          </button>
        </div>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs text-red-500">Failed to save alert. Try again.</p>
      )}
      {!savedTarget && (
        <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
          You&apos;ll get a push notification when 22K gold drops to your target price.
        </p>
      )}
    </section>
  );
}
