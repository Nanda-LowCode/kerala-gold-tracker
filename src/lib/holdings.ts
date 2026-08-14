/**
 * Portfolio holdings — storage shape and P&L maths for /my-gold.
 *
 * v1 keeps holdings in localStorage only (no account needed, which matters
 * because most visitors arrive cold from Google on mobile). The key is
 * versioned and every holding carries a stable `id`, so an optional
 * "sync across devices" account can be layered on later by bulk-uploading
 * this exact shape — no migration of user data required.
 */

export type Karat = 18 | 22 | 24;

export const KARATS: Karat[] = [22, 24, 18];

/** Fineness of each karat, used for the pure-gold equivalent. */
const PURITY: Record<Karat, number> = { 18: 0.75, 22: 0.916, 24: 0.999 };

export interface Holding {
  id: string;
  grams: number;
  karat: Karat;
  /** YYYY-MM-DD */
  purchaseDate: string;
  /** User override. Undefined means "auto-price from the board rate that day". */
  pricePerGram?: number;
  label?: string;
}

/** A board rate row, as returned by /api/rates/lookup. */
export interface ResolvedRate {
  date: string;
  rate_18k_1g: number;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

export const STORAGE_KEY = "livegold_holdings_v1";

export function rateForKarat(rate: ResolvedRate, karat: Karat): number {
  if (karat === 18) return rate.rate_18k_1g;
  if (karat === 24) return rate.rate_24k_1g;
  return rate.rate_22k_1g;
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/**
 * Shifts a YYYY-MM-DD date by whole years, staying in UTC throughout.
 *
 * Parsing and serialising must agree on a zone: `new Date("2024-08-14T00:00:00")`
 * is *local* midnight, so `.toISOString()` rolls it back to 2024-08-13 for anyone
 * east of UTC — which is every user in India. Always pin the "Z".
 */
export function shiftYearsUTC(date: string, delta: number): string {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCFullYear(d.getUTCFullYear() + delta);
  return d.toISOString().slice(0, 10);
}

function isKarat(v: unknown): v is Karat {
  return v === 18 || v === 22 || v === 24;
}

/**
 * Reads and validates holdings. Anything malformed is dropped rather than
 * thrown — a corrupted key should degrade to an empty portfolio, never a
 * crashed page.
 */
function parseHoldings(raw: string | null): Holding[] {
  try {
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    return parsed.flatMap((h): Holding[] => {
      if (typeof h !== "object" || h === null) return [];
      const r = h as Record<string, unknown>;
      if (typeof r.grams !== "number" || !Number.isFinite(r.grams) || r.grams <= 0) return [];
      if (!isKarat(r.karat)) return [];
      if (typeof r.purchaseDate !== "string") return [];
      return [
        {
          id: typeof r.id === "string" ? r.id : newId(),
          grams: r.grams,
          karat: r.karat,
          purchaseDate: r.purchaseDate,
          pricePerGram:
            typeof r.pricePerGram === "number" && Number.isFinite(r.pricePerGram) && r.pricePerGram > 0
              ? r.pricePerGram
              : undefined,
          label: typeof r.label === "string" && r.label.trim() ? r.label : undefined,
        },
      ];
    });
  } catch {
    return EMPTY;
  }
}

/* --------------------------------------------------------------------------
 * External store
 *
 * Holdings live in localStorage, which makes them an external system rather
 * than React state — so the page subscribes via useSyncExternalStore instead
 * of hydrating through an effect. Two things fall out of this for free: the
 * snapshot is correct on the very first client render, and a portfolio open
 * in two tabs stays in step (the `storage` event fires in the *other* tab;
 * the custom event covers the one that wrote).
 * ----------------------------------------------------------------------- */

const EMPTY: Holding[] = [];
const CHANGE_EVENT = "livegold:holdings";

// getSnapshot must return a referentially stable value between changes, or
// useSyncExternalStore re-renders forever. Re-parse only when the raw string moves.
let cachedRaw: string | null = null;
let cachedValue: Holding[] = EMPTY;

/** Set when localStorage rejects writes (Safari private mode, quota). */
let memoryOnly = false;

export function subscribeHoldings(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function getHoldingsSnapshot(): Holding[] {
  if (memoryOnly) return cachedValue;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedValue = parseHoldings(raw);
    }
    return cachedValue;
  } catch {
    return EMPTY;
  }
}

/** The server has no holdings, so SSR and hydration both render the empty state. */
export function getHoldingsServerSnapshot(): Holding[] {
  return EMPTY;
}

export function saveHoldings(holdings: Holding[]): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(holdings);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Can't persist — keep it in memory so the session still works rather than
    // silently swallowing the user's input.
    memoryOnly = true;
    cachedRaw = raw;
    cachedValue = holdings;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export interface HoldingRow {
  holding: Holding;
  /** Cost basis per gram — the user's override, or the board rate that day. */
  costPerGram: number | null;
  /** The board-rate date actually used (may precede purchaseDate). */
  pricedFrom: string | null;
  /** True when costPerGram came from the user rather than the board rate. */
  isManualPrice: boolean;
  invested: number | null;
  currentValue: number;
  gain: number | null;
  gainPct: number | null;
}

export interface PortfolioTotals {
  invested: number;
  currentValue: number;
  gain: number;
  gainPct: number;
  totalGrams: number;
  pureGrams: number;
  gramsByKarat: Record<Karat, number>;
  /** Holdings whose purchase date could not be priced (and are excluded from invested). */
  unpricedCount: number;
}

/**
 * Joins holdings to their historical cost basis and today's rate.
 *
 * `rates` maps a requested purchase date to the resolved board rate, or null
 * when the lookup found nothing. A holding with no cost basis still counts
 * toward current value and weight — we just cannot state its gain, so it is
 * excluded from `invested` and flagged via `unpricedCount`.
 */
export function computePortfolio(
  holdings: Holding[],
  rates: Record<string, ResolvedRate | null>,
  today: ResolvedRate
): { rows: HoldingRow[]; totals: PortfolioTotals } {
  const rows: HoldingRow[] = holdings.map((holding) => {
    const resolved = rates[holding.purchaseDate] ?? null;
    const isManualPrice = holding.pricePerGram !== undefined;
    const costPerGram = isManualPrice
      ? holding.pricePerGram!
      : resolved
        ? rateForKarat(resolved, holding.karat)
        : null;

    const invested = costPerGram === null ? null : costPerGram * holding.grams;
    const currentValue = rateForKarat(today, holding.karat) * holding.grams;
    const gain = invested === null ? null : currentValue - invested;
    const gainPct = invested === null || invested === 0 ? null : (gain! / invested) * 100;

    return {
      holding,
      costPerGram,
      pricedFrom: isManualPrice ? null : (resolved?.date ?? null),
      isManualPrice,
      invested,
      currentValue,
      gain,
      gainPct,
    };
  });

  const gramsByKarat: Record<Karat, number> = { 18: 0, 22: 0, 24: 0 };
  let invested = 0;
  let currentValue = 0;
  let totalGrams = 0;
  let pureGrams = 0;
  let unpricedCount = 0;

  for (const row of rows) {
    gramsByKarat[row.holding.karat] += row.holding.grams;
    totalGrams += row.holding.grams;
    pureGrams += row.holding.grams * PURITY[row.holding.karat];
    currentValue += row.currentValue;
    if (row.invested === null) unpricedCount++;
    else invested += row.invested;
  }

  // Gain compares like with like: only priced holdings contribute to both sides.
  const pricedCurrentValue = rows
    .filter((r) => r.invested !== null)
    .reduce((sum, r) => sum + r.currentValue, 0);
  const gain = pricedCurrentValue - invested;

  return {
    rows,
    totals: {
      invested,
      currentValue,
      gain,
      gainPct: invested > 0 ? (gain / invested) * 100 : 0,
      totalGrams,
      pureGrams,
      gramsByKarat,
      unpricedCount,
    },
  };
}
