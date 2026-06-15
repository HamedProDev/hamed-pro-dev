'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, name }) })
      if (res.ok) { setStatus('success') } else { setStatus('error') }
    } catch { setStatus('error') }
  }

  return (
    <main id="main-content" className="section-padding">
      <div className="container-wide max-w-2xl text-center">
        <MetadataInjector title="Newsletter" description="Join 500+ developers getting weekly insights on web development, AI/ML, and tech opportunities in Rwanda." url="/newsletter" />
        <Breadcrumbs items={[{ label: 'Newsletter' }]} />
        <h1 className="text-4xl font-bold mb-4">Newsletter</h1>
        <p className="text-text-secondary mb-8">Join 500+ developers getting weekly insights on web development, AI/ML, and tech opportunities in Rwanda.</p>
        {status === 'success' ? (
          <p className="text-green-400 text-lg">Welcome aboard! Check your inbox for a confirmation.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto text-left">
            <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            <Input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Button type="submit" disabled={status === 'loading'} className="w-full"><Send className="h-4 w-4 mr-2" /> Subscribe</Button>
          </form>
        )}
      </div>
    </main>
  )
}
