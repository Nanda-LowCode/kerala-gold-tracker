"use client";

import { useEffect, useRef, useState } from "react";

const TYPES = [
  { id: "suggestion", label: "💡 Idea" },
  { id: "bug", label: "🐞 Issue" },
  { id: "other", label: "💬 Other" },
] as const;

type Status = "idle" | "sending" | "done" | "error";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>("suggestion");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 4) {
      setErrorMsg("Please write a little more.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          type,
          email: email.trim(),
          website,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
      setMessage("");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  function reset() {
    setOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setErrorMsg("");
    }, 200);
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Send feedback or a suggestion"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-white/90 px-3.5 py-2 text-xs font-semibold text-amber-800 shadow-lg shadow-amber-200/40 backdrop-blur transition-colors hover:bg-amber-50 dark:border-amber-800/60 dark:bg-zinc-900/90 dark:text-amber-300 dark:shadow-none dark:hover:bg-zinc-800"
      >
        <span aria-hidden>💬</span> Feedback
      </button>

      {open && (
        <>
          {/* Backdrop (mobile) */}
          <div className="fixed inset-0 z-40 bg-black/20 sm:hidden" onClick={() => setOpen(false)} aria-hidden />
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Feedback"
            className="fixed bottom-16 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
          >
            {status === "done" ? (
              <div className="py-4 text-center">
                <p className="text-2xl" aria-hidden>🙏</p>
                <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">Thank you!</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Your feedback helps shape what we build next.
                </p>
                <button
                  onClick={reset}
                  className="mt-3 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">What would make this better?</h2>
                  <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">✕</button>
                </div>

                <div className="mb-2 flex gap-1.5">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                        type === t.id
                          ? "bg-amber-500 text-white"
                          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  autoFocus
                  placeholder="A feature you'd love, something confusing, a bug…"
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-100"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional — if you'd like a reply)"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-amber-400 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-100"
                />

                {/* Honeypot — visually hidden, off-screen */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  aria-hidden
                />

                {status === "error" && <p className="mt-2 text-[11px] font-medium text-red-600 dark:text-red-400">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-3 w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send feedback"}
                </button>
                <p className="mt-2 text-center text-[10px] text-zinc-400">We read every message. No account needed.</p>
              </form>
            )}
          </div>
        </>
      )}
    </>
  );
}
