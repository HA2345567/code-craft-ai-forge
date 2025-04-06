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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
