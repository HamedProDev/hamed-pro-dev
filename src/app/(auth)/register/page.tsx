'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Code2, Github, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [providers, setProviders] = useState<string[]>(['credentials'])

  useEffect(() => {
    fetch('/api/auth/providers').then(r => r.json()).then(d => {
      if (d.providers) setProviders(d.providers)
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) })
      if (!res.ok) { const data = await res.json(); setError(data.error || 'Registration failed'); setLoading(false); return }
      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      if (result?.error) { setError('Account created but sign-in failed. Try logging in.') }
      else { router.push('/dashboard'); router.refresh() }
    } catch { setError('Something went wrong') }
    setLoading(false)
  }

  const hasOAuth = providers.includes('google') || providers.includes('github')

  return (
    <Card className="border-dark-500 bg-dark-700">
      <CardHeader className="text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2"><Code2 className="h-8 w-8 text-brand-primary" /></Link>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join the HamedProDev community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasOAuth && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {providers.includes('google') && <Button variant="outline" onClick={() => signIn('google')}>Google</Button>}
              {providers.includes('github') && <Button variant="outline" onClick={() => signIn('github')}><Github className="h-4 w-4 mr-2" /> GitHub</Button>}
            </div>
            <div className="relative"><Separator /><span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-700 px-2 text-xs text-text-muted">or</span></div>
          </>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
          <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} /></div>
          <div><Label>Confirm Password</Label><Input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required /></div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full gradient-bg text-white" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account...</> : 'Create Account'}
          </Button>
        </form>
        <p className="text-center text-sm text-text-secondary">Already have an account? <Link href="/login" className="text-brand-primary hover:underline">Sign in</Link></p>
      </CardContent>
    </Card>
  )
}
