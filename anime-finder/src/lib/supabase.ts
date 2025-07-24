import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://fdxbvdoiabfasvnjlmgw.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeGJ2ZG9pYWJmYXN2bmpsbWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTk4ODAsImV4cCI6MjA2ODg5NTg4MH0.RVlgZlaCYc8j-CudKztWzAgJdhxD-ZP04wnHOX_xsbQ"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      favorites: {
        Row: {
          id: string
          user_id: string
          anime_id: number
          anime_data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          anime_id: number
          anime_data: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          anime_id?: number
          anime_data?: any
          created_at?: string
        }
      }
    }
  }
}
