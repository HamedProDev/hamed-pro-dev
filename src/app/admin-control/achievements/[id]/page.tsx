'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ImageUpload } from '@/components/ui/image-upload'

export default function EditAchievementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    year: '',
    type: 'milestone',
    link: '',
    issuer: '',
    image: '',
    order: 0,
    featured: false,
  })

  useEffect(() => {
    fetch(`/api/achievements/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const a = d.data
          setForm({ title: a.title, description: a.description, year: String(a.date || '').slice(0, 4), type: a.category || 'milestone', link: a.certificate_url || '', issuer: a.issuer || '', image: a.image_url || '', order: a.order_index || 0, featured: a.is_published || false })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/achievements/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: form.year ? `${form.year}-01-01` : null,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) router.push('/admin-control/achievements')
      else { setError(data.error || 'Failed to update achievement'); setSaving(false) }
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this achievement?')) return
    await fetch(`/api/achievements/${params.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _method: 'DELETE' }) })
    router.push('/admin-control/achievements')
  }

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>

  const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-surface-card border border-border-primary text-text-primary focus:border-violet-500 focus:outline-none'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon"><Link href="/admin-control/achievements"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-3xl font-bold text-text-primary">Edit Achievement</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label htmlFor="ach-title" className="block text-sm font-medium text-text-secondary mb-1.5">Title</label>
          <input id="ach-title" name="title" type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label htmlFor="ach-description" className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
          <textarea id="ach-description" name="description" required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="ach-year" className="block text-sm font-medium text-text-secondary mb-1.5">Year</label>
            <input id="ach-year" name="year" type="text" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label htmlFor="ach-type" className="block text-sm font-medium text-text-secondary mb-1.5">Type</label>
            <select id="ach-type" name="type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass}>
              {['award', 'certification', 'milestone', 'project', 'publication'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="ach-link" className="block text-sm font-medium text-text-secondary mb-1.5">Link (optional)</label>
          <input id="ach-link" name="link" type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label htmlFor="ach-issuer" className="block text-sm font-medium text-text-secondary mb-1.5">Issuer (optional)</label>
          <input id="ach-issuer" name="issuer" type="text" value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} className={inputClass} placeholder="e.g. Amazon Web Services" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Certificate image (optional)</label>
          <ImageUpload value={form.image} onChange={url => setForm({ ...form, image: url })} folder="hamedpro/certificates" />
        </div>
        <div>
          <label htmlFor="ach-order" className="block text-sm font-medium text-text-secondary mb-1.5">Order</label>
          <input id="ach-order" name="order" type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-violet-500" />
          <label htmlFor="featured" className="text-sm text-text-secondary">Published (visible on the Achievements page)</label>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          <Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
