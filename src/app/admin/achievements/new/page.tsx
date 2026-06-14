'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewAchievementPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    type: 'milestone' as string,
    link: '',
    order: 0,
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push('/admin/achievements')
    else setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="ghost" size="icon"><Link href="/admin/achievements"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <h1 className="text-3xl font-bold">New Achievement</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Title</label>
          <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none" placeholder="e.g. AWS Certified Cloud Practitioner" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
          <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Year</label>
            <input type="text" required value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none" placeholder="2024" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none">
              {['award', 'certification', 'milestone', 'project', 'publication'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Link (optional)</label>
          <input type="url" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-blue-500" />
          <label htmlFor="featured" className="text-sm text-text-secondary">Featured achievement</label>
        </div>
        <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Create Achievement'}
        </Button>
      </form>
    </div>
  )
}
