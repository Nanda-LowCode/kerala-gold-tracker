"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Inline "Add to Home Screen" nudge, placed directly below the rate card
 * (not at the bottom of the page like InstallPrompt.tsx). The two coexist:
 * this is the ACTIVE surface that shows to every first-time visitor at the
 * moment they got value (seeing the rate); the bottom sheet is PASSIVE,
 * firing only when Chrome's engagement heuristics decide so.
 *
 * Handles two install paths:
 *  - Android / desktop Chrome / Edge → native `beforeinstallprompt` button
 *  - iOS Safari → manual "tap Share → Add to Home Screen" instructions
 *    (iOS Safari does NOT fire `beforeinstallprompt`, so iOS users would
 *    otherwise never see any install surface at all.)
 *
 * Dismissal is shared with InstallPrompt via `pwa-dismissed` localStorage
 * key — one "no thanks" silences both surfaces.
 */

type Mode = "hidden" | "android" | "ios";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pwa-dismissed";

export default function InstallBanner() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [showIosHelp, setShowIosHelp] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1) Hide if explicitly dismissed before.
    try {
      if (localStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      /* localStorage can throw in private mode — fall through */
    }

    // 2) Hide if already running as an installed PWA (standalone display mode).
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari legacy flag
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // 3) Android / desktop Chrome path: wait for the browser's native event.
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setMode("android");
    };
    window.addEventListener("beforeinstallprompt", handler);

    // 4) iOS Safari path: no event fires, so detect and surface manual help.
    //    Exclude Chrome/Firefox on iOS — they can't install at all; showing
    //    them the Safari instructions would be misleading.
    const ua = navigator.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua);
    const isIosChromeOrFirefox = /CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIosDevice && !isIosChromeOrFirefox) {
      setMode("ios");
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    try {
      await deferredPrompt.current.prompt();
      await deferredPrompt.current.userChoice;
    } catch {
      /* user may close the native dialog — ignore */
    }
    setMode("hidden");
    deferredPrompt.current = null;
  };

  const handleDismiss = () => {
    setMode("hidden");
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* best-effort */
    }
  };

  if (mode === "hidden") return null;

  return (
    <section
      aria-label="Install LiveGold Kerala as an app"
      className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm shadow-amber-100/40 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900 dark:shadow-none"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-base font-black text-white shadow-md"
        >
          G
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Add to home screen
          </p>
          <p className="mt-0.5 text-xs leading-snug text-zinc-600 dark:text-zinc-400">
            Get today&apos;s AKGSMA rate in one tap — no need to search every day.
          </p>

          {mode === "android" && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleInstall}
                className="cursor-pointer rounded-full bg-amber-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400"
              >
                Install
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="cursor-pointer rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Not now
              </button>
            </div>
          )}

          {mode === "ios" && (
            <div className="mt-3">
              {!showIosHelp ? (
                <button
                  type="button"
                  onClick={() => setShowIosHelp(true)}
                  className="cursor-pointer rounded-full bg-amber-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400"
                >
                  Show me how
                </button>
              ) : (
                <ol className="space-y-1 text-xs leading-snug text-zinc-700 dark:text-zinc-300">
                  <li>
                    1. Tap the <strong>Share</strong> icon{" "}
                    <span aria-hidden>⎙</span> at the bottom of Safari.
                  </li>
                  <li>
                    2. Scroll and tap <strong>Add to Home Screen</strong>.
                  </li>
                  <li>
                    3. Tap <strong>Add</strong>. The &ldquo;G&rdquo; icon
                    appears on your home screen.
                  </li>
                </ol>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 cursor-pointer rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
