// Live FX for the multi-currency gold display aimed at NRIs / the Kerala
// diaspora (Gulf especially). Source: open.er-api.com — free, no API key,
// updates once daily. Daily freshness is all we need since the board rate
// itself moves once a day, so the response is cached for 6h via Next's fetch
// cache and degrades gracefully: on any failure getFxRates() returns null and
// the widget simply doesn't render (never breaks the page or shows a stale
// number on a finance site).

// Gulf currencies first — that's where the largest Malayali populations are —
// then the main Western diaspora destinations.
export const FX_CURRENCIES = [
  "AED", "SAR", "QAR", "KWD", "OMR", "BHD",
  "USD", "GBP", "EUR", "SGD", "AUD", "CAD",
] as const;

export type FxCurrency = (typeof FX_CURRENCIES)[number];

export interface FxRates {
  /** Units of each currency per 1 INR (only currencies actually returned). */
  rates: Partial<Record<FxCurrency, number>>;
  /** Provider's last-update timestamp (RFC-1123), for an "as of" label. */
  asOf: string;
}

export async function getFxRates(): Promise<FxRates | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      next: { revalidate: 21600 }, // 6 hours
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data?.result !== "success" || !data?.rates) return null;

    const rates: Partial<Record<FxCurrency, number>> = {};
    for (const c of FX_CURRENCIES) {
      const v = data.rates[c];
      if (typeof v === "number" && isFinite(v) && v > 0) rates[c] = v;
    }
    if (Object.keys(rates).length === 0) return null;

    return { rates, asOf: typeof data.time_last_update_utc === "string" ? data.time_last_update_utc : "" };
  } catch {
    return null;
  }
}
