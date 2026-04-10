"use client";

import { useEffect, useState, useRef } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if user previously dismissed
    if (localStorage.getItem("pwa-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === "accepted") {
      setShow(false);
    }
    deferredPrompt.current = null;
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-3 md:p-4">
      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-amber-400/40 bg-zinc-900 shadow-2xl shadow-black/30">
        <div className="flex items-start gap-3 p-4 md:p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-xl font-black text-white shadow-md">
            G
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white md:text-base">
              Install LiveGold Kerala
            </p>
            <p className="mt-0.5 text-xs text-zinc-400 md:text-sm">
              Use this site like an app — no download required!
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 border-t border-zinc-800 px-4 py-3 md:px-5">
          <button
            onClick={handleDismiss}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/30 transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
          >
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}
