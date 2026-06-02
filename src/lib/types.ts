export interface GoldRate {
  date: string;
  city?: string;
  rate_18k_1g: number;
  rate_22k_1g: number;
  rate_24k_1g: number;
  rate_silver_1g?: number | null;
}
