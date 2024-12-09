export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      driver: {
        Row: {
          active: boolean
          coordinate_x: number | null
          coordinate_y: number | null
          id: string
        }
        Insert: {
          active?: boolean
          coordinate_x?: number | null
          coordinate_y?: number | null
          id: string
        }
        Update: {
          active?: boolean
          coordinate_x?: number | null
          coordinate_y?: number | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'driver_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'member'
            referencedColumns: ['id']
          },
        ]
      }
      member: {
        Row: {
          avatar_url: string | null
          cre_ts: string | null
          fname: string
          id: string
          lname: string
          type: Database['public']['Enums']['user_type']
        }
        Insert: {
          avatar_url?: string | null
          cre_ts?: string | null
          fname: string
          id?: string
          lname: string
          type?: Database['public']['Enums']['user_type']
        }
        Update: {
          avatar_url?: string | null
          cre_ts?: string | null
          fname?: string
          id?: string
          lname?: string
          type?: Database['public']['Enums']['user_type']
        }
        Relationships: [
          {
            foreignKeyName: 'member_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      trip: {
        Row: {
          created_at: string
          dest_addr: string
          dest_lat: number
          dest_lng: number
          driver: string | null
          id: string
          pickup_addr: string
          pickup_lat: number
          pickup_lng: number
          pickup_time: string
          rider: string | null
          status: Database['public']['Enums']['trip_status'] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dest_addr: string
          dest_lat: number
          dest_lng: number
          driver?: string | null
          id?: string
          pickup_addr: string
          pickup_lat: number
          pickup_lng: number
          pickup_time: string
          rider?: string | null
          status?: Database['public']['Enums']['trip_status'] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dest_addr?: string
          dest_lat?: number
          dest_lng?: number
          driver?: string | null
          id?: string
          pickup_addr?: string
          pickup_lat?: number
          pickup_lng?: number
          pickup_time?: string
          rider?: string | null
          status?: Database['public']['Enums']['trip_status'] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'trip_driver_fkey'
            columns: ['driver']
            isOneToOne: false
            referencedRelation: 'driver'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'trip_rider_fkey'
            columns: ['rider']
            isOneToOne: false
            referencedRelation: 'member'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_closest_drivers: {
        Args: {
          rider_x: string
          rider_y: string
        }
        Returns: {
          driver_id: string
          active: boolean
          coordinate_x: number
          coordinate_y: number
          distance: number
          fname: string
          lname: string
        }[]
      }
    }
    Enums: {
      trip_status: 'INITIATED' | 'ACTIVE' | 'COMPLETE' | 'CANCELLED' | 'ASSIGNED'
      user_type: 'DRIVER' | 'RIDER' | 'ADMIN'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
