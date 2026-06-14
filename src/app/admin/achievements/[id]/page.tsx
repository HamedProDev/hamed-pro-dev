'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function EditAchievementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    year: '',
    type: 'milestone',
    link: '',
    order: 0,
    featured: false,
  })

  useEffect(() => {
    fetch(`/api/achievements/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const a = d.data
          setForm({ title: a.title, description: a.description, year: a.year, type: a.type, link: a.link || '', order: a.order, featured: a.featured })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/achievements/${params.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push('/admin/achievements')
    else setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this achievement?')) return
    await fetch(`/api/achievements/${params.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _method: 'DELETE' }) })
    router.push('/admin/achievements')
  }

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>

  const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-surface-card border border-border-primary text-text-primary focus:border-blue-500 focus:outline-none'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon"><Link href="/admin/achievements"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-3xl font-bold text-text-primary">Edit Achievement</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Title</label>
          <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
          <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Year</label>
            <input type="text" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass}>
              {['award', 'certification', 'milestone', 'project', 'publication'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Link (optional)</label>
          <input type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-blue-500" />
          <label htmlFor="featured" className="text-sm text-text-secondary">Featured achievement</label>
        </div>
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          <Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
