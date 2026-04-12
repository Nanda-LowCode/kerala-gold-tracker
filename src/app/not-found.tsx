import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-gradient-to-br from-amber-100 to-amber-200 p-5 shadow-inner">
        <svg
          className="h-10 w-10 text-amber-700"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-zinc-900">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100"
      >
        ← Back to Today&apos;s Gold Rates
      </Link>
    </main>
  );
}
