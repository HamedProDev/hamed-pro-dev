'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Send, Clock, Globe, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils/cn'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

// Fallbacks used when /api/settings hasn't been configured yet.
const DEFAULT_CONTACT_EMAIL = 'hamed@novasoft.rw'
const DEFAULT_CONTACT_PHONE = '+250 788 123 456'
const DEFAULT_WEBSITE = 'hamedhussein.is-a.dev'

function buildContactInfo(settings?: { contact_email?: string; contact_phone?: string } | null) {
  const email = settings?.contact_email || DEFAULT_CONTACT_EMAIL
  const phone = settings?.contact_phone || DEFAULT_CONTACT_PHONE
  return [
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}`, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { icon: Phone, label: 'Phone', value: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}`, color: 'text-green-500', bg: 'bg-green-500/10' },
    { icon: Globe, label: 'Website', value: DEFAULT_WEBSITE, href: `https://${DEFAULT_WEBSITE}`, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ]
}

const availability = [
  { day: 'Monday - Friday', time: '8:00 AM - 6:00 PM' },
  { day: 'Saturday', time: '10:00 AM - 2:00 PM' },
  { day: 'Sunday', time: 'Closed' },
]

const reasons = [
  'Web Application Development',
  'Mobile App Development',
  'AI/ML Integration',
  'Technical Consulting',
  'Code Review & Mentoring',
  'Other',
]

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', reason: '', message: '' })
  const [contactInfo, setContactInfo] = useState(() => buildContactInfo())
  const [successMessage, setSuccessMessage] = useState("Message sent successfully! I'll get back to you soon.")

  // Load admin-configured contact details (falls back to defaults on failure).
  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.success && d.data) {
        setContactInfo(buildContactInfo(d.data))
        if (d.data.contact_success_message) setSuccessMessage(d.data.contact_success_message)
      }
    }).catch(() => {})
  }, [])

  // Pre-fill from query params after hydration (avoids a hydration mismatch).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setForm(f => ({
      ...f,
      subject: params.get('subject') || f.subject,
      reason: params.get('reason') || f.reason,
      message: params.get('message') || f.message,
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setFormState('success')
        setForm({ name: '', email: '', subject: '', reason: '', message: '' })
        setTimeout(() => setFormState('idle'), 4000)
      } else {
        setFormState('error')
        setTimeout(() => setFormState('idle'), 3000)
      }
    } catch {
      setFormState('error')
      setTimeout(() => setFormState('idle'), 3000)
    }
  }

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide">
        <MetadataInjector title="Contact" description="Get in touch with Hamed Hussein for web development, AI/ML, consulting, or collaboration opportunities." url="/contact" />
        <Breadcrumbs items={[{ label: 'Contact' }]} />
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">📬 Get in Touch</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let&apos;s Start a <span className="gradient-text">Conversation</span></h1>
          <p className="text-text-secondary">Have a project in mind? Need technical consultation? Or just want to connect? I&apos;d love to hear from you.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-border-primary">
                <h2 className="text-lg font-semibold">Send a Message</h2>
                <p className="text-sm text-text-muted">I typically respond within 24 hours</p>
              </div>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Name *</label>
                      <Input placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Email *</label>
                      <Input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subject *</label>
                    <Input placeholder="What is this about?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Reason for Contact</label>
                    <select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} className="w-full rounded-lg border border-border-primary bg-surface-tertiary px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
                      <option value="">Select a reason...</option>
                      {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message *</label>
                    <Textarea placeholder="Tell me about your project, timeline, budget, and any specific requirements..." rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                  </div>
                  <Button type="submit" disabled={formState === 'submitting'} className="w-full gradient-bg text-white py-6 text-base">
                    {formState === 'submitting' ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</> : formState === 'success' ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Message Sent!</> : <><Send className="h-4 w-4 mr-2" /> Send Message</>}
                  </Button>
                  {formState === 'success' && <p className="text-green-400 text-sm text-center">{successMessage}</p>}
                  {formState === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                {contactInfo.map(c => (
                  <a key={c.label} href={c.href} className="flex items-center gap-3 p-3 rounded-xl bg-surface-card hover:bg-surface-tertiary transition-colors group">
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', c.bg)}><c.icon className={cn('h-5 w-5', c.color)} /></div>
                    <div>
                      <div className="text-xs text-text-muted">{c.label}</div>
                      <div className="text-sm font-medium group-hover:text-brand-primary transition-colors">{c.value}</div>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-green-500" /> Availability</h3>
                <div className="space-y-2">
                  {availability.map(a => (
                    <div key={a.day} className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{a.day}</span>
                      <span className={cn('font-medium', a.time === 'Closed' ? 'text-red-400' : 'text-green-400')}>{a.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-green-400 font-medium">🟢 Currently available for new projects</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </main>
  )
}
