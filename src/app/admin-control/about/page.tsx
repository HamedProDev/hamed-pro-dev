'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import { Save, Loader2 } from 'lucide-react'

export default function AdminAboutPage() {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    fullName: 'Hamed Hussein',
    tagline: 'Fullstack & AI/ML Engineer',
    bio: '',
    avatar: '',
  })

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.success && d.data) {
        setForm({
          fullName: d.data.hero_name || 'Hamed Hussein',
          tagline: d.data.hero_title || 'Fullstack & AI/ML Engineer',
          bio: d.data.description || '',
          avatar: d.data.profile_photo || '',
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hero_name: form.fullName,
          hero_title: form.tagline,
          description: form.bio,
          profile_photo: form.avatar,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
        const msg: string = data.message || ''
        if (msg && msg !== 'Settings updated') setError(msg)
      } else {
        setError(data.error || `Failed to save About page (HTTP ${res.status})`)
      }
    } catch {
      setError('Network error — failed to save changes. Check your connection and try again.')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit About Page</h1>
          <p className="text-text-muted text-sm mt-1">Manage your about page content.</p>
        </div>
        <Button onClick={handleSave} disabled={saving || loading} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}{saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
          ❌ {error}
        </div>
      )}
      <Card>
        <CardHeader><CardTitle>Personal Info</CardTitle><CardDescription>Your name and tagline</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1 block">Full Name</label><Input value={form.fullName} onChange={e => update('fullName', e.target.value)} /></div>
          <div><label className="text-sm font-medium mb-1 block">Tagline</label><Input value={form.tagline} onChange={e => update('tagline', e.target.value)} /></div>
          <div><label className="text-sm font-medium mb-1 block">Bio (Markdown)</label><Textarea rows={8} value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Write your story in Markdown... include your handle @hamedprodev." /></div>
          <div><label className="text-sm font-medium mb-1 block">Avatar</label><ImageUpload value={form.avatar} onChange={v => update('avatar', v)} folder="hamedpro/about" /></div>
        </CardContent>
      </Card>
    </div>
  )
}
