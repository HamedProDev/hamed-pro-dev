'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTestimonialPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', company: '', content: '', rating: 5, order: 0, featured: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) router.push('/admin/testimonials')
    else setSaving(false)
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg bg-surface-card border border-border-primary text-text-primary focus:border-blue-500 focus:outline-none'

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="ghost" size="icon"><Link href="/admin/testimonials"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <h1 className="text-3xl font-bold text-text-primary">New Testimonial</h1>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
          <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g. Jean Claude" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Role</label>
          <input type="text" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputClass} placeholder="e.g. CTO" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Company</label>
          <input type="text" required value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className={inputClass} placeholder="e.g. AgriTech Rwanda" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Content</label>
          <textarea required rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className={inputClass} placeholder="What they said about you..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Rating ({form.rating}/5)</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className={`h-8 w-8 rounded-lg border text-sm font-medium transition-all ${n <= form.rating ? 'bg-amber-400 text-white border-amber-400' : 'bg-surface-card border-border-primary text-text-muted hover:border-amber-400'}`}>{n}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className={inputClass} />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-blue-500" />
          <label htmlFor="featured" className="text-sm text-text-secondary">Featured</label>
        </div>
        <Button type="submit" disabled={saving} className="gradient-bg text-white"><Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Create Testimonial'}</Button>
      </form>
    </div>
  )
}
