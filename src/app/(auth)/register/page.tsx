'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/shared/Logo'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNotice('')
    const form = e.currentTarget as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      // Capture referral code (a referring user's id) if present.
      const ref = new URLSearchParams(window.location.search).get('ref')

      const supabase = createClient()
      const { data: res, error: signUpError } = await supabase.auth.signUp({
        email: (data.email as string).trim(),
        password: data.password as string,
        options: { data: { name: data.name as string, referred_by: ref || '' } },
      })

      if (signUpError) {
        const msg = signUpError.message.toLowerCase()
        let friendly = signUpError.message
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          friendly = 'This email is already registered — try signing in instead.'
        } else if (msg.includes('password')) {
          friendly = 'Password must be at least 8 characters long.'
        } else if (msg.includes('rate limit')) {
          friendly = 'Too many attempts — wait a minute and try again.'
        }
        setError(friendly)
        toast.error(friendly)
        setLoading(false)
        return
      }

      // No session yet → email confirmation is required.
      if (!res?.session) {
        const message = 'Account created! Check your inbox for a confirmation email, then sign in.'
        setNotice(message)
        toast.success('Account created! Please check your email to confirm it.')
        setLoading(false)
        return
      }

      toast.success('Account created! Welcome aboard.')

      // Fire-and-forget welcome email (no-op if Resend isn't configured).
      fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, name: data.name, referred_by: ref || '' }),
      }).catch(() => {})

      window.location.href = '/dashboard'
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
          <Link href="/" className="mb-3 inline-flex justify-center">
            <Logo className="h-10 w-10" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-text-secondary mt-1">Join free and start learning today</p>
        </div>

        {notice && (
          <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" placeholder="e.g. Hamed Hussein" required autoComplete="name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} name="password" placeholder="At least 8 characters" required minLength={8} autoComplete="new-password" className="pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" type="password" name="confirmPassword" placeholder="Repeat your password" required autoComplete="new-password" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" className="w-full gradient-bg text-white" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account...</> : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
