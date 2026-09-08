'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // "registered" flag from the register page.
  const registered = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('registered') === 'true'
    : false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const email = (formData.get('email') as string).trim()
    const password = formData.get('password') as string

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        const msg = authError.message.toLowerCase()
        if (msg.includes('invalid login credentials')) {
          setError('Invalid email or password.')
        } else if (msg.includes('not confirmed')) {
          setError('Please confirm your email first — check your inbox for the confirmation link.')
        } else {
          setError(authError.message)
        }
        setLoading(false)
        return
      }

      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      window.location.href = redirect && redirect.startsWith('/') ? redirect : '/dashboard'
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <div className="rounded-2xl border border-border-primary bg-surface-card/80 p-8">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-3">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-400 flex items-center justify-center text-white font-bold shadow-sm">
              HH
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-text-secondary mt-1">Sign in to continue learning</p>
        </div>

        {registered && (
          <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
            Account created! Check your inbox for a confirmation email, then sign in below.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input id="login-password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Your password" required autoComplete="current-password" className="pr-10" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" className="w-full gradient-bg text-white" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</> : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-brand-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}
