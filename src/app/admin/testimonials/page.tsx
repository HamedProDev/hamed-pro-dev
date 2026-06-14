'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, GripVertical, Star } from 'lucide-react'

interface Testimonial {
  _id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  order: number
  featured: boolean
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(d => { if (d.success) setTestimonials(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Testimonials</h1>
        <Button asChild className="gradient-bg text-white"><Link href="/admin/testimonials/new"><Plus className="h-4 w-4 mr-2" /> New Testimonial</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-xl border border-border-primary bg-surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="px-4 py-3 text-left text-text-muted">Order</th>
                <th className="px-4 py-3 text-left text-text-muted">Name</th>
                <th className="px-4 py-3 text-left text-text-muted">Role</th>
                <th className="px-4 py-3 text-left text-text-muted">Company</th>
                <th className="px-4 py-3 text-left text-text-muted">Rating</th>
                <th className="px-4 py-3 text-left text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t._id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 text-text-muted"><GripVertical className="h-4 w-4" /></td>
                  <td className="px-4 py-3 font-medium text-text-primary">{t.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{t.role}</td>
                  <td className="px-4 py-3 text-text-secondary">{t.company}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/testimonials/${t._id}`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No testimonials yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
