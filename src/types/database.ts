export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: "car" | "part" | "service";
          price: number;
          currency: string;
          country: "ca" | "in" | "pk" | "cn" | "bd";
          city: string;
          status: "draft" | "published" | "sold";
          images: string[];
          seller_id: string;
          seller_type: "dealer" | "private";
          specs: Json;
          created_at: string;
          updated_at: string;
          appraisal_score: number | null;
          appraisal_meta: Json | null;
          mileage_km: number | null;
          year: number | null;
          lat: number | null;
          lng: number | null;
          vin: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["listings"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "listings_seller_id_fkey";
            columns: ["seller_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          country: "ca" | "in" | "pk" | "cn" | "bd";
          role: "buyer" | "seller" | "dealer" | "admin";
          phone: string | null;
          email: string;
          dealer_badges: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          listing_id: string;
          reviewer_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey";
            columns: ["listing_id"];
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      watchlists: {
        Row: {
          id: string;
          profile_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["watchlists"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["watchlists"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "watchlists_listing_id_fkey";
            columns: ["listing_id"];
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watchlists_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      payments: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          provider: "stripe" | "razorpay" | "alipay" | "jazzcash";
          status: "initiated" | "authorized" | "captured" | "refunded";
          escrow_release_date: string | null;
          amount: number;
          currency: string;
          reference_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "payments_listing_id_fkey";
            columns: ["listing_id"];
            referencedRelation: "listings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_buyer_id_fkey";
            columns: ["buyer_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_seller_id_fkey";
            columns: ["seller_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {
      ai_price_estimate: {
        Args: { payload: Json };
        Returns: Json;
      };
      listing_search: {
        Args: {
          country_filter: string;
          query_text: string;
          page_size: number;
          page_offset: number;
        };
        Returns: Json[];
      };
    };
    Enums: {
      user_role: "buyer" | "seller" | "dealer" | "admin";
    };
    CompositeTypes: {};
  };
}



