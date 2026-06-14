'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

const colorPresets = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'White', value: '#ffffff' },
]

export default function EditSkillPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 80,
    color: '#3B82F6',
    order: 0,
    featured: false,
  })

  useEffect(() => {
    fetch(`/api/skills/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const s = d.data
          setForm({ name: s.name, category: s.category, proficiency: s.proficiency, color: s.color, order: s.order, featured: s.featured })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/skills/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push('/admin/skills')
    else setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this skill?')) return
    await fetch(`/api/skills/${params.id}`, { method: 'DELETE' })
    router.push('/admin/skills')
  }

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon"><Link href="/admin/skills"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-3xl font-bold">Edit Skill</h1>
        </div>
        <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Name</label>
          <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none">
            {['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI/ML', 'Tools'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Proficiency ({form.proficiency}%)</label>
          <input type="range" min={0} max={100} value={form.proficiency} onChange={e => setForm({ ...form, proficiency: Number(e.target.value) })} className="w-full accent-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Color</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {colorPresets.map(p => (
              <button key={p.value} type="button" onClick={() => setForm({ ...form, color: p.value })} className={`h-8 w-8 rounded-full border-2 transition-all ${form.color === p.value ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: p.value }} title={p.name} />
            ))}
          </div>
          <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="h-10 w-20 rounded-lg bg-dark-700 border border-dark-500 cursor-pointer" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Order</label>
          <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-lg bg-dark-700 border border-dark-500 text-text-primary focus:border-blue-500 focus:outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-blue-500" />
          <label htmlFor="featured" className="text-sm text-text-secondary">Featured skill</label>
        </div>
        <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />{saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
