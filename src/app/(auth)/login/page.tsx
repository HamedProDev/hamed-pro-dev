'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Code2, Loader2 } from 'lucide-react'
import { OAuthButtons } from './oauth-buttons'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { loginAction } = await import('./actions')
      const result = await loginAction(null, new FormData(e.currentTarget as HTMLFormElement))
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
    } catch {
      window.location.href = '/dashboard'
    }
  }

  return (
    <Card className="border-dark-500 bg-dark-700">
      <CardHeader className="text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2"><Code2 className="h-8 w-8 text-brand-primary" /></Link>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButtons />
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-500" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-dark-700 px-2 text-text-muted">or</span></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Email</Label><Input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><Label>Password</Label><Input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full gradient-bg text-white" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</> : 'Sign In'}
          </Button>
        </form>
        <p className="text-center text-sm text-text-secondary">Don&apos;t have an account? <Link href="/register" className="text-brand-primary hover:underline">Sign up</Link></p>
      </CardContent>
    </Card>
  )
}
