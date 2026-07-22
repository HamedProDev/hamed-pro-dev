'use client'

import { useAuth as useFirebaseAuth } from '@/components/auth-provider'

export function useAuth() {
  const { user, loading, signOut } = useFirebaseAuth()
  return {
    user: user ? { ...user, name: user.name || '' } : null,
    isAuthenticated: !!user,
    isLoading: loading,
    isAdmin: user?.role === 'admin',
    signOut,
  }
}

export type { AuthUser } from '@/components/auth-provider'
