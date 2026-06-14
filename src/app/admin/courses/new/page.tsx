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

export default function NewCoursePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', longDescription: '', coverImage: '', category: 'Frontend',
    level: 'beginner', type: 'free', price: '0', duration: '', tags: '', prerequisites: '', outcomes: '',
  })

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          duration: Number(form.duration) || 0,
          rating: Number((form as any).rating) || 0,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
          prerequisites: form.prerequisites.split(',').map(t => t.trim()).filter(Boolean),
          outcomes: form.outcomes.split(',').map(t => t.trim()).filter(Boolean),
          isPublished: true,
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/admin/courses')
      else setError(data.error || 'Failed to create course')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Courses</Link>
      <h1 className="text-3xl font-bold mb-6">Create Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Course Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><Input required value={form.title} onChange={e => update('title', e.target.value)} placeholder="Course Title" /></div>
            <div><label className="text-sm font-medium mb-1 block">Description *</label><Input required value={form.description} onChange={e => update('description', e.target.value)} placeholder="Short description" /></div>
            <div><label className="text-sm font-medium mb-1 block">Long Description</label><Textarea rows={5} value={form.longDescription} onChange={e => update('longDescription', e.target.value)} placeholder="Detailed course description..." /></div>
            <div><label className="text-sm font-medium mb-1 block">Cover Image</label><ImageUpload value={form.coverImage} onChange={v => update('coverImage', v)} folder="hamedpro/courses" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Category</label><select value={form.category} onChange={e => update('category', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option>Frontend</option><option>Backend</option><option>AI / ML</option><option>Mobile</option><option>DevOps</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Level</label><select value={form.level} onChange={e => update('level', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Type</label><select value={form.type} onChange={e => update('type', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="free">Free</option><option value="premium">Premium</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Price ($)</label><Input type="number" min="0" value={form.price} onChange={e => update('price', e.target.value)} /></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Duration (hours)</label><Input type="number" min="0" value={form.duration} onChange={e => update('duration', e.target.value)} placeholder="e.g. 8" /></div>
            <div><label className="text-sm font-medium mb-1 block">Rating (0-5)</label><Input type="number" min="0" max="5" step="0.1" value={(form as any).rating || ''} onChange={e => update('rating', e.target.value)} placeholder="e.g. 4.5" /></div>
            <div><label className="text-sm font-medium mb-1 block">Tags (comma separated)</label><Input value={form.tags} onChange={e => update('tags', e.target.value)} placeholder="React, JavaScript, Frontend" /></div>
            <div><label className="text-sm font-medium mb-1 block">Prerequisites (comma separated)</label><Input value={form.prerequisites} onChange={e => update('prerequisites', e.target.value)} placeholder="Basic JavaScript" /></div>
            <div><label className="text-sm font-medium mb-1 block">Outcomes (comma separated)</label><Input value={form.outcomes} onChange={e => update('outcomes', e.target.value)} placeholder="Build React apps from scratch" /></div>
          </CardContent>
        </Card>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {saving ? 'Creating...' : 'Create Course'}
        </Button>
      </form>
    </div>
  )
}
