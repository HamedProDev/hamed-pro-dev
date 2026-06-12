'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }) } else { setStatus('error') }
    } catch { setStatus('error') }
  }

  return (
    <div className="section-padding">
      <div className="container-wide max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
        <p className="text-text-secondary mb-8">Have a project in mind? Let&apos;s talk.</p>
        {status === 'success' ? (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center"><p className="text-green-400 font-medium">Message sent! I&apos;ll get back to you within 24-48 hours.</p></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
            </div>
            <div><Label>Subject</Label><Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required /></div>
            <div><Label>Message</Label><Textarea rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required /></div>
            <Button type="submit" disabled={status === 'loading'} className="w-full"><Send className="h-4 w-4 mr-2" /> {status === 'loading' ? 'Sending...' : 'Send Message'}</Button>
            {status === 'error' && <p className="text-red-400 text-sm text-center">Failed to send. Please try again.</p>}
          </form>
        )}
      </div>
    </div>
  )
}
