'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

const AdminAuthContext = createContext<{
  isAdmin: boolean
  loading: boolean
  unlock: (password: string) => Promise<boolean>
  lock: () => void
}>({ isAdmin: false, loading: true, unlock: async () => false, lock: () => {} })

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

const ADMIN_PASSWORD = '@He00Ri#Ga4Da'
const ADMIN_COOKIE = 'admin-auth-gate'
const ADMIN_COOKIE_VALUE = 'hamedpro-admin-verified'

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(c => c.startsWith(ADMIN_COOKIE + '='))
    if (cookie?.split('=')[1] === ADMIN_COOKIE_VALUE) {
      setIsAdmin(true)
    }
    setLoading(false)
  }, [])

  const unlock = async (password: string): Promise<boolean> => {
    if (password === ADMIN_PASSWORD) {
      document.cookie = `${ADMIN_COOKIE}=${ADMIN_COOKIE_VALUE}; path=/admin; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      setIsAdmin(true)
      return true
    }
    return false
  }

  const lock = () => {
    document.cookie = `${ADMIN_COOKIE}=; path=/admin; max-age=0`
    setIsAdmin(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAdmin, loading, unlock, lock }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function AdminGate({ children }: { children: ReactNode }) {
  const { isAdmin, loading, unlock } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="w-full max-w-sm mx-4">
          <div className="admin-card p-8 text-center">
            <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Admin Access</h1>
            <p className="text-text-muted text-sm mb-6">Enter the admin password to continue</p>
            <form onSubmit={async (e) => {
              e.preventDefault()
              setChecking(true)
              setError(false)
              const ok = await unlock(password)
              if (!ok) setError(true)
              setChecking(false)
            }}>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false) }}
                placeholder="Enter admin password"
                autoFocus
                className="w-full px-4 py-2.5 rounded-lg bg-surface-secondary border border-border-primary text-text-primary focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 mb-4 text-center tracking-wider"
              />
              {error && <p className="text-red-400 text-sm mb-4">Incorrect password. Try again.</p>}
              <button
                type="submit"
                disabled={checking || !password}
                className="w-full py-2.5 rounded-lg gradient-bg text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50"
              >
                {checking ? 'Verifying...' : 'Unlock Admin'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
