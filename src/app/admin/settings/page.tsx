'use client'
import { useState, useEffect } from 'react'
import { Save, Loader2, Plus, X, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'

const socialPlatforms = [
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@username' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
  { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/invite' },
  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/250788123456' },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
]

export default function AdminSettingsPage() {
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

  const update = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }))
  }

  const updateSocial = (key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      socialLinks: { ...(prev.socialLinks || {}), [key]: value },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-text-muted text-sm mt-1">Manage your site configuration, social links, and profile.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </div>

      {/* Profile & Hero */}
      <Card>
        <CardHeader><CardTitle>Profile & Hero</CardTitle><CardDescription>Your profile photo and hero section text</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Profile Photo</label>
            <ImageUpload value={settings.profilePhoto || ''} onChange={v => update('profilePhoto', v)} folder="hamedpro/profile" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Hero Name</label><Input value={settings.heroName || ''} onChange={e => update('heroName', e.target.value)} placeholder="Hamed Hussein" /></div>
            <div><label className="text-sm font-medium mb-1 block">Hero Title</label><Input value={settings.heroTitle || ''} onChange={e => update('heroTitle', e.target.value)} placeholder="Full Stack Developer & AI Engineer" /></div>
          </div>
          <div><label className="text-sm font-medium mb-1 block">Hero Subtitle</label><Input value={settings.heroSubtitle || ''} onChange={e => update('heroSubtitle', e.target.value)} placeholder="Building scalable solutions..." /></div>
          <div><label className="text-sm font-medium mb-1 block">Bio / Description</label><Textarea rows={4} value={settings.description || ''} onChange={e => update('description', e.target.value)} placeholder="Tell your story..." /></div>
        </CardContent>
      </Card>

      {/* Site Info */}
      <Card>
        <CardHeader><CardTitle>Site Information</CardTitle><CardDescription>Basic site configuration</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Site Name</label><Input value={settings.siteName || ''} onChange={e => update('siteName', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Tagline</label><Input value={settings.tagline || ''} onChange={e => update('tagline', e.target.value)} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium mb-1 block">Location</label><Input value={settings.location || ''} onChange={e => update('location', e.target.value)} placeholder="Kigali, Rwanda" /></div>
            <div><label className="text-sm font-medium mb-1 block">Contact Email</label><Input type="email" value={settings.contactEmail || ''} onChange={e => update('contactEmail', e.target.value)} /></div>
          </div>
          <div><label className="text-sm font-medium mb-1 block">Contact Phone</label><Input value={settings.contactPhone || ''} onChange={e => update('contactPhone', e.target.value)} placeholder="+250 788 123 456" /></div>
          <div><label className="text-sm font-medium mb-1 block">Address</label><Input value={settings.address || ''} onChange={e => update('address', e.target.value)} placeholder="Kwanda Facility, Kigali" /></div>
          <div>
            <label className="text-sm font-medium mb-1 block">Site Logo</label>
            <ImageUpload value={settings.logo || ''} onChange={v => update('logo', v)} folder="hamedpro/logo" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">OG Image (Social Share)</label>
            <ImageUpload value={settings.ogImage || ''} onChange={v => update('ogImage', v)} folder="hamedpro/og" />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader><CardTitle>Social Links</CardTitle><CardDescription>Add your social media profiles. These appear in the hero, footer, and about page.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          {socialPlatforms.map(p => (
            <div key={p.key} className="flex items-center gap-3">
              <span className="text-sm font-medium w-24 capitalize">{p.label}</span>
              <Input
                value={settings.socialLinks?.[p.key] || ''}
                onChange={e => updateSocial(p.key, e.target.value)}
                placeholder={p.placeholder}
                className="flex-1"
              />
              {settings.socialLinks?.[p.key] && (
                <a href={settings.socialLinks[p.key]} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors">
                  <ExternalLink className="h-4 w-4 text-text-muted" />
                </a>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader><CardTitle>Integrations</CardTitle><CardDescription>Third-party service configuration</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1 block">WhatsApp Number</label><Input value={settings.integrations?.whatsappNumber || ''} onChange={e => update('integrations', { ...settings.integrations, whatsappNumber: e.target.value })} placeholder="+250788123456" /></div>
          <div><label className="text-sm font-medium mb-1 block">Discord Invite URL</label><Input value={settings.integrations?.discordInvite || ''} onChange={e => update('integrations', { ...settings.integrations, discordInvite: e.target.value })} placeholder="https://discord.gg/invite" /></div>
          <div><label className="text-sm font-medium mb-1 block">Cal.com URL</label><Input value={settings.integrations?.calComUrl || ''} onChange={e => update('integrations', { ...settings.integrations, calComUrl: e.target.value })} placeholder="https://cal.com/username" /></div>
        </CardContent>
      </Card>

      {/* Toggles */}
      <Card>
        <CardHeader><CardTitle>Site Options</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={settings.maintenanceMode || false} onChange={e => update('maintenanceMode', e.target.checked)} className="rounded" />
            <span className="text-sm text-text-secondary">Maintenance Mode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={settings.allowRegistration !== false} onChange={e => update('allowRegistration', e.target.checked)} className="rounded" />
            <span className="text-sm text-text-secondary">Allow Registration</span>
          </label>
        </CardContent>
      </Card>
    </div>
  )
}
