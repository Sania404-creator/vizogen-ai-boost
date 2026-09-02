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
      crm_activities: {
        Row: {
          actor_id: string | null
          actor_name: string
          body: string
          created_at: string
          id: string
          lead_id: string
          meta: Json
          type: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string
          body?: string
          created_at?: string
          id?: string
          lead_id: string
          meta?: Json
          type?: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string
          body?: string
          created_at?: string
          id?: string
          lead_id?: string
          meta?: Json
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          assigned_to: string | null
          booking_id: string | null
          company: string
          created_at: string
          created_by: string | null
          email: string
          follow_up_on: string | null
          id: string
          job_title: string | null
          last_contacted_at: string | null
          lost_reason: string | null
          message: string | null
          name: string
          phone: string
          requested_demo_at: string | null
          requested_demo_label: string | null
          source: string
          source_page: string | null
          status: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          booking_id?: string | null
          company?: string
          created_at?: string
          created_by?: string | null
          email?: string
          follow_up_on?: string | null
          id?: string
          job_title?: string | null
          last_contacted_at?: string | null
          lost_reason?: string | null
          message?: string | null
          name: string
          phone?: string
          requested_demo_at?: string | null
          requested_demo_label?: string | null
          source?: string
          source_page?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          booking_id?: string | null
          company?: string
          created_at?: string
          created_by?: string | null
          email?: string
          follow_up_on?: string | null
          id?: string
          job_title?: string | null
          last_contacted_at?: string | null
          lost_reason?: string | null
          message?: string | null
          name?: string
          phone?: string
          requested_demo_at?: string | null
          requested_demo_label?: string | null
          source?: string
          source_page?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "demo_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_leads_status_fkey"
            columns: ["status"]
            isOneToOne: false
            referencedRelation: "crm_stages"
            referencedColumns: ["key"]
          },
        ]
      }
      crm_members: {
        Row: {
          active: boolean
          can_view_all: boolean
          created_at: string
          email: string
          full_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          can_view_all?: boolean
          created_at?: string
          email?: string
          full_name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          can_view_all?: boolean
          created_at?: string
          email?: string
          full_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crm_notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          lead_id: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          lead_id?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_notifications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_proposal_templates: {
        Row: {
          created_at: string
          created_by: string | null
          deliverables: string[]
          id: string
          name: string
          notes: string
          pricing: Json
          scope: string
          terms: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deliverables?: string[]
          id?: string
          name: string
          notes?: string
          pricing?: Json
          scope?: string
          terms?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deliverables?: string[]
          id?: string
          name?: string
          notes?: string
          pricing?: Json
          scope?: string
          terms?: string
          updated_at?: string
        }
        Relationships: []
      }
      crm_proposals: {
        Row: {
          client_company: string
          client_email: string
          client_name: string
          created_at: string
          created_by: string | null
          currency: string
          decided_at: string | null
          deliverables: string[]
          id: string
          lead_id: string
          notes: string
          pricing: Json
          scope: string
          sent_at: string | null
          share_token: string
          status: string
          template_id: string | null
          terms: string
          title: string
          updated_at: string
          valid_until: string | null
          version: number
          viewed_at: string | null
        }
        Insert: {
          client_company?: string
          client_email?: string
          client_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          decided_at?: string | null
          deliverables?: string[]
          id?: string
          lead_id: string
          notes?: string
          pricing?: Json
          scope?: string
          sent_at?: string | null
          share_token?: string
          status?: string
          template_id?: string | null
          terms?: string
          title?: string
          updated_at?: string
          valid_until?: string | null
          version?: number
          viewed_at?: string | null
        }
        Update: {
          client_company?: string
          client_email?: string
          client_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          decided_at?: string | null
          deliverables?: string[]
          id?: string
          lead_id?: string
          notes?: string
          pricing?: Json
          scope?: string
          sent_at?: string | null
          share_token?: string
          status?: string
          template_id?: string | null
          terms?: string
          title?: string
          updated_at?: string
          valid_until?: string | null
          version?: number
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_proposals_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "crm_proposal_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_stages: {
        Row: {
          created_at: string
          key: string
          kind: string
          label: string
          position: number
        }
        Insert: {
          created_at?: string
          key: string
          kind?: string
          label: string
          position?: number
        }
        Update: {
          created_at?: string
          key?: string
          kind?: string
          label?: string
          position?: number
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      crm_can_view_all: { Args: { _user_id: string }; Returns: boolean }
      crm_is_member: { Args: { _user_id: string }; Returns: boolean }
      crm_view_proposal: {
        Args: { _token: string }
        Returns: {
          client_company: string
          client_name: string
          currency: string
          deliverables: string[]
          notes: string
          pricing: Json
          scope: string
          sent_at: string
          status: string
          terms: string
          title: string
          valid_until: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
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
      app_role: "admin" | "sales_rep"
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
    Enums: {
      app_role: ["admin", "sales_rep"],
    },
  },
} as const
