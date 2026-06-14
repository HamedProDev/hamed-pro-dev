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

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', longDescription: '', coverImage: '', liveUrl: '', githubUrl: '',
    category: 'large', subCategory: 'other', tags: '', featured: false,
  })

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  useEffect(() => {
    fetch(`/api/projects/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const p = d.data
        setForm({
          title: p.title || '', description: p.description || '', longDescription: p.longDescription || '',
          coverImage: p.coverImage || '', liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '',
          category: p.category || 'large', subCategory: p.subCategory || 'other',
          tags: (p.tags || []).join(', '), featured: p.featured || false,
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
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/admin/projects')
      else setError(data.error || 'Failed to update')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div className="max-w-2xl">
      <Link href="/admin/projects" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Projects</Link>
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><Input required value={form.title} onChange={e => update('title', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Description *</label><Textarea rows={3} required value={form.description} onChange={e => update('description', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Long Description</label><Textarea rows={5} value={form.longDescription} onChange={e => update('longDescription', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Cover Image</label><ImageUpload value={form.coverImage} onChange={v => update('coverImage', v)} folder="hamedpro/projects" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Live URL</label><Input value={form.liveUrl} onChange={e => update('liveUrl', e.target.value)} placeholder="https://..." /></div>
              <div><label className="text-sm font-medium mb-1 block">GitHub URL</label><Input value={form.githubUrl} onChange={e => update('githubUrl', e.target.value)} placeholder="https://github.com/..." /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Category</label><select value={form.category} onChange={e => update('category', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="large">Large Project</option><option value="mini">Mini Project</option><option value="school">School Project</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Sub Category</label><select value={form.subCategory} onChange={e => update('subCategory', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="other">Other</option><option value="finance">Finance</option><option value="education">Education</option><option value="healthcare">Healthcare</option><option value="ecommerce">E-commerce</option><option value="agriculture">Agriculture</option><option value="ai-ml">AI/ML</option></select></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Tags (comma separated)</label><Input value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="React, TypeScript, Next.js" /></div>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="accent-blue-500" /><span className="text-sm text-text-secondary">Featured project</span></label>
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
