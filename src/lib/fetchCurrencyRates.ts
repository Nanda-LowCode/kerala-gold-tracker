export type ExchangeRatesList = {
  INR: number;
  AED: number;
  USD: number;
  EUR: number;
  GBP: number;
};

// Fallback static rates based on historical averages
// used safely if the API encounters rate limiting
const FALLBACK_RATES: ExchangeRatesList = {
  INR: 1,
  AED: 0.0438,
  USD: 0.0119,
  EUR: 0.0111,
  GBP: 0.0094,
};

export async function fetchCurrencyRates(): Promise<ExchangeRatesList> {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=INR&to=USD,EUR,GBP", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from Frankfurter API");
    }

    const data = await res.json();
    
    // Note: Frankfurter does not support AED out of the box in some instances 
    // because it relies on ECB data. If it doesn't return AED, we fall back to static.
    // It will return an object like { amount: 1, base: "INR", date: "...", rates: { USD: 0.012, GBP: 0.009 } }
    
    return {
      INR: 1,
      AED: data.rates.AED || FALLBACK_RATES.AED,
      USD: data.rates.USD || FALLBACK_RATES.USD,
      EUR: data.rates.EUR || FALLBACK_RATES.EUR,
      GBP: data.rates.GBP || FALLBACK_RATES.GBP,
    };
  } catch (error) {
    console.error("Exchange rate fetch failed, using fallbacks:", error);
    return FALLBACK_RATES;
  }
}
