'use client'

import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status, update } = useSession()
  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isAdmin: session?.user?.role === 'admin',
    update,
  }
}
