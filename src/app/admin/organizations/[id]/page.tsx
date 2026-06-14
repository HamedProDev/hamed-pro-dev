'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'

export default function EditOrganizationPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', type: 'Startup', description: '', location: '', team: '', roles: '0',
    tech: '', hiring: false, website: '', logo: '', order: 0,
  })

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  useEffect(() => {
    fetch(`/api/organizations/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const o = d.data
        setForm({
          name: o.name || '', type: o.type || 'Startup', description: o.description || '',
          location: o.location || '', team: o.team || '', roles: String(o.roles || 0),
          tech: (o.tech || []).join(', '), hiring: o.hiring || false, website: o.website || '',
          logo: o.logo || '', order: o.order || 0,
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/organizations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          roles: Number(form.roles) || 0,
          tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/admin/organizations')
      else setError(data.error || 'Failed to update')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div className="max-w-2xl">
      <Link href="/admin/organizations" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Organizations</Link>
      <h1 className="text-3xl font-bold mb-6">Edit Organization</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Organization Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Name *</label><Input required value={form.name} onChange={e => update('name', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Type</label><select value={form.type} onChange={e => update('type', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option>Startup</option><option>Agency</option><option>Company</option><option>Open Source</option></select></div>
            <div><label className="text-sm font-medium mb-1 block">Description *</label><Textarea rows={3} required value={form.description} onChange={e => update('description', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Location</label><Input value={form.location} onChange={e => update('location', e.target.value)} /></div>
              <div><label className="text-sm font-medium mb-1 block">Team Size</label><Input value={form.team} onChange={e => update('team', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Open Roles</label><Input type="number" min="0" value={form.roles} onChange={e => update('roles', e.target.value)} /></div>
              <div><label className="text-sm font-medium mb-1 block">Order</label><Input type="number" value={form.order} onChange={e => update('order', Number(e.target.value))} /></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Tech Stack (comma separated)</label><Input value={form.tech} onChange={e => update('tech', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Website</label><Input value={form.website} onChange={e => update('website', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Logo</label><ImageUpload value={form.logo} onChange={v => update('logo', v)} folder="hamedpro/orgs" /></div>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.hiring} onChange={e => update('hiring', e.target.checked)} className="accent-blue-500" /><span className="text-sm text-text-secondary">Currently hiring</span></label>
          </CardContent>
        </Card>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
