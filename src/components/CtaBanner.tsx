"use client";

export default function CtaBanner() {
  return (
    <button
      type="button"
      onClick={() => {
        document.getElementById("estimator-section")?.scrollIntoView({ behavior: "smooth" });
      }}
      className="group relative block w-full overflow-hidden rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-4 text-left shadow-md shadow-amber-200/30 transition-all hover:shadow-lg hover:shadow-amber-300/40 hover:scale-[1.01] active:scale-[0.99] md:p-5"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-300/20 blur-2xl" />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-lg shadow-sm">
            <span className="animate-pulse">💰</span>
          </span>
          <p className="text-sm font-semibold text-zinc-800 md:text-base">
            Going to the jewelry shop today?{" "}
            <span className="text-amber-700">
              Calculate your exact bill with Making Charges &amp; GST
            </span>
          </p>
        </div>
        <svg className="h-5 w-5 shrink-0 text-amber-500 transition-transform group-hover:translate-y-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </button>
  );
}
