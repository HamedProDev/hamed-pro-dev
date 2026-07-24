'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useMemo } from 'react'
import { Eye, EyeOff } from 'lucide-react'

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

function generatePuzzle() {
  const count = 5
  const numbers = Array.from({ length: count }, (_, i) => i + 1)
  const shuffled = [...numbers].sort(() => Math.random() - 0.5)
  return { numbers, shuffled, target: numbers }
}

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
      document.cookie = `${ADMIN_COOKIE}=${ADMIN_COOKIE_VALUE}; path=/admin-control; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      setIsAdmin(true)
      return true
    }
    return false
  }

  const lock = () => {
    document.cookie = `${ADMIN_COOKIE}=; path=/admin-control; max-age=0`
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
  const [phase, setPhase] = useState<'puzzle' | 'password'>('puzzle')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)
  const [puzzle, setPuzzle] = useState(generatePuzzle)
  const [selected, setSelected] = useState<number[]>([])
  const [puzzleError, setPuzzleError] = useState(false)

  const handleNumberClick = (num: number) => {
    if (selected.includes(num)) return
    const nextIndex = selected.length
    if (puzzle.target[nextIndex] !== num) {
      setPuzzleError(true)
      setSelected([])
      setTimeout(() => {
        setPuzzleError(false)
        setPuzzle(generatePuzzle())
      }, 800)
      return
    }
    const next = [...selected, num]
    setSelected(next)
    if (next.length === puzzle.target.length) {
      setTimeout(() => setPhase('password'), 400)
    }
  }

  const isNumberSelected = (num: number) => selected.includes(num)
  const isNumberCorrect = (num: number) => {
    const idx = selected.indexOf(num)
    return idx !== -1 && puzzle.target[idx] === num
  }

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

            {phase === 'puzzle' ? (
              <>
                <p className="text-text-muted text-sm mb-6">Click the numbers in order (1 → 5) to proceed</p>
                <div className={`grid grid-cols-5 gap-3 mb-6 transition-all ${puzzleError ? 'animate-shake' : ''}`}>
                  {puzzle.shuffled.map((num) => {
                    const selected = isNumberSelected(num)
                    const correct = isNumberCorrect(num)
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleNumberClick(num)}
                        disabled={selected}
                        id={`puzzle-num-${num}`}
                        aria-label={`Number ${num}`}
                        className={`aspect-square rounded-xl text-lg font-bold transition-all duration-200 border-2 ${
                          selected
                            ? correct
                              ? 'bg-green-500 text-white border-green-500 scale-95'
                              : 'bg-red-500 text-white border-red-500'
                            : 'bg-surface-secondary border-border-primary text-text-primary hover:border-blue-500 hover:scale-105 cursor-pointer'
                        }`}
                      >
                        {num}
                      </button>
                    )
                  })}
                </div>
                {puzzleError && <p className="text-red-400 text-sm mb-4">Wrong order! Try again.</p>}
                <p className="text-text-muted text-xs">
                  {selected.length > 0
                    ? `Selected ${selected.length} of ${puzzle.target.length}`
                    : 'Select numbers from left to right'}
                </p>
              </>
            ) : (
              <>
                <p className="text-text-muted text-sm mb-6">Puzzle solved! Enter the admin password.</p>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  setChecking(true)
                  setError(false)
                  const ok = await unlock(password)
                  if (!ok) setError(true)
                  setChecking(false)
                }}>
                  <div className="relative mb-4">
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(false) }}
                      placeholder="Enter admin password"
                      autoFocus
                      className="w-full px-4 py-2.5 pr-12 rounded-lg bg-surface-secondary border border-border-primary text-text-primary focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 tracking-wider text-center"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {error && <p className="text-red-400 text-sm mb-4">Incorrect password. Try again.</p>}
                  <button
                    type="submit"
                    disabled={checking || !password}
                    className="w-full py-2.5 rounded-lg gradient-bg text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 disabled:opacity-50"
                  >
                    {checking ? 'Verifying...' : 'Unlock Admin'}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => { setPhase('puzzle'); setSelected([]); setPuzzle(generatePuzzle()); setPassword(''); setError(false) }}
                  className="mt-3 text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  ← Back to puzzle
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
