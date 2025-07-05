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
          width_mm: number
          height_mm: number
          qty: number
          label: string | null
        }
        Insert: {
          id?: string
          project_id: string
          width_mm: number
          height_mm: number
          qty?: number
          label?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          width_mm?: number
          height_mm?: number
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
      persistSession: true, // Keep sessions across browser refreshes
      autoRefreshToken: true, // Auto refresh tokens
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

// Project CRUD operations
export async function createProject(name?: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be authenticated to create projects')
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([{ 
      name: name || 'Untitled Project',
      owner: user.id
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating project:', error)
    throw error
  }
  
  return data
}

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
  
  return data
}

export async function updateProject(id: string, updates: { name?: string }) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating project:', error)
    throw error
  }
  
  return data
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

// Sheet CRUD operations
export async function createSheet(projectId: string, sheet: {
  material?: string
  length_mm: number
  width_mm: number
  thickness_mm?: number
}) {
  console.log('Creating sheet with data:', { projectId, sheet })
  
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user?.id)
  
  const { data, error } = await supabase
    .from('sheets')
    .insert([{ 
      project_id: projectId,
      ...sheet
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating sheet:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    throw error
  }
  
  console.log('Sheet created successfully:', data)
  return data
}

export async function getSheets(projectId: string) {
  const { data, error } = await supabase
    .from('sheets')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching sheets:', error)
    throw error
  }
  
  return data
}

export async function updateSheet(id: string, updates: {
  material?: string
  length_mm?: number
  width_mm?: number
  thickness_mm?: number
}) {
  const { data, error } = await supabase
    .from('sheets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating sheet:', error)
    throw error
  }
  
  return data
}

export async function deleteSheet(id: string) {
  const { error } = await supabase
    .from('sheets')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting sheet:', error)
    throw error
  }
}

// Part CRUD operations
export async function createPart(projectId: string, part: {
  width_mm: number
  height_mm: number
  qty?: number
  label?: string
}) {
  console.log('Creating part with data:', { projectId, part })
  
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user?.id)
  
  const { data, error } = await supabase
    .from('parts')
    .insert([{ 
      project_id: projectId,
      qty: 1,
      ...part
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating part:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    throw error
  }
  
  console.log('Part created successfully:', data)
  return data
}

export async function getParts(projectId: string) {
  const { data, error } = await supabase
    .from('parts')
    .select('*')
    .eq('project_id', projectId)
    .order('id', { ascending: true })
  
  if (error) {
    console.error('Error fetching parts:', error)
    throw error
  }
  
  return data
}

export async function updatePart(id: string, updates: {
  width_mm?: number
  height_mm?: number
  qty?: number
  label?: string
}) {
  const { data, error } = await supabase
    .from('parts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating part:', error)
    throw error
  }
  
  return data
}

export async function deletePart(id: string) {
  const { error } = await supabase
    .from('parts')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting part:', error)
    throw error
  }
}

export default supabase
