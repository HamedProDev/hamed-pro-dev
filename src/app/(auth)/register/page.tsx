'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Code2, Loader2 } from 'lucide-react'
import { OAuthButtons } from '../login/oauth-buttons'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const form = e.currentTarget as HTMLFormElement
      const formData = new FormData(form)
      const { registerAction } = await import('./actions')
      const result = await registerAction(null, formData)
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
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join the HamedProDev community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButtons />
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-500" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-dark-700 px-2 text-text-muted">or</span></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Name</Label><Input name="name" required /></div>
          <div><Label>Email</Label><Input type="email" name="email" required /></div>
          <div><Label>Password</Label><Input type="password" name="password" required minLength={8} /></div>
          <div><Label>Confirm Password</Label><Input type="password" name="confirmPassword" required /></div>
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
