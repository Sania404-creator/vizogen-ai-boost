export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          brand_tone: string
          category: string
          city: string
          created_at: string
          google_account_id: string | null
          google_location_id: string | null
          google_location_name: string | null
          id: string
          keywords: string[]
          name: string
          owner_id: string
          phone: string | null
          posting_frequency: string
          review_link: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          brand_tone?: string
          category?: string
          city?: string
          created_at?: string
          google_account_id?: string | null
          google_location_id?: string | null
          google_location_name?: string | null
          id?: string
          keywords?: string[]
          name: string
          owner_id: string
          phone?: string | null
          posting_frequency?: string
          review_link?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          brand_tone?: string
          category?: string
          city?: string
          created_at?: string
          google_account_id?: string | null
          google_location_id?: string | null
          google_location_name?: string | null
          id?: string
          keywords?: string[]
          name?: string
          owner_id?: string
          phone?: string | null
          posting_frequency?: string
          review_link?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      demo_bookings: {
        Row: {
          admin_email_sent: boolean
          business_name: string
          created_at: string
          customer_email_sent: boolean
          email: string
          id: string
          name: string
          note: string | null
          phone: string
          slot_date: string
          slot_time: string
          source: string
          timezone: string
        }
        Insert: {
          admin_email_sent?: boolean
          business_name: string
          created_at?: string
          customer_email_sent?: boolean
          email: string
          id?: string
          name: string
          note?: string | null
          phone: string
          slot_date: string
          slot_time: string
          source?: string
          timezone?: string
        }
        Update: {
          admin_email_sent?: boolean
          business_name?: string
          created_at?: string
          customer_email_sent?: boolean
          email?: string
          id?: string
          name?: string
          note?: string | null
          phone?: string
          slot_date?: string
          slot_time?: string
          source?: string
          timezone?: string
        }
        Relationships: []
      }
      google_connections: {
        Row: {
          access_token: string | null
          access_token_expires_at: string | null
          created_at: string
          google_email: string | null
          id: string
          last_error: string | null
          owner_id: string
          refresh_token: string | null
          scopes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          access_token_expires_at?: string | null
          created_at?: string
          google_email?: string | null
          id?: string
          last_error?: string | null
          owner_id: string
          refresh_token?: string | null
          scopes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          access_token_expires_at?: string | null
          created_at?: string
          google_email?: string | null
          id?: string
          last_error?: string | null
          owner_id?: string
          refresh_token?: string | null
          scopes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          about: string | null
          admin_email_sent: boolean
          applicant_email_sent: boolean
          business_count: string
          business_name: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          program: string
          website: string | null
        }
        Insert: {
          about?: string | null
          admin_email_sent?: boolean
          applicant_email_sent?: boolean
          business_count: string
          business_name: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone: string
          program: string
          website?: string | null
        }
        Update: {
          about?: string | null
          admin_email_sent?: boolean
          applicant_email_sent?: boolean
          business_count?: string
          business_name?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          program?: string
          website?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          body: string
          business_id: string
          created_at: string
          cta_label: string | null
          cta_url: string | null
          error: string | null
          google_post_name: string | null
          headline: string
          id: string
          image_url: string | null
          owner_id: string
          post_type: string
          published_at: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          body?: string
          business_id: string
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          error?: string | null
          google_post_name?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          owner_id: string
          post_type?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          body?: string
          business_id?: string
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          error?: string | null
          google_post_name?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          owner_id?: string
          post_type?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          active: boolean
          business_id: string
          business_name: string
          created_at: string
          id: string
          owner_id: string
          review_link: string | null
          scans: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          business_id: string
          business_name?: string
          created_at?: string
          id?: string
          owner_id: string
          review_link?: string | null
          scans?: number
          slug: string
          title?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          business_id?: string
          business_name?: string
          created_at?: string
          id?: string
          owner_id?: string
          review_link?: string | null
          scans?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_feedback: {
        Row: {
          business_id: string
          comment: string | null
          created_at: string
          customer_contact: string | null
          customer_name: string | null
          id: string
          owner_id: string
          qr_id: string
          rating: number
          routed_to_google: boolean
        }
        Insert: {
          business_id: string
          comment?: string | null
          created_at?: string
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          owner_id: string
          qr_id: string
          rating: number
          routed_to_google?: boolean
        }
        Update: {
          business_id?: string
          comment?: string | null
          created_at?: string
          customer_contact?: string | null
          customer_name?: string | null
          id?: string
          owner_id?: string
          qr_id?: string
          rating?: number
          routed_to_google?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "qr_feedback_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_feedback_qr_id_fkey"
            columns: ["qr_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          comment: string | null
          created_at: string
          error: string | null
          google_review_id: string | null
          id: string
          owner_id: string
          rating: number
          replied_at: string | null
          reply_status: string
          reply_text: string | null
          reviewed_at: string
          reviewer_name: string
          reviewer_photo: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          comment?: string | null
          created_at?: string
          error?: string | null
          google_review_id?: string | null
          id?: string
          owner_id: string
          rating?: number
          replied_at?: string | null
          reply_status?: string
          reply_text?: string | null
          reviewed_at?: string
          reviewer_name?: string
          reviewer_photo?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          comment?: string | null
          created_at?: string
          error?: string | null
          google_review_id?: string | null
          id?: string
          owner_id?: string
          rating?: number
          replied_at?: string | null
          reply_status?: string
          reply_text?: string | null
          reviewed_at?: string
          reviewer_name?: string
          reviewer_photo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      register_qr_scan: { Args: { _slug: string }; Returns: undefined }
      submit_qr_feedback: {
        Args: {
          _comment?: string
          _customer_contact?: string
          _customer_name?: string
          _rating: number
          _slug: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
