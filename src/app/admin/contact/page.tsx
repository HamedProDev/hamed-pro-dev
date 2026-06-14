'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Loader2, Mail, MessageSquare, Phone, MapPin } from 'lucide-react'

export default function AdminContactPage() {
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.success) setSettings(d.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const update = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    } catch {}
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Settings</h1>
          <p className="text-text-muted text-sm mt-1">Configure contact information shown on the site.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Contact Information</CardTitle><CardDescription>Displayed on the contact page and footer</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1 block flex items-center gap-1"><Mail className="h-3 w-3" /> Contact Email</label><Input type="email" value={settings.contactEmail || ''} onChange={e => update('contactEmail', e.target.value)} placeholder="hello@hamedpro.rw" /></div>
          <div><label className="text-sm font-medium mb-1 block flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</label><Input value={settings.contactPhone || ''} onChange={e => update('contactPhone', e.target.value)} placeholder="+250 788 123 456" /></div>
          <div><label className="text-sm font-medium mb-1 block flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</label><Input value={settings.address || ''} onChange={e => update('address', e.target.value)} placeholder="Gasabo, Kigali, Rwanda" /></div>
          <div><label className="text-sm font-medium mb-1 block flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Contact Form Success Message</label><Textarea rows={2} value={settings.contactSuccessMessage || ''} onChange={e => update('contactSuccessMessage', e.target.value)} placeholder="Thank you for your message!" /></div>
        </CardContent>
      </Card>
    </div>
  )
}
