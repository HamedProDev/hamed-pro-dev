'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Loader2 } from 'lucide-react'

export default function AdminSEOPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [seo, setSeo] = useState({ metaTitle: '', metaDescription: '', keywords: '', ogImage: '' })

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.success && d.data?.seo_defaults) {
        const s = d.data.seo_defaults
        setSeo({
          metaTitle: s.metaTitle || '',
          metaDescription: s.metaDescription || '',
          keywords: Array.isArray(s.keywords) ? s.keywords.join(', ') : (s.keywords || ''),
          ogImage: s.ogImage || '',
        })
      }
    }).catch(() => {})
  }, [])

  const update = (key: string, value: string) => setSeo(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seo_defaults: {
            metaTitle: seo.metaTitle,
            metaDescription: seo.metaDescription,
            keywords: seo.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
            ogImage: seo.ogImage,
          },
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Settings</h1>
          <p className="text-text-muted text-sm mt-1">Control how Hamed Hussein appears in search engines.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saved ? 'Saved!' : 'Save SEO Settings'}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Default Meta Tags</CardTitle><CardDescription>Applied across all pages unless overridden</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="seo-title" className="text-sm font-medium mb-1 block">Default Meta Title</label>
            <Input id="seo-title" name="metaTitle" value={seo.metaTitle} onChange={e => update('metaTitle', e.target.value)} placeholder="Hamed Hussein (AKA hamedprodev) — Full Stack Developer & AI/ML Engineer" />
          </div>
          <div>
            <label htmlFor="seo-description" className="text-sm font-medium mb-1 block">Default Meta Description</label>
            <Textarea id="seo-description" name="metaDescription" rows={3} value={seo.metaDescription} onChange={e => update('metaDescription', e.target.value)} placeholder="Full stack developer & AI/ML engineer from Kigali, Rwanda…" />
          </div>
          <div>
            <label htmlFor="seo-keywords" className="text-sm font-medium mb-1 block">Keywords (comma separated)</label>
            <Input id="seo-keywords" name="keywords" value={seo.keywords} onChange={e => update('keywords', e.target.value)} placeholder="Hamed Hussein, hamedprodev, Full Stack Developer, AI/ML Engineer…" />
          </div>
          <div>
            <label htmlFor="seo-ogImage" className="text-sm font-medium mb-1 block">Default OG Image URL</label>
            <Input id="seo-ogImage" name="ogImage" value={seo.ogImage} onChange={e => update('ogImage', e.target.value)} placeholder="/og/default.png" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Branding (fixed)</CardTitle><CardDescription>Core identity — shown across the site</CardDescription></CardHeader>
        <CardContent className="space-y-2 text-sm text-text-secondary">
          <p><span className="font-semibold text-text-primary">Name:</span> Hamed Hussein</p>
          <p><span className="font-semibold text-text-primary">Handle / AKA:</span> hamedprodev</p>
          <p><span className="font-semibold text-text-primary">Title:</span> Full Stack Developer &amp; AI/ML Engineer</p>
          <p className="text-text-muted">Edit these in Settings → Site Identity.</p>
        </CardContent>
      </Card>
    </div>
  )
}
