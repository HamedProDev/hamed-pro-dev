'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const iconOptions = ['FolderOpen', 'Star', 'BookOpen', 'Calendar', 'ThumbsUp', 'Users', 'Code', 'Rocket', 'Award', 'Globe']

export default function NewStatPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ label: '', value: 0, suffix: '', icon: 'FolderOpen', order: 0 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) router.push('/admin/stats')
    else setSaving(false)
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-surface-card border border-border-primary text-text-primary focus:border-blue-500 focus:outline-none'

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="ghost" size="icon"><Link href="/admin/stats"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <h1 className="text-3xl font-bold text-text-primary">New Stat</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Label</label>
          <input type="text" required value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className={inputClass} placeholder="e.g. Projects Completed" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Value</label>
          <input type="number" required value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Suffix</label>
          <input type="text" value={form.suffix} onChange={e => setForm({ ...form, suffix: e.target.value })} className={inputClass} placeholder="e.g. +, %" />
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
        <Button type="submit" disabled={saving} className="gradient-bg text-white"><Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Create Stat'}</Button>
      </form>
    </div>
  )
}
