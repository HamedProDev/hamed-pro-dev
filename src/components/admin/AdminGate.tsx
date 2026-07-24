'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react'
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
const ADMIN_PIN = '19890'
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
  const [phase, setPhase] = useState<'pin' | 'password'>('pin')
  const [pin, setPin] = useState(['', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)
  const [shake, setShake] = useState(false)
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)
    setError(false)

    if (value && index < 4) {
      pinRefs.current[index + 1]?.focus()
    }

    if (newPin.every(d => d !== '')) {
      const entered = newPin.join('')
      if (entered === ADMIN_PIN) {
        setTimeout(() => setPhase('password'), 300)
      } else {
        setShake(true)
        setError(true)
        setTimeout(() => {
          setShake(false)
          setPin(['', '', '', '', ''])
          pinRefs.current[0]?.focus()
        }, 600)
      }
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus()
    }
  }

  const handlePinPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5)
    if (pasted.length === 5) {
      const newPin = pasted.split('')
      setPin(newPin)
      pinRefs.current[4]?.focus()
      if (pasted === ADMIN_PIN) {
        setTimeout(() => setPhase('password'), 300)
      } else {
        setShake(true)
        setError(true)
        setTimeout(() => {
          setShake(false)
          setPin(['', '', '', '', ''])
          pinRefs.current[0]?.focus()
        }, 600)
      }
    }
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

            {phase === 'pin' ? (
              <>
                <p className="text-text-muted text-sm mb-6">Enter your PIN to continue</p>
                <div className={`flex justify-center gap-3 mb-4 ${shake ? 'animate-shake' : ''}`}>
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { pinRefs.current[i] = el }}
                      id={`pin-${i}`}
                      name={`pin-${i}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handlePinChange(i, e.target.value)}
                      onKeyDown={e => handlePinKeyDown(i, e)}
                      onPaste={handlePinPaste}
                      autoFocus={i === 0}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-lg bg-surface-secondary border-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                        error
                          ? 'border-red-500 focus:border-red-500'
                          : digit
                            ? 'border-blue-500 focus:border-blue-500'
                            : 'border-border-primary focus:border-blue-500'
                      }`}
                    />
                  ))}
                </div>
                {error && <p className="text-red-400 text-sm mb-4">Incorrect PIN. Try again.</p>}
                <p className="text-text-muted text-xs">5-digit PIN required</p>
              </>
            ) : (
              <>
                <p className="text-text-muted text-sm mb-6">PIN verified. Enter admin password.</p>
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
                  onClick={() => { setPhase('pin'); setPin(['', '', '', '', '']); setPassword(''); setError(false); setTimeout(() => pinRefs.current[0]?.focus(), 50) }}
                  className="mt-3 text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  ← Back to PIN
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
