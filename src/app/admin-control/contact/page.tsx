'use client'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Loader2, Mail, MessageSquare, Phone, MapPin, Inbox, MailOpen, Trash2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

const tabs = ['Messages', 'Contact Info'] as const

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Messages')

  // Contact info (settings)
  const [settings, setSettings] = useState<any>({})
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Messages
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const fetchSettings = useCallback(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.success) setSettings(d.data)
      setLoadingSettings(false)
    }).catch(() => setLoadingSettings(false))
  }, [])

  const fetchMessages = useCallback(() => {
    setLoadingMessages(true)
    fetch('/api/contact').then(r => r.json()).then(d => {
      if (d.success) setMessages(d.data || [])
      setLoadingMessages(false)
    }).catch(() => setLoadingMessages(false))
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])
  useEffect(() => { fetchMessages() }, [fetchMessages])

  const update = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    } catch {}
    setSaving(false)
  }

  const messageAction = async (id: string, action: 'read' | 'unread' | 'delete') => {
    if (action === 'delete' && !confirm('Delete this message?')) return
    setBusyId(id)
    await fetch(`/api/contact/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setBusyId(null)
    fetchMessages()
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact</h1>
          <p className="text-text-muted text-sm mt-1">Read messages from visitors and configure contact information.</p>
        </div>
        {activeTab === 'Messages' && (
          <button onClick={fetchMessages} className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary" aria-label="Refresh messages">
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-primary">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={cn(
              'px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors',
              activeTab === t ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-secondary'
            )}
          >
            {t === 'Messages' ? (
              <span className="inline-flex items-center gap-1.5">
                <Inbox className="h-3.5 w-3.5" /> {t}
                {unreadCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary text-white">{unreadCount}</span>}
              </span>
            ) : t}
          </button>
        ))}
      </div>

      {activeTab === 'Messages' ? (
        loadingMessages ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="h-10 w-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">No messages yet. When visitors use the contact form, their messages appear here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {messages.map(m => (
              <Card key={m.id} className={cn('transition-colors', !m.is_read && 'border-brand-primary/40')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-text-primary">{m.name}</span>
                        <a href={`mailto:${m.email}`} className="text-sm text-brand-primary hover:underline">{m.email}</a>
                        {!m.is_read && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary text-white">New</span>}
                      </div>
                      {m.subject && <p className="text-sm font-medium text-text-secondary mt-0.5">{m.subject}</p>}
                      <p className="text-xs text-text-muted mt-1">{new Date(m.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {m.is_read ? (
                        <button onClick={() => messageAction(m.id, 'unread')} disabled={busyId === m.id} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary" title="Mark unread" aria-label="Mark unread"><MailOpen className="h-4 w-4" /></button>
                      ) : (
                        <button onClick={() => messageAction(m.id, 'read')} disabled={busyId === m.id} className="p-1.5 rounded-lg hover:bg-brand-primary/10 text-text-muted hover:text-brand-primary" title="Mark read" aria-label="Mark read"><Mail className="h-4 w-4" /></button>
                      )}
                      <button onClick={() => messageAction(m.id, 'delete')} disabled={busyId === m.id} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400" title="Delete" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mt-3 whitespace-pre-wrap bg-surface-secondary/50 rounded-lg p-3">{m.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">Contact information shown on the site.</p>
            <Button onClick={handleSave} disabled={saving || loadingSettings} className="gradient-bg text-white">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saved ? 'Saved!' : 'Save Settings'}
            </Button>
          </div>
          {loadingSettings ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
          ) : (
            <Card>
              <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Displayed on the contact page and footer</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div><label htmlFor="contact-email" className="text-sm font-medium mb-1 block flex items-center gap-1"><Mail className="h-3 w-3" /> Contact Email</label><Input id="contact-email" name="contact_email" type="email" value={settings.contact_email || ''} onChange={e => update('contact_email', e.target.value)} placeholder="hello@hamedpro.rw" /></div>
                <div><label htmlFor="contact-phone" className="text-sm font-medium mb-1 block flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</label><Input id="contact-phone" name="contact_phone" value={settings.contact_phone || ''} onChange={e => update('contact_phone', e.target.value)} placeholder="+250 788 123 456" /></div>
                <div><label htmlFor="contact-address" className="text-sm font-medium mb-1 block flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</label><Input id="contact-address" name="address" value={settings.address || ''} onChange={e => update('address', e.target.value)} placeholder="Gasabo, Kigali, Rwanda" /></div>
                <div><label htmlFor="contact-successMessage" className="text-sm font-medium mb-1 block flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Contact Form Success Message</label><Textarea id="contact-successMessage" name="contact_success_message" rows={2} value={settings.contact_success_message || ''} onChange={e => update('contact_success_message', e.target.value)} placeholder="Thank you for your message!" /></div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
