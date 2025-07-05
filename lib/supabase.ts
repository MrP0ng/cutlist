import { createClient } from '@supabase/supabase-js'

// Database type definitions
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'free' | 'pro'
          pro_until: string | null
        }
        Insert: {
          id: string
          role?: 'free' | 'pro'
          pro_until?: string | null
        }
        Update: {
          id?: string
          role?: 'free' | 'pro'
          pro_until?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          owner: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner?: string
          name?: string | null
          created_at?: string
        }
      }
      sheets: {
        Row: {
          id: string
          project_id: string
          material: string | null
          length_mm: number
          width_mm: number
          thickness_mm: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          material?: string | null
          length_mm: number
          width_mm: number
          thickness_mm?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          material?: string | null
          length_mm?: number
          width_mm?: number
          thickness_mm?: number | null
          created_at?: string
        }
      }
      parts: {
        Row: {
          id: string
          project_id: string
          w_mm: number
          h_mm: number
          qty: number
          label: string | null
        }
        Insert: {
          id?: string
          project_id: string
          w_mm: number
          h_mm: number
          qty?: number
          label?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          w_mm?: number
          h_mm?: number
          qty?: number
          label?: string | null
        }
      }
    }
    Functions: {
      get_usage: {
        Args: Record<PropertyKey, never>
        Returns: {
          projects: number
          sheets: number
          parts: number
          role: string
          pro_until: string | null
          limits: {
            projects: number | null
            sheets: number | null
            parts_per_project: number | null
          }
        }
      }
    }
  }
}

// Create the Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // New anonymous session each tab
      autoRefreshToken: false,
    },
  }
)

// Initialize anonymous authentication
export async function initializeAuth() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error('Error signing in anonymously:', error)
      throw error
    }
    return data.user
  }
  
  return user
}

// Get usage statistics for the current user
export async function getUsage() {
  const { data, error } = await supabase.rpc('get_usage')
  if (error) {
    console.error('Error getting usage:', error)
    throw error
  }
  return data
}

// Sign in with Google OAuth
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
  
  return data
}

// Sign in with email magic link (passwordless)
export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    console.error('Error sending magic link:', error)
    throw error
  }
  
  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export default supabase
