'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type AuthUser = {
  uid: string
  email: string | null
  name: string | null
  image: string | null
  role: string
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const getProfile = async (authUser: User) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar_url, role')
        .eq('id', authUser.id)
        .single()

      return {
        uid: authUser.id,
        email: authUser.email || null,
        name: profile?.name || authUser.email?.split('@')[0] || '',
        image: profile?.avatar_url || null,
        role: profile?.role || 'visitor',
      }
    }

    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      try {
        if (authUser) {
          setUser(await getProfile(authUser))
        } else {
          setUser(null)
        }
      } catch { setUser(null) }
      setLoading(false)
    }).catch(() => { setUser(null); setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          setUser(await getProfile(session.user))
        } else {
          setUser(null)
        }
      } catch { setUser(null) }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
