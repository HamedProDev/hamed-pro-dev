'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      if (res.ok) { setStatus('success'); setEmail('') } else { setStatus('error') }
    } catch { setStatus('error') }
  }

  return (
    <section className="section-padding border-t border-dark-500">
      <div className="container-wide text-center">
        <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
        <p className="text-text-secondary mb-6">Get the latest posts, courses, and opportunities delivered to your inbox.</p>
        {status === 'success' ? (
          <p className="text-green-400">Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 w-full" />
            <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto"><Send className="h-4 w-4 mr-2" /> {status === 'loading' ? 'Subscribing...' : 'Subscribe'}</Button>
          </form>
        )}
      </div>
    </section>
  )
}
