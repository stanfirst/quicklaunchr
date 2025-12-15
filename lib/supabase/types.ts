/**
 * Supabase Database Types
 * 
 * This file should be generated from your Supabase project.
 * To generate types, run:
 * npx supabase gen types typescript --project-id <your-project-id> > lib/supabase/types.ts
 * 
 * These types are manually maintained. Update them when you change your database schema.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'user' | 'manager'
export type UserType = 'startup' | 'investor'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          role: UserRole
          user_type: UserType
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          role?: UserRole
          user_type: UserType
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          role?: UserRole
          user_type?: UserType
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      user_type: UserType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

