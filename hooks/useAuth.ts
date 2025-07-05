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
    // Initialize authentication
    initializeAuth()
      .then((user) => {
        setUser(user)
        if (user) {
          // Load usage data
          return getUsage()
        }
      })
      .then((usageData) => {
        if (usageData) {
          setUsage(usageData)
        }
      })
      .catch((error) => {
        console.error('Error initializing auth:', error)
      })
      .finally(() => {
        setLoading(false)
      })

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
