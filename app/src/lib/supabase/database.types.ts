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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      background_core_powers: {
        Row: {
          background_id: string
          power_id: string
        }
        Insert: {
          background_id: string
          power_id: string
        }
        Update: {
          background_id?: string
          power_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "background_core_powers_background_id_fkey"
            columns: ["background_id"]
            isOneToOne: false
            referencedRelation: "backgrounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "background_core_powers_power_id_fkey"
            columns: ["power_id"]
            isOneToOne: false
            referencedRelation: "powers"
            referencedColumns: ["id"]
          },
        ]
      }
      backgrounds: {
        Row: {
          choice_stat_count: number
          choice_stat_options: string[]
          created_at: string
          fixed_stat_mods: Json
          flavor_text: string
          id: string
          key: string
          name: string
        }
        Insert: {
          choice_stat_count: number
          choice_stat_options: string[]
          created_at?: string
          fixed_stat_mods?: Json
          flavor_text: string
          id?: string
          key: string
          name: string
        }
        Update: {
          choice_stat_count?: number
          choice_stat_options?: string[]
          created_at?: string
          fixed_stat_mods?: Json
          flavor_text?: string
          id?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      campaign_members: {
        Row: {
          campaign_id: string
          joined_at: string
          player_id: string
        }
        Insert: {
          campaign_id: string
          joined_at?: string
          player_id: string
        }
        Update: {
          campaign_id?: string
          joined_at?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_members_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_members_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_gear: {
        Row: {
          captain_id: string
          created_at: string
          equipment_item_id: string
          id: string
          notes: string | null
        }
        Insert: {
          captain_id: string
          created_at?: string
          equipment_item_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          captain_id?: string
          created_at?: string
          equipment_item_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "captain_gear_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "captain_gear_equipment_item_id_fkey"
            columns: ["equipment_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
        ]
      }
      captain_powers: {
        Row: {
          activation_number: number
          captain_id: string
          id: string
          is_core: boolean
          power_id: string
          reduced: boolean
        }
        Insert: {
          activation_number: number
          captain_id: string
          id?: string
          is_core: boolean
          power_id: string
          reduced?: boolean
        }
        Update: {
          activation_number?: number
          captain_id?: string
          id?: string
          is_core?: boolean
          power_id?: string
          reduced?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "captain_powers_captain_id_fkey"
            columns: ["captain_id"]
            isOneToOne: false
            referencedRelation: "captains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "captain_powers_power_id_fkey"
            columns: ["power_id"]
            isOneToOne: false
            referencedRelation: "powers"
            referencedColumns: ["id"]
          },
        ]
      }
      captains: {
        Row: {
          armour: number
          background_id: string
          chosen_stat_options: string[]
          created_at: string
          crew_id: string
          current_health: number
          fight: number
          health: number
          id: string
          level: number
          move: number
          name: string
          permanent_injuries: Json
          shoot: number
          updated_at: string
          will: number
        }
        Insert: {
          armour: number
          background_id: string
          chosen_stat_options?: string[]
          created_at?: string
          crew_id: string
          current_health: number
          fight: number
          health: number
          id?: string
          level?: number
          move: number
          name?: string
          permanent_injuries?: Json
          shoot: number
          updated_at?: string
          will: number
        }
        Update: {
          armour?: number
          background_id?: string
          chosen_stat_options?: string[]
          created_at?: string
          crew_id?: string
          current_health?: number
          fight?: number
          health?: number
          id?: string
          level?: number
          move?: number
          name?: string
          permanent_injuries?: Json
          shoot?: number
          updated_at?: string
          will?: number
        }
        Relationships: [
          {
            foreignKeyName: "captains_background_id_fkey"
            columns: ["background_id"]
            isOneToOne: false
            referencedRelation: "backgrounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "captains_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: true
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
        ]
      }
      corps: {
        Row: {
          color_theme: Json
          created_at: string
          emblem_url: string | null
          id: string
          key: string
          lore_markdown: string
          name: string
          sector: string
          sort_order: number
        }
        Insert: {
          color_theme?: Json
          created_at?: string
          emblem_url?: string | null
          id?: string
          key: string
          lore_markdown: string
          name: string
          sector: string
          sort_order?: number
        }
        Update: {
          color_theme?: Json
          created_at?: string
          emblem_url?: string | null
          id?: string
          key?: string
          lore_markdown?: string
          name?: string
          sector?: string
          sort_order?: number
        }
        Relationships: []
      }
      crew_session_results: {
        Row: {
          credits_delta: number
          crew_id: string
          id: string
          injury_notes: string | null
          loot_notes: string | null
          members_lost: string | null
          session_log_entry_id: string
          xp_delta: number
        }
        Insert: {
          credits_delta?: number
          crew_id: string
          id?: string
          injury_notes?: string | null
          loot_notes?: string | null
          members_lost?: string | null
          session_log_entry_id: string
          xp_delta?: number
        }
        Update: {
          credits_delta?: number
          crew_id?: string
          id?: string
          injury_notes?: string | null
          loot_notes?: string | null
          members_lost?: string | null
          session_log_entry_id?: string
          xp_delta?: number
        }
        Relationships: [
          {
            foreignKeyName: "crew_session_results_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_session_results_session_log_entry_id_fkey"
            columns: ["session_log_entry_id"]
            isOneToOne: false
            referencedRelation: "session_log_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      crew_ship_upgrades: {
        Row: {
          crew_id: string
          id: string
          purchased_at: string
          ship_upgrade_type_id: string
          target_note: string | null
        }
        Insert: {
          crew_id: string
          id?: string
          purchased_at?: string
          ship_upgrade_type_id: string
          target_note?: string | null
        }
        Update: {
          crew_id?: string
          id?: string
          purchased_at?: string
          ship_upgrade_type_id?: string
          target_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crew_ship_upgrades_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crew_ship_upgrades_ship_upgrade_type_id_fkey"
            columns: ["ship_upgrade_type_id"]
            isOneToOne: false
            referencedRelation: "ship_upgrade_types"
            referencedColumns: ["id"]
          },
        ]
      }
      crews: {
        Row: {
          campaign_id: string
          corp_id: string
          created_at: string
          credits: number
          experience: number
          id: string
          name: string
          notes: string | null
          player_id: string
          ship_name: string | null
          updated_at: string
        }
        Insert: {
          campaign_id: string
          corp_id: string
          created_at?: string
          credits?: number
          experience?: number
          id?: string
          name?: string
          notes?: string | null
          player_id: string
          ship_name?: string | null
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          corp_id?: string
          created_at?: string
          credits?: number
          experience?: number
          id?: string
          name?: string
          notes?: string | null
          player_id?: string
          ship_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crews_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crews_corp_id_fkey"
            columns: ["corp_id"]
            isOneToOne: false
            referencedRelation: "corps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crews_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_items: {
        Row: {
          base_weapon_type: string | null
          category: string
          cost_cr: number | null
          created_at: string
          damage_modifier: string | null
          effect_text: string
          gear_slots: number
          id: string
          key: string
          linked_power_id: string | null
          max_range: string | null
          name: string
          restrictions: string | null
          sell_cr: number | null
          uses: number | null
        }
        Insert: {
          base_weapon_type?: string | null
          category: string
          cost_cr?: number | null
          created_at?: string
          damage_modifier?: string | null
          effect_text: string
          gear_slots?: number
          id?: string
          key: string
          linked_power_id?: string | null
          max_range?: string | null
          name: string
          restrictions?: string | null
          sell_cr?: number | null
          uses?: number | null
        }
        Update: {
          base_weapon_type?: string | null
          category?: string
          cost_cr?: number | null
          created_at?: string
          damage_modifier?: string | null
          effect_text?: string
          gear_slots?: number
          id?: string
          key?: string
          linked_power_id?: string | null
          max_range?: string | null
          name?: string
          restrictions?: string | null
          sell_cr?: number | null
          uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_items_linked_power_id_fkey"
            columns: ["linked_power_id"]
            isOneToOne: false
            referencedRelation: "powers"
            referencedColumns: ["id"]
          },
        ]
      }
      first_mate_gear: {
        Row: {
          created_at: string
          equipment_item_id: string
          first_mate_id: string
          id: string
          notes: string | null
        }
        Insert: {
          created_at?: string
          equipment_item_id: string
          first_mate_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          created_at?: string
          equipment_item_id?: string
          first_mate_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "first_mate_gear_equipment_item_id_fkey"
            columns: ["equipment_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "first_mate_gear_first_mate_id_fkey"
            columns: ["first_mate_id"]
            isOneToOne: false
            referencedRelation: "first_mates"
            referencedColumns: ["id"]
          },
        ]
      }
      first_mate_powers: {
        Row: {
          activation_number: number
          first_mate_id: string
          id: string
          is_core: boolean
          power_id: string
          reduced: boolean
        }
        Insert: {
          activation_number: number
          first_mate_id: string
          id?: string
          is_core: boolean
          power_id: string
          reduced?: boolean
        }
        Update: {
          activation_number?: number
          first_mate_id?: string
          id?: string
          is_core?: boolean
          power_id?: string
          reduced?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "first_mate_powers_first_mate_id_fkey"
            columns: ["first_mate_id"]
            isOneToOne: false
            referencedRelation: "first_mates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "first_mate_powers_power_id_fkey"
            columns: ["power_id"]
            isOneToOne: false
            referencedRelation: "powers"
            referencedColumns: ["id"]
          },
        ]
      }
      first_mates: {
        Row: {
          armour: number
          background_id: string
          chosen_stat_options: string[]
          created_at: string
          crew_id: string
          current_health: number
          fight: number
          health: number
          id: string
          level: number
          move: number
          name: string
          permanent_injuries: Json
          shoot: number
          updated_at: string
          will: number
        }
        Insert: {
          armour: number
          background_id: string
          chosen_stat_options?: string[]
          created_at?: string
          crew_id: string
          current_health: number
          fight: number
          health: number
          id?: string
          level?: number
          move: number
          name?: string
          permanent_injuries?: Json
          shoot: number
          updated_at?: string
          will: number
        }
        Update: {
          armour?: number
          background_id?: string
          chosen_stat_options?: string[]
          created_at?: string
          crew_id?: string
          current_health?: number
          fight?: number
          health?: number
          id?: string
          level?: number
          move?: number
          name?: string
          permanent_injuries?: Json
          shoot?: number
          updated_at?: string
          will?: number
        }
        Relationships: [
          {
            foreignKeyName: "first_mates_background_id_fkey"
            columns: ["background_id"]
            isOneToOne: false
            referencedRelation: "backgrounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "first_mates_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: true
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          campaign_id: string
          created_at: string
          created_by: string
          description: string | null
          id: string
          report_text: string | null
          status: string
          title: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          report_text?: string | null
          status?: string
          title: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          report_text?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "missions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "missions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_injury_types: {
        Row: {
          created_at: string
          effect_text: string
          id: string
          key: string
          max_stacks: number
          name: string
          penalty_per_stack: number | null
          stat_key: string | null
        }
        Insert: {
          created_at?: string
          effect_text: string
          id?: string
          key: string
          max_stacks?: number
          name: string
          penalty_per_stack?: number | null
          stat_key?: string | null
        }
        Update: {
          created_at?: string
          effect_text?: string
          id?: string
          key?: string
          max_stacks?: number
          name?: string
          penalty_per_stack?: number | null
          stat_key?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string
          display_name: string
          id: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
        }
        Relationships: []
      }
      powers: {
        Row: {
          activation_number: number
          armour_interference: boolean
          created_at: string
          full_text: string
          id: string
          key: string
          name: string
          strain: number
          types: string[]
        }
        Insert: {
          activation_number: number
          armour_interference?: boolean
          created_at?: string
          full_text: string
          id?: string
          key: string
          name: string
          strain: number
          types: string[]
        }
        Update: {
          activation_number?: number
          armour_interference?: boolean
          created_at?: string
          full_text?: string
          id?: string
          key?: string
          name?: string
          strain?: number
          types?: string[]
        }
        Relationships: []
      }
      session_log_entries: {
        Row: {
          campaign_id: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          session_date: string
          title: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          session_date: string
          title: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          session_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_log_entries_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_log_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      ship_hold_items: {
        Row: {
          created_at: string
          crew_id: string
          custom_name: string | null
          equipment_item_id: string | null
          id: string
          notes: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          crew_id: string
          custom_name?: string | null
          equipment_item_id?: string | null
          id?: string
          notes?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          crew_id?: string
          custom_name?: string | null
          equipment_item_id?: string | null
          id?: string
          notes?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "ship_hold_items_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ship_hold_items_equipment_item_id_fkey"
            columns: ["equipment_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
        ]
      }
      ship_upgrade_types: {
        Row: {
          cost_cr: number
          created_at: string
          effect_text: string
          id: string
          key: string
          max_purchases: number
          name: string
        }
        Insert: {
          cost_cr: number
          created_at?: string
          effect_text: string
          id?: string
          key: string
          max_purchases?: number
          name: string
        }
        Update: {
          cost_cr?: number
          created_at?: string
          effect_text?: string
          id?: string
          key?: string
          max_purchases?: number
          name?: string
        }
        Relationships: []
      }
      soldier_type_gear: {
        Row: {
          equipment_item_id: string
          quantity: number
          soldier_type_id: string
        }
        Insert: {
          equipment_item_id: string
          quantity?: number
          soldier_type_id: string
        }
        Update: {
          equipment_item_id?: string
          quantity?: number
          soldier_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "soldier_type_gear_equipment_item_id_fkey"
            columns: ["equipment_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soldier_type_gear_soldier_type_id_fkey"
            columns: ["soldier_type_id"]
            isOneToOne: false
            referencedRelation: "soldier_types"
            referencedColumns: ["id"]
          },
        ]
      }
      soldier_types: {
        Row: {
          armour: number
          cost_cr: number
          created_at: string
          fight: number
          health: number
          id: string
          key: string
          move: number
          name: string
          notes: string | null
          shoot: number
          table_type: string
          will: number
        }
        Insert: {
          armour: number
          cost_cr: number
          created_at?: string
          fight: number
          health: number
          id?: string
          key: string
          move: number
          name: string
          notes?: string | null
          shoot: number
          table_type: string
          will: number
        }
        Update: {
          armour?: number
          cost_cr?: number
          created_at?: string
          fight?: number
          health?: number
          id?: string
          key?: string
          move?: number
          name?: string
          notes?: string | null
          shoot?: number
          table_type?: string
          will?: number
        }
        Relationships: []
      }
      soldiers: {
        Row: {
          bonus_gear_item_id: string | null
          created_at: string
          crew_id: string
          current_health: number
          id: string
          is_robot: boolean
          name: string | null
          permanent_injuries: Json
          soldier_type_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bonus_gear_item_id?: string | null
          created_at?: string
          crew_id: string
          current_health: number
          id?: string
          is_robot?: boolean
          name?: string | null
          permanent_injuries?: Json
          soldier_type_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bonus_gear_item_id?: string | null
          created_at?: string
          crew_id?: string
          current_health?: number
          id?: string
          is_robot?: boolean
          name?: string | null
          permanent_injuries?: Json
          soldier_type_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "soldiers_bonus_gear_item_id_fkey"
            columns: ["bonus_gear_item_id"]
            isOneToOne: false
            referencedRelation: "equipment_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soldiers_crew_id_fkey"
            columns: ["crew_id"]
            isOneToOne: false
            referencedRelation: "crews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soldiers_soldier_type_id_fkey"
            columns: ["soldier_type_id"]
            isOneToOne: false
            referencedRelation: "soldier_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_read_crew: { Args: { p_crew_id: string }; Returns: boolean }
      is_campaign_member: { Args: { p_campaign_id: string }; Returns: boolean }
      owns_crew: { Args: { p_crew_id: string }; Returns: boolean }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
