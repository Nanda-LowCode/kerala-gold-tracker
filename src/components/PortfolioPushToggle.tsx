"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import type { PortfolioTotals } from "@/lib/holdings";

/**
 * Opt-in toggle for personalised portfolio push notifications.
 *
 * When on, the daily rate cron sends "your gold: ₹X,XX,XXX (▲ ₹Y today)"
 * instead of the generic rate — the retention half of /my-gold, since a
 * cold visitor with no reason to return will stop returning.
 *
 * Design notes:
 * - Preference lives in localStorage so it's remembered per browser, matching
 *   the tracker's own storage model.
 * - Turning it on subscribes to push if the user hasn't already (or reuses
 *   the existing site-wide subscription — one browser = one endpoint).
 * - Totals sync whenever the toggle is on *and* they change, so a returning
 *   user's next-day notification reflects any edits.
 * - Only totals per karat and (optionally) cost basis leave the browser.
 *   Dates and labels never touch the server.
 * - Turning it off sends an all-zero payload; the server treats that as a
 *   clear, so the user reverts to the generic rate broadcast.
 */

const OPT_IN_KEY = "livegold_portfolio_push_v1";

async function getSubscriptionEndpoint(): Promise<string | null> {
  if (typeof navigator === "undefined") return null;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return sub?.endpoint ?? null;
  } catch {
    return null;
  }
}

export default function PortfolioPushToggle({ totals }: { totals: PortfolioTotals }) {
  const { isSupported, isSubscribed, isLoading, subscribe } = usePushNotifications();

  const [optedIn, setOptedIn] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [errored, setErrored] = useState(false);

  // Read persisted preference after mount. This runs once — after that,
  // toggle actions update it directly.
  useEffect(() => {
    try {
      setOptedIn(localStorage.getItem(OPT_IN_KEY) === "1");
    } catch {
      // ignore
    }
  }, []);

  const lastPayloadRef = useRef<string>("");

  const sync = useCallback(
    async (grams18k: number, grams22k: number, grams24k: number, cost: number | null) => {
      const endpoint = await getSubscriptionEndpoint();
      if (!endpoint) return;

      const payload = { endpoint, grams18k, grams22k, grams24k, cost };
      const key = JSON.stringify(payload);
      // Skip if nothing changed vs. the last successful sync — this effect
      // fires on every totals recompute (add/edit/delete) and we don't want
      // a network round-trip for a no-op.
      if (key === lastPayloadRef.current) return;

      setSyncing(true);
      try {
        const res = await fetch("/api/notifications/set-portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: key,
        });
        if (!res.ok) throw new Error(String(res.status));
        lastPayloadRef.current = key;
        setErrored(false);
      } catch {
        setErrored(true);
      } finally {
        setSyncing(false);
      }
    },
    []
  );

  // While opted in, mirror any totals change up to the server.
  useEffect(() => {
    if (!optedIn) return;
    sync(
      totals.gramsByKarat[18],
      totals.gramsByKarat[22],
      totals.gramsByKarat[24],
      totals.invested > 0 ? totals.invested : null
    );
  }, [
    optedIn,
    totals.gramsByKarat,
    totals.invested,
    sync,
  ]);

  async function handleToggle() {
    if (optedIn) {
      // Off: clear the row server-side so the user reverts to generic push,
      // then persist the preference.
      setSyncing(true);
      try {
        const endpoint = await getSubscriptionEndpoint();
        if (endpoint) {
          await fetch("/api/notifications/set-portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint, grams18k: 0, grams22k: 0, grams24k: 0, cost: null }),
          });
        }
        lastPayloadRef.current = "";
        localStorage.setItem(OPT_IN_KEY, "0");
        setOptedIn(false);
      } catch {
        setErrored(true);
      } finally {
        setSyncing(false);
      }
      return;
    }

    // On: subscribe to push if the user hasn't already, then persist the
    // preference. The effect above will do the actual upload.
    if (!isSubscribed) {
      await subscribe();
      // If the user rejected the permission prompt, `isSubscribed` stays false
      // and we bail — nothing was persisted, so their next tap tries again.
      const endpoint = await getSubscriptionEndpoint();
      if (!endpoint) return;
    }
    try {
      localStorage.setItem(OPT_IN_KEY, "1");
    } catch {
      // ignore
    }
    setOptedIn(true);
  }

  if (!isSupported) return null;

  return (
    <section className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            optedIn
              ? "bg-amber-500 text-white"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          {isLoading || syncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : optedIn ? (
            <Bell className="h-4 w-4" />
          ) : (
            <BellOff className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Daily portfolio update
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {optedIn
              ? "You'll get a push notification each morning with your gold's current value and daily change."
              : "Get a push notification each morning with your gold's value — instead of just the plain rate. Only totals leave your browser."}
          </p>
          {errored && (
            <p className="mt-1 text-[11px] text-red-500">
              Couldn&apos;t sync your portfolio to the server. Try again.
            </p>
          )}
        </div>
        <button
          onClick={handleToggle}
          disabled={isLoading || syncing}
          className={`shrink-0 self-center rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            optedIn
              ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              : "bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60"
          }`}
        >
          {optedIn ? "Turn off" : "Turn on"}
        </button>
      </div>
    </section>
  );
}
