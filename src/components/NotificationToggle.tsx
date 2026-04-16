"use client";

import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Bell, BellOff, Loader2 } from "lucide-react";

export default function NotificationToggle() {
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } =
    usePushNotifications();

  // If not supported inside the browser, don't show the button to avoid confusion
  if (!isSupported) {
    return null;
  }

  const handleToggle = () => {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
        isSubscribed
          ? "border-amber-500 bg-amber-500 text-white shadow-sm hover:bg-amber-600 dark:border-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
          : "border-zinc-200 bg-white text-zinc-500 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
      }`}
      aria-label={
        isSubscribed ? "Disable price alerts" : "Enable price alerts"
      }
      title={isSubscribed ? "Disable price alerts" : "Enable price alerts"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSubscribed ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4 transition-transform group-hover:scale-110" />
      )}

      {/* Ping ring for non-subscribed users to encourage opt-in */}
      {!isSubscribed && !isLoading && (
        <span className="absolute right-0 top-0 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 dark:bg-amber-500"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500 dark:bg-amber-600"></span>
        </span>
      )}
    </button>
  );
}
