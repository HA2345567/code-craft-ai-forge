export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_models: {
        Row: {
          capabilities: Json | null
          configuration_options: Json | null
          created_at: string | null
          id: string
          name: string
          pricing_tier: string | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          capabilities?: Json | null
          configuration_options?: Json | null
          created_at?: string | null
          id?: string
          name: string
          pricing_tier?: string | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          capabilities?: Json | null
          configuration_options?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          pricing_tier?: string | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      api_analytics: {
        Row: {
          avg_response_time: number | null
          date: string | null
          detailed_metrics: Json | null
          endpoint_id: string | null
          error_rate: number | null
          id: string
          project_id: string
          request_count: number | null
        }
        Insert: {
          avg_response_time?: number | null
          date?: string | null
          detailed_metrics?: Json | null
          endpoint_id?: string | null
          error_rate?: number | null
          id?: string
          project_id: string
          request_count?: number | null
        }
        Update: {
          avg_response_time?: number | null
          date?: string | null
          detailed_metrics?: Json | null
          endpoint_id?: string | null
          error_rate?: number | null
          id?: string
          project_id?: string
          request_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_analytics_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "api_endpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      api_endpoints: {
        Row: {
          created_at: string | null
          id: string
          implementation: string | null
          is_public: boolean | null
          method: string
          name: string
          path: string
          project_id: string
          rate_limit: number | null
          request_schema: Json | null
          response_schema: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          implementation?: string | null
          is_public?: boolean | null
          method: string
          name: string
          path: string
          project_id: string
          rate_limit?: number | null
          request_schema?: Json | null
          response_schema?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          implementation?: string | null
          is_public?: boolean | null
          method?: string
          name?: string
          path?: string
          project_id?: string
          rate_limit?: number | null
          request_schema?: Json | null
          response_schema?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_endpoints_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborators: {
        Row: {
          id: string
          joined_at: string | null
          permissions: Json | null
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          permissions?: Json | null
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          permissions?: Json | null
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      components: {
        Row: {
          category: string | null
          content: Json
          created_at: string | null
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          content: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
        }
        Relationships: []
      }
      data_models: {
        Row: {
          created_at: string | null
          fields: Json
          id: string
          is_timestamped: boolean | null
          name: string
          project_id: string
          relationships: Json | null
          updated_at: string | null
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string | null
          fields: Json
          id?: string
          is_timestamped?: boolean | null
          name: string
          project_id: string
          relationships?: Json | null
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string | null
          fields?: Json
          id?: string
          is_timestamped?: boolean | null
          name?: string
          project_id?: string
          relationships?: Json | null
          updated_at?: string | null
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "data_models_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      environments: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          name: string
          project_id: string
          provider: string | null
          status: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          name: string
          project_id: string
          provider?: string | null
          status?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          name?: string
          project_id?: string
          provider?: string | null
          status?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "environments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          ai_model_configs: Json | null
          analytics_enabled: boolean | null
          created_at: string | null
          deployment_history: Json[] | null
          description: string | null
          id: string
          name: string
          performance_metrics: Json | null
          publish_url: string | null
          published: boolean | null
          settings: Json | null
          tech_stack: Json | null
          template_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_model_configs?: Json | null
          analytics_enabled?: boolean | null
          created_at?: string | null
          deployment_history?: Json[] | null
          description?: string | null
          id?: string
          name: string
          performance_metrics?: Json | null
          publish_url?: string | null
          published?: boolean | null
          settings?: Json | null
          tech_stack?: Json | null
          template_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_model_configs?: Json | null
          analytics_enabled?: boolean | null
          created_at?: string | null
          deployment_history?: Json[] | null
          description?: string | null
          id?: string
          name?: string
          performance_metrics?: Json | null
          publish_url?: string | null
          published?: boolean | null
          settings?: Json | null
          tech_stack?: Json | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string | null
          content: Json
          created_at: string | null
          description: string | null
          id: string
          is_premium: boolean | null
          name: string
          thumbnail_url: string | null
        }
        Insert: {
          category?: string | null
          content: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name: string
          thumbnail_url?: string | null
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          name?: string
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      users_profile: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          full_name: string | null
          id: string
          subscription_tier: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          subscription_tier?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          subscription_tier?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
