'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, initializeAuth, getUsage } from '@/lib/supabase'

export interface UsageData {
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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [usage, setUsage] = useState<UsageData | null>(null)

  useEffect(() => {
    // First check if there's already a session
    const checkSession = async () => {
      try {
        const { data: { user: existingUser } } = await supabase.auth.getUser()
        
        if (existingUser) {
          // User is already signed in
          setUser(existingUser)
          const usageData = await getUsage()
          setUsage(usageData)
        } else {
          // No existing session, initialize anonymous auth
          const anonymousUser = await initializeAuth()
          setUser(anonymousUser)
          if (anonymousUser) {
            const usageData = await getUsage()
            setUsage(usageData)
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
          try {
            const usageData = await getUsage()
            setUsage(usageData)
          } catch (error) {
            console.error('Error loading usage data:', error)
          }
        } else {
          setUsage(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const refreshUsage = async () => {
    if (user) {
      try {
        const usageData = await getUsage()
        setUsage(usageData)
        return usageData
      } catch (error) {
        console.error('Error refreshing usage:', error)
        throw error
      }
    }
  }

  return {
    user,
    loading,
    usage,
    refreshUsage,
    isAnonymous: user?.is_anonymous ?? false,
    isPro: usage?.role === 'pro',
  }
}
