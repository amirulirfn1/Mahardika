export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin" | "staff" | "customer";
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "admin" | "staff" | "customer";
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "admin" | "staff" | "customer";
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          owner_id: string | null;
          plate: string;
          make: string | null;
          model: string | null;
          year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          plate: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          plate?: string;
          make?: string | null;
          model?: string | null;
          year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      policies: {
        Row: {
          id: string;
          vehicle_id: string | null;
          type: "first_party" | "third_party";
          insurer: string;
          policy_number: string | null;
          pdf_url: string | null;
          start_date: string;
          end_date: string;
          premium_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id?: string | null;
          type: "first_party" | "third_party";
          insurer: string;
          policy_number?: string | null;
          pdf_url?: string | null;
          start_date: string;
          end_date: string;
          premium_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string | null;
          type?: "first_party" | "third_party";
          insurer?: string;
          policy_number?: string | null;
          pdf_url?: string | null;
          start_date?: string;
          end_date?: string;
          premium_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          policy_id: string | null;
          amount: number;
          paid_at: string;
          proof_url: string | null;
          payment_method: string | null;
          reference_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          policy_id?: string | null;
          amount: number;
          paid_at: string;
          proof_url?: string | null;
          payment_method?: string | null;
          reference_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          policy_id?: string | null;
          amount?: number;
          paid_at?: string;
          proof_url?: string | null;
          payment_method?: string | null;
          reference_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      loyalty_tiers: {
        Row: {
          id: number;
          name: string;
          threshold: number;
          multiplier: number;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          threshold: number;
          multiplier: number;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          threshold?: number;
          multiplier?: number;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      points_ledger: {
        Row: {
          id: string;
          profile_id: string | null;
          policy_id: string | null;
          points: number;
          transaction_type: "earned" | "redeemed" | "expired";
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          policy_id?: string | null;
          points: number;
          transaction_type?: "earned" | "redeemed" | "expired";
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          policy_id?: string | null;
          points?: number;
          transaction_type?: "earned" | "redeemed" | "expired";
          description?: string | null;
          created_at?: string;
        };
      };
      policy_renewals: {
        Row: {
          id: string;
          policy_id: string | null;
          reminder_days: number;
          sent_at: string | null;
          email_sent: boolean | null;
          whatsapp_link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          policy_id?: string | null;
          reminder_days: number;
          sent_at?: string | null;
          email_sent?: boolean | null;
          whatsapp_link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          policy_id?: string | null;
          reminder_days?: number;
          sent_at?: string | null;
          email_sent?: boolean | null;
          whatsapp_link?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
