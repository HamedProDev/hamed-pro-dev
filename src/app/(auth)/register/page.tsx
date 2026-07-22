'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Code2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const form = e.currentTarget as HTMLFormElement
    const data = Object.fromEntries(new FormData(form))

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email as string,
        password: data.password as string,
        options: { data: { name: data.name as string } },
      })

      if (signUpError) {
        setError(signUpError.message === 'User already registered' ? 'Email already registered' : signUpError.message)
        setLoading(false)
        return
      }

      window.location.href = '/login?registered=true'
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2"><Code2 className="h-8 w-8 text-brand-primary" /></Link>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join the HamedProDev community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
