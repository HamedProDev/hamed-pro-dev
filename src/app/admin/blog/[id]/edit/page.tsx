'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: '', tags: '', coverImage: '',
  })

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  useEffect(() => {
    fetch(`/api/blog/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const p = d.data
        setForm({
          title: p.title || '',
          excerpt: p.excerpt || '',
          content: p.content || '',
          category: p.category || '',
          tags: (p.tags || []).join(', '),
          coverImage: p.coverImage || '',
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          excerpt: form.excerpt,
          content: form.content,
          category: form.category,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
          coverImage: form.coverImage,
        }),
      })
      if (res.ok) router.push('/admin/blog')
      else setSaving(false)
    } catch { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-3xl">
      <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Blog</Link>
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Post Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><Input required value={form.title} onChange={e => update('title', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Cover Image</label><ImageUpload value={form.coverImage} onChange={v => update('coverImage', v)} folder="hamedpro/blog" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Category</label><Input value={form.category} onChange={e => update('category', e.target.value)} /></div>
              <div><label className="text-sm font-medium mb-1 block">Tags (comma separated)</label><Input value={form.tags} onChange={e => update('tags', e.target.value)} /></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Excerpt</label><Input value={form.excerpt} onChange={e => update('excerpt', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Content (Markdown) *</label><Textarea rows={12} required value={form.content} onChange={e => update('content', e.target.value)} /></div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
