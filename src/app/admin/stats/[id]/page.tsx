'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const iconOptions = ['FolderOpen', 'Star', 'BookOpen', 'Calendar', 'ThumbsUp', 'Users', 'Code', 'Rocket', 'Award', 'Globe']

export default function EditStatPage() {
  const router = useRouter()
  const params = useParams()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ label: '', value: 0, suffix: '', icon: 'FolderOpen', order: 0 })

  useEffect(() => {
    fetch(`/api/stats/${params.id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setForm(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/stats/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) router.push('/admin/stats')
    else setSaving(false)
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-surface-card border border-border-primary text-text-primary focus:border-blue-500 focus:outline-none'

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="ghost" size="icon"><Link href="/admin/stats"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <h1 className="text-3xl font-bold text-text-primary">Edit Stat</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Label</label>
          <input type="text" required value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Value</label>
          <input type="number" required value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Suffix</label>
          <input type="text" value={form.suffix} onChange={e => setForm({ ...form, suffix: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Icon</label>
          <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className={inputClass}>
            {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} />
        </div>
        <Button type="submit" disabled={saving} className="gradient-bg text-white"><Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  )
}
