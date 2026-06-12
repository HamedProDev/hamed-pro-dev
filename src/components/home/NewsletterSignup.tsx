'use client'
import { useState } from 'react'
import { Send, Mail } from 'lucide-react'
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
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-brand-primary/10 text-brand-primary mb-4">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
            <p className="text-text-secondary">Get the latest posts, courses, and opportunities delivered to your inbox. No spam, ever.</p>
          </div>
          <div>
            {status === 'success' ? (
              <p className="text-green-400 text-center md:text-left">Thanks for subscribing! Check your inbox.</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button type="submit" disabled={status === 'loading'} className="rounded-l-none gradient-bg text-white whitespace-nowrap">
                  <Send className="h-4 w-4 mr-2" /> {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
            )}
            {status === 'error' && <p className="text-red-400 text-sm mt-2">Something went wrong. Try again.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
