export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type FestivalCategory = 'hindu' | 'christian' | 'muslim' | 'cultural' | 'national';
export type WeddingCommunity =
  | 'nair' | 'namboothiri' | 'ezhava'
  | 'syrian-christian' | 'latin-catholic' | 'marthoma'
  | 'mappila-muslim' | 'sunni-muslim';

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
          rate_silver_1g: number | null;
        };
        Insert: {
          date: string;
          city: string;
          rate_18k_1g: number;
          rate_22k_1g: number;
          rate_24k_1g: number;
          consensus_sources?: string | null;
          rate_silver_1g?: number | null;
        };
        Update: {
          date?: string;
          city?: string;
          rate_18k_1g?: number;
          rate_22k_1g?: number;
          rate_24k_1g?: number;
          consensus_sources?: string | null;
          rate_silver_1g?: number | null;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string | null;
          target_rate: number | null;
        };
        Insert: {
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string | null;
          target_rate?: number | null;
        };
        Update: {
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          created_at?: string | null;
          target_rate?: number | null;
        };
        Relationships: [];
      };
      festivals: {
        Row: {
          id: number;
          slug: string;
          name_en: string;
          name_ml: string;
          category: FestivalCategory | null;
          is_gold_buying_day: boolean;
          description_en: string | null;
          description_ml: string | null;
        };
        Insert: {
          id?: number;
          slug: string;
          name_en: string;
          name_ml: string;
          category?: FestivalCategory | null;
          is_gold_buying_day?: boolean;
          description_en?: string | null;
          description_ml?: string | null;
        };
        Update: {
          id?: number;
          slug?: string;
          name_en?: string;
          name_ml?: string;
          category?: FestivalCategory | null;
          is_gold_buying_day?: boolean;
          description_en?: string | null;
          description_ml?: string | null;
        };
        Relationships: [];
      };
      festival_dates: {
        Row: {
          id: number;
          festival_id: number;
          date: string;
          muhurat_start: string | null;
          muhurat_end: string | null;
          notes: string | null;
          source_url: string | null;
        };
        Insert: {
          id?: number;
          festival_id: number;
          date: string;
          muhurat_start?: string | null;
          muhurat_end?: string | null;
          notes?: string | null;
          source_url?: string | null;
        };
        Update: {
          id?: number;
          festival_id?: number;
          date?: string;
          muhurat_start?: string | null;
          muhurat_end?: string | null;
          notes?: string | null;
          source_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'festival_dates_festival_id_fkey';
            columns: ['festival_id'];
            referencedRelation: 'festivals';
            referencedColumns: ['id'];
          }
        ];
      };
      ornaments: {
        Row: {
          id: number;
          slug: string;
          name_en: string;
          name_ml: string | null;
          transliteration: string | null;
          community_tags: string[] | null;
          typical_weight_pavan_min: number | null;
          typical_weight_pavan_max: number | null;
          description_en: string | null;
          description_ml: string | null;
          symbolism_en: string | null;
          symbolism_ml: string | null;
          image_url: string | null;
          image_credit: string | null;
        };
        Insert: {
          id?: number;
          slug: string;
          name_en: string;
          name_ml?: string | null;
          transliteration?: string | null;
          community_tags?: string[] | null;
          typical_weight_pavan_min?: number | null;
          typical_weight_pavan_max?: number | null;
          description_en?: string | null;
          description_ml?: string | null;
          symbolism_en?: string | null;
          symbolism_ml?: string | null;
          image_url?: string | null;
          image_credit?: string | null;
        };
        Update: {
          id?: number;
          slug?: string;
          name_en?: string;
          name_ml?: string | null;
          transliteration?: string | null;
          community_tags?: string[] | null;
          typical_weight_pavan_min?: number | null;
          typical_weight_pavan_max?: number | null;
          description_en?: string | null;
          description_ml?: string | null;
          symbolism_en?: string | null;
          symbolism_ml?: string | null;
          image_url?: string | null;
          image_credit?: string | null;
        };
        Relationships: [];
      };
      temples: {
        Row: {
          id: number;
          slug: string;
          name_en: string | null;
          name_ml: string | null;
          district: string | null;
          lat: number | null;
          lng: number | null;
          deity: string | null;
          primary_festival_id: number | null;
          description_en: string | null;
          description_ml: string | null;
        };
        Insert: {
          id?: number;
          slug: string;
          name_en?: string | null;
          name_ml?: string | null;
          district?: string | null;
          lat?: number | null;
          lng?: number | null;
          deity?: string | null;
          primary_festival_id?: number | null;
          description_en?: string | null;
          description_ml?: string | null;
        };
        Update: {
          id?: number;
          slug?: string;
          name_en?: string | null;
          name_ml?: string | null;
          district?: string | null;
          lat?: number | null;
          lng?: number | null;
          deity?: string | null;
          primary_festival_id?: number | null;
          description_en?: string | null;
          description_ml?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'temples_primary_festival_id_fkey';
            columns: ['primary_festival_id'];
            referencedRelation: 'festivals';
            referencedColumns: ['id'];
          }
        ];
      };
      wedding_ornament_defaults: {
        Row: {
          community: WeddingCommunity;
          ornament_id: number;
          default_pavan: number | null;
          is_required: boolean;
          notes: string | null;
        };
        Insert: {
          community: WeddingCommunity;
          ornament_id: number;
          default_pavan?: number | null;
          is_required?: boolean;
          notes?: string | null;
        };
        Update: {
          community?: WeddingCommunity;
          ornament_id?: number;
          default_pavan?: number | null;
          is_required?: boolean;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'wedding_ornament_defaults_ornament_id_fkey';
            columns: ['ornament_id'];
            referencedRelation: 'ornaments';
            referencedColumns: ['id'];
          }
        ];
      };
      content_sources: {
        Row: {
          id: number;
          page_slug: string;
          claim: string | null;
          source_url: string | null;
          source_name: string | null;
          retrieved_on: string | null;
          reviewer_name: string | null;
        };
        Insert: {
          id?: number;
          page_slug: string;
          claim?: string | null;
          source_url?: string | null;
          source_name?: string | null;
          retrieved_on?: string | null;
          reviewer_name?: string | null;
        };
        Update: {
          id?: number;
          page_slug?: string;
          claim?: string | null;
          source_url?: string | null;
          source_name?: string | null;
          retrieved_on?: string | null;
          reviewer_name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      festival_rate_history: {
        Row: {
          slug: string | null;
          name_en: string | null;
          is_gold_buying_day: boolean | null;
          date: string | null;
          muhurat_start: string | null;
          muhurat_end: string | null;
          rate_22k_1g: number | null;
          rate_24k_1g: number | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
