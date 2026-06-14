'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'

export default function NewProjectPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', longDescription: '', coverImage: '', category: 'large', subCategory: 'other',
    techStack: '', demoUrl: '', sourceUrl: '', status: 'in-progress', featured: false, isPublished: true,
  })

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
          isPublished: form.isPublished,
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/admin/projects')
      else setError(data.error || 'Failed to create project')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/projects" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Projects</Link>
      <h1 className="text-3xl font-bold mb-6">Create Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><Input required value={form.title} onChange={e => update('title', e.target.value)} placeholder="My Awesome Project" /></div>
            <div><label className="text-sm font-medium mb-1 block">Short Description *</label><Input required maxLength={160} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Brief description (max 160 chars)" /></div>
            <div><label className="text-sm font-medium mb-1 block">Long Description</label><Textarea rows={5} value={form.longDescription} onChange={e => update('longDescription', e.target.value)} placeholder="Detailed description..." /></div>
            <div><label className="text-sm font-medium mb-1 block">Cover Image</label><ImageUpload value={form.coverImage} onChange={v => update('coverImage', v)} folder="hamedpro/projects" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Category</label><select value={form.category} onChange={e => update('category', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="large">Large Project</option><option value="mini">Mini Project</option><option value="school">School Project</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Sub Category</label><select value={form.subCategory} onChange={e => update('subCategory', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="other">Other</option><option value="finance">Finance</option><option value="education">Education</option><option value="healthcare">Healthcare</option><option value="ecommerce">E-commerce</option><option value="agriculture">Agriculture</option><option value="ai-ml">AI/ML</option></select></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Tech Stack (comma separated)</label><Input value={form.techStack} onChange={e => update('techStack', e.target.value)} placeholder="React, Node.js, MongoDB" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Demo URL</label><Input value={form.demoUrl} onChange={e => update('demoUrl', e.target.value)} placeholder="https://..." /></div>
              <div><label className="text-sm font-medium mb-1 block">Source URL</label><Input value={form.sourceUrl} onChange={e => update('sourceUrl', e.target.value)} placeholder="https://github.com/..." /></div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="rounded" /><span className="text-sm text-text-secondary">Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={e => update('isPublished', e.target.checked)} className="rounded" /><span className="text-sm text-text-secondary">Published</span></label>
            </div>
          </CardContent>
        </Card>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {saving ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </div>
  )
}
