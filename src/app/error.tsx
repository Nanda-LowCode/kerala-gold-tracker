"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-gradient-to-br from-red-100 to-red-200 p-5 shadow-inner">
        <svg
          className="h-10 w-10 text-red-700"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-zinc-900">
        Something Went Wrong
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        We could not load this page. This is usually temporary.
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100"
      >
        Try Again
      </button>
    </main>
  );
}
