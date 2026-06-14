'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EditLessonPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.id as string
  const lessonId = params?.lessonId as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', type: 'text', content: '', order: 0, duration: '' })

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  useEffect(() => {
    fetch(`/api/courses/${courseId}/lessons/${lessonId}`).then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const l = d.data
        setForm({ title: l.title || '', type: l.type || 'text', content: l.content || '', order: l.order || 0, duration: String(l.duration || '') })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [courseId, lessonId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, duration: Number(form.duration) || 0 }),
      })
      const data = await res.json()
      if (data.success) router.push(`/admin/courses/${courseId}/edit`)
      else setError(data.error || 'Failed to update')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div className="max-w-2xl">
      <Link href={`/admin/courses/${courseId}/edit`} className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Course</Link>
      <h1 className="text-3xl font-bold mb-6">Edit Lesson</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Lesson Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><Input required value={form.title} onChange={e => update('title', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Type</label><select value={form.type} onChange={e => update('type', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="text">Text</option><option value="video">Video</option><option value="quiz">Quiz</option><option value="mixed">Mixed</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Duration (minutes)</label><Input type="number" min="0" value={form.duration} onChange={e => update('duration', e.target.value)} /></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Order</label><Input type="number" value={form.order} onChange={e => update('order', Number(e.target.value))} /></div>
            <div><label className="text-sm font-medium mb-1 block">Content (Markdown)</label><Textarea rows={10} value={form.content} onChange={e => update('content', e.target.value)} /></div>
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
