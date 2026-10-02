"use client";

import { useMemo, useState } from "react";

// HUID is a 6-character alphanumeric code (A-Z, 0-9) stamped on every
// BIS-hallmarked jewellery piece sold in India since the 2021/2023 mandate.
// This is a FORMAT validator — we have no public BIS lookup API, so real
// per-piece verification happens only in the BIS Care app. The UI makes
// that limitation obvious instead of promising a check we can't deliver.
const HUID_LENGTH = 6;
const VALID_CHARS = /^[A-Z0-9]+$/;

type Verdict =
  | { kind: "empty" }
  | { kind: "too-short"; typed: number }
  | { kind: "bad-chars"; bad: string[] }
  | { kind: "valid" };

function evaluate(raw: string): Verdict {
  if (raw.length === 0) return { kind: "empty" };
  const bad = Array.from(new Set(raw.split("").filter((c) => !VALID_CHARS.test(c))));
  if (bad.length > 0) return { kind: "bad-chars", bad };
  if (raw.length < HUID_LENGTH) return { kind: "too-short", typed: raw.length };
  return { kind: "valid" };
}

export default function HuidChecker() {
  const [raw, setRaw] = useState("");

  // Strip spaces and lowercase as they type — HUIDs are always uppercase and
  // typed with gaps in the wild. Hyphens get stripped too (people copy them
  // from invoices). Cap at HUID_LENGTH so the input visibly refuses extras.
  const value = raw.replace(/[\s-]/g, "").toUpperCase().slice(0, HUID_LENGTH);
  const verdict = useMemo(() => evaluate(value), [value]);

  const bisCareAndroid =
    "https://play.google.com/store/apps/details?id=com.bis.bhc";
  const bisCareIos = "https://apps.apple.com/in/app/bis-care/id1545357082";

  return (
    <div className="flex flex-col gap-5">
      {/* Input */}
      <div className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-md dark:border-zinc-800 dark:bg-zinc-900 md:p-6">
        <label
          htmlFor="huid"
          className="block text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
        >
          Enter HUID
        </label>
        <input
          id="huid"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          maxLength={HUID_LENGTH + 4}
          placeholder="e.g. AZ4W29"
          value={value}
          onChange={(e) => setRaw(e.target.value)}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-xl font-mono font-bold tracking-[0.35em] text-zinc-900 placeholder:tracking-normal placeholder:font-sans placeholder:text-zinc-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-amber-600 dark:focus:bg-zinc-900 dark:focus:ring-amber-900/40"
          aria-describedby="huid-verdict"
        />

        <p
          id="huid-verdict"
          role="status"
          aria-live="polite"
          className="mt-3 text-sm leading-snug"
        >
          {verdict.kind === "empty" && (
            <span className="text-zinc-500 dark:text-zinc-400">
              The HUID is 6 characters, mixing uppercase letters and digits —
              stamped next to the BIS triangle on your jewellery.
            </span>
          )}
          {verdict.kind === "too-short" && (
            <span className="text-amber-700 dark:text-amber-400">
              {`Keep going — ${HUID_LENGTH - verdict.typed} more character${HUID_LENGTH - verdict.typed === 1 ? "" : "s"} to go. `}
              If your hallmark has fewer than 6 characters, see &ldquo;what if
              my number is only 4 digits?&rdquo; below.
            </span>
          )}
          {verdict.kind === "bad-chars" && (
            <span className="text-rose-700 dark:text-rose-400">
              {`${verdict.bad.join(", ")} isn't allowed in a HUID. Only A–Z and 0–9 — no hyphens, slashes or lowercase letters.`}
            </span>
          )}
          {verdict.kind === "valid" && (
            <span className="text-emerald-700 dark:text-emerald-400">
              Format looks right — this is a valid HUID pattern. The format
              check doesn&apos;t confirm it&apos;s a real BIS record; verify
              it in the BIS Care app below.
            </span>
          )}
        </p>
      </div>

      {/* Verify officially */}
      {verdict.kind === "valid" && (
        <div className="rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md shadow-amber-200/30 dark:border-amber-900/50 dark:from-amber-950/20 dark:to-zinc-900 dark:shadow-none md:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500">
            Next step
          </p>
          <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Verify{" "}
            <span className="font-mono tracking-[0.2em]">{value}</span>{" "}
            in BIS Care
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            The BIS Care app is the only official way to check if a HUID
            matches a real registered piece. Open the app, go to &ldquo;Verify
            HUID&rdquo;, and enter the number above.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={bisCareAndroid}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              BIS Care on Android →
            </a>
            <a
              href={bisCareIos}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-bold text-zinc-800 transition-colors hover:border-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              BIS Care on iPhone →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
