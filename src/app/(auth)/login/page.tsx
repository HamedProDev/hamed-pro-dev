'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Code2 } from 'lucide-react'
import { OAuthButtons } from './oauth-buttons'

export default function LoginPage() {
  const [csrfToken, setCsrfToken] = useState('')

  useEffect(() => {
    fetch('/api/auth/csrf')
      .then(r => r.json())
      .then(d => setCsrfToken(d.csrfToken || ''))
      .catch(() => {})
  }, [])

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
        <form method="POST" action="/api/auth/signin/credentials" className="space-y-4">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/dashboard" />
          <div><Label>Email</Label><Input type="email" name="email" required /></div>
          <div><Label>Password</Label><Input type="password" name="password" required /></div>
          <Button type="submit" className="w-full gradient-bg text-white">Sign In</Button>
        </form>
        <p className="text-center text-sm text-text-secondary">Don&apos;t have an account? <Link href="/register" className="text-brand-primary hover:underline">Sign up</Link></p>
      </CardContent>
    </Card>
  )
}
