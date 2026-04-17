export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      daily_gold_rates: {
        Row: {
          date: string;
          city: string;
          rate_18k_1g: number;
          rate_22k_1g: number;
          rate_24k_1g: number;
          consensus_sources: string | null;
        };
        Insert: {
          date: string;
          city: string;
          rate_18k_1g: number;
          rate_22k_1g: number;
          rate_24k_1g: number;
          consensus_sources?: string | null;
        };
        Update: {
          date?: string;
          city?: string;
          rate_18k_1g?: number;
          rate_22k_1g?: number;
          rate_24k_1g?: number;
          consensus_sources?: string | null;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string | null;
        };
        Insert: {
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string | null;
        };
        Update: {
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
