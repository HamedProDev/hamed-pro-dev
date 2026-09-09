'use client'

import { useMemo } from 'react'
import { useAuth as useFirebaseAuth } from '@/components/auth-provider'

export function useAuth() {
  const { user, loading, signOut, refresh } = useFirebaseAuth()
  // Memoize so consumers get a STABLE object between renders. Otherwise every
  // render produces a new reference and any useEffect([user]) re-runs on each
  // keystroke — wiping form state (inputs "deleting themselves", upload reset).
  const stableUser = useMemo(
    () => (user ? { ...user, name: user.name || '' } : null),
    [user]
  )
  return {
    user: stableUser,
    isAuthenticated: !!stableUser,
    isLoading: loading,
    isAdmin: stableUser?.role === 'admin',
    signOut,
    refreshUser: refresh,
  }
}

export type { AuthUser } from '@/components/auth-provider'
