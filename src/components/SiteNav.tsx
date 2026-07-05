"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";

interface NavItem {
  label: string;
  href: string;
  /** match prefix instead of exact for active state */
  prefix?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Today", href: "/" },
  { label: "Daily News", href: "/news", prefix: true },
  { label: "Calculators", href: "/tools", prefix: true },
  { label: "Jewellers", href: "/jewellers", prefix: true },
  { label: "Knowledge", href: "/blog", prefix: true },
  { label: "Culture", href: "/culture", prefix: true },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  if (item.prefix) return pathname.startsWith(item.href);
  return pathname === item.href;
}

export default function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Primary"
      className="relative border-b border-amber-200/40 bg-white/60 backdrop-blur-xl dark:border-amber-900/30 dark:bg-zinc-950/60"
    >
      {/* Decorative amber accent line under the bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent dark:via-amber-500/30" />

      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-2.5">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          aria-label="LiveGold Kerala — Home"
        >
          <Logo size={22} className="shrink-0" />
          <span>
            LiveGold{" "}
            <span className="gold-text-shine bg-gradient-to-r from-amber-600 via-yellow-300 to-amber-600 bg-clip-text text-transparent dark:from-amber-400 dark:via-yellow-200 dark:to-amber-400">
              Kerala
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex items-center px-2.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.label}
                  {/* Active underline — hairline amber */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-2 -bottom-[1px] h-[2px] origin-center rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-nav-mobile"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200/70 bg-white/80 text-zinc-700 shadow-sm transition-colors hover:border-amber-300 hover:text-amber-700 md:hidden dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-amber-700 dark:hover:text-amber-400"
        >
          {open ? (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div
          id="site-nav-mobile"
          className="border-t border-amber-200/40 bg-white/95 backdrop-blur-xl md:hidden dark:border-amber-900/30 dark:bg-zinc-950/95"
        >
          <ul className="mx-auto flex max-w-3xl flex-col px-4 py-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between border-b border-zinc-100 py-3 text-sm font-semibold uppercase tracking-[0.14em] last:border-b-0 transition-colors dark:border-zinc-900 ${
                      active
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                        active
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400 opacity-100"
                          : "bg-zinc-300 opacity-0 dark:bg-zinc-700"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
