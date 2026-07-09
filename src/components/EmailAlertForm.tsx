"use client";

import { useState } from "react";

export default function EmailAlertForm({ currentRate }: { currentRate: number }) {
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Number(target);
    if (!email || !rate) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/notifications/email-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, targetRate: rate }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
        setMsg(j.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  };

  // Rendered inside the shared "Price-drop alerts" card in DashboardLayout —
  // no card chrome of its own.
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-base" aria-hidden>📧</span>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">By email</h3>
      </div>

      {status === "saved" ? (
        <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
          ✓ Alert set! We&apos;ll email you when 22K gold drops to ₹{Number(target).toLocaleString("en-IN")}/g.
        </p>
      ) : (
        <>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            We&apos;ll email you once when the 22K Kerala board rate drops to your target. No spam, unsubscribe anytime.
          </p>
          <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-amber-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <input
              type="number"
              required
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={`₹ ${Math.floor(currentRate * 0.97).toLocaleString("en-IN")}`}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-amber-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 sm:w-32"
            />
            <button
              type="submit"
              disabled={status === "saving" || !email || !target}
              className="shrink-0 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-50"
            >
              {status === "saving" ? "Saving…" : "Notify me"}
            </button>
          </form>
          {status === "error" && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{msg}</p>}
        </>
      )}
    </div>
  );
}
