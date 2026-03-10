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
      accounts: {
        Row: {
          asset_group: string | null
          created_at: string | null
          id: string
          initial_balance: number | null
          name: string
          owner: string | null
          space_id: string | null
          sub_type: string | null
          type: string
        }
        Insert: {
          asset_group?: string | null
          created_at?: string | null
          id?: string
          initial_balance?: number | null
          name: string
          owner?: string | null
          space_id?: string | null
          sub_type?: string | null
          type: string
        }
        Update: {
          asset_group?: string | null
          created_at?: string | null
          id?: string
          initial_balance?: number | null
          name?: string
          owner?: string | null
          space_id?: string | null
          sub_type?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'accounts_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'spaces'
            referencedColumns: ['id']
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          space_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          space_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          space_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'spaces'
            referencedColumns: ['id']
          },
        ]
      }
      space_members: {
        Row: {
          joined_at: string | null
          role: Database['public']['Enums']['user_role'] | null
          space_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          role?: Database['public']['Enums']['user_role'] | null
          space_id: string
          user_id: string
        }
        Update: {
          joined_at?: string | null
          role?: Database['public']['Enums']['user_role'] | null
          space_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'space_members_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'spaces'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'space_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      spaces: {
        Row: {
          created_at: string | null
          id: string
          invite_password: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invite_password?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invite_password?: string | null
          name?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          from_account_id: string | null
          from_category_id: string | null
          id: string
          memo: string | null
          space_id: string | null
          to_account_id: string | null
          to_category_id: string | null
          type: Database['public']['Enums']['tx_type']
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          from_account_id?: string | null
          from_category_id?: string | null
          id?: string
          memo?: string | null
          space_id?: string | null
          to_account_id?: string | null
          to_category_id?: string | null
          type: Database['public']['Enums']['tx_type']
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          from_account_id?: string | null
          from_category_id?: string | null
          id?: string
          memo?: string | null
          space_id?: string | null
          to_account_id?: string | null
          to_category_id?: string | null
          type?: Database['public']['Enums']['tx_type']
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_from_account_id_fkey'
            columns: ['from_account_id']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transactions_from_category_id_fkey'
            columns: ['from_category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transactions_space_id_fkey'
            columns: ['space_id']
            isOneToOne: false
            referencedRelation: 'spaces'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transactions_to_account_id_fkey'
            columns: ['to_account_id']
            isOneToOne: false
            referencedRelation: 'accounts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transactions_to_category_id_fkey'
            columns: ['to_category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transactions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_space: { Args: { target_space_id: string }; Returns: boolean }
      create_space_with_owner: { Args: { space_name: string }; Returns: string }
      get_space_invite_info: {
        Args: { hashed_password?: string; target_space_id: string }
        Returns: Json
      }
      is_space_member: { Args: { target_space_id: string }; Returns: boolean }
      join_space_with_invite: {
        Args: {
          hashed_password?: string
          plain_password?: string
          target_space_id: string
        }
        Returns: Json
      }
      set_space_invite_password: {
        Args: { plain_password: string; target_space_id: string }
        Returns: string
      }
      update_space_member_role: {
        Args: {
          next_role: Database['public']['Enums']['user_role']
          target_space_id: string
          target_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      tx_type: '수입' | '지출' | '이체'
      user_role: 'OWNER' | 'MANAGER' | 'MEMBER'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      tx_type: ['수입', '지출', '이체'],
      user_role: ['OWNER', 'MANAGER', 'MEMBER'],
    },
  },
} as const
