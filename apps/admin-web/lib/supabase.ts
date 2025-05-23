import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

// Use default values for build time when env vars might not be available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create supabase client
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  )
} 