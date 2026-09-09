'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Star, BookOpen, CheckSquare, Square, Eye, EyeOff, AlertTriangle } from 'lucide-react'

interface Course {
  id: string; title: string; category: string; level: string; enrolled: number; rating: number; type: string; price: number; is_published: boolean; lessons_count?: number
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkBusy, setBulkBusy] = useState(false)

  const fetchData = useCallback(() => {
    fetch('/api/courses?all=true').then(r => r.json()).then(d => {
      if (d.success) setCourses(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return
    await fetch(`/api/courses/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _method: 'DELETE' }) })
    fetchData()
  }

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const toggleAll = () => {
    if (selected.size === courses.length) setSelected(new Set())
    else setSelected(new Set(courses.map(c => c.id)))
  }

  const bulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    const ids = Array.from(selected)
    if (ids.length === 0) return
    if (action === 'delete' && !confirm(`Delete ${ids.length} course(s)?`)) return
    setBulkBusy(true)
    await fetch('/api/admin/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'courses', ids, action }),
    })
    setBulkBusy(false)
    setSelected(new Set())
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Courses</h1>
        <Button asChild className="gradient-bg text-white"><Link href="/admin-control/courses/new"><Plus className="h-4 w-4 mr-2" /> New Course</Link></Button>
      </div>

      {selected.size > 0 && (
        <div className="admin-card p-3 mb-4 flex items-center gap-2">
          <span className="text-sm text-text-secondary mr-2">{selected.size} selected</span>
          <button onClick={() => bulkAction('publish')} disabled={bulkBusy} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-sm hover:bg-green-500/20"><Eye className="h-3.5 w-3.5" /> Publish</button>
          <button onClick={() => bulkAction('unpublish')} disabled={bulkBusy} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-sm hover:bg-amber-500/20"><EyeOff className="h-3.5 w-3.5" /> Unpublish</button>
          <button onClick={() => bulkAction('delete')} disabled={bulkBusy} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm hover:bg-red-500/20"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-primary">
              <th className="px-4 py-3 text-left text-text-muted w-10">
                <button onClick={toggleAll} aria-label="Select all" className="text-text-muted hover:text-text-primary">
                  {selected.size === courses.length && courses.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-text-muted">Title</th>
              <th className="px-4 py-3 text-left text-text-muted">Category</th>
              <th className="px-4 py-3 text-left text-text-muted">Lessons</th>
              <th className="px-4 py-3 text-left text-text-muted">Level</th>
              <th className="px-4 py-3 text-left text-text-muted">Enrolled</th>
              <th className="px-4 py-3 text-left text-text-muted">Rating</th>
              <th className="px-4 py-3 text-left text-text-muted">Status</th>
              <th className="px-4 py-3 text-left text-text-muted">Actions</th>
            </tr></thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(c.id)} aria-label={`Select ${c.title}`} className="text-text-muted hover:text-text-primary">
                      {selected.has(c.id) ? <CheckSquare className="h-4 w-4 text-brand-primary" /> : <Square className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary">{c.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{c.category}</td>
                  <td className="px-4 py-3">
                    {typeof c.lessons_count === 'number' && c.lessons_count === 0 ? (
                      <Link href={`/admin-control/courses/${c.id}/lessons`} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" title="This course has no lessons yet — click to add some">
                        <AlertTriangle className="h-3 w-3" /> No lessons
                      </Link>
                    ) : (
                      <span className="text-text-muted">{c.lessons_count ?? '—'}</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500">{c.level}</span></td>
                  <td className="px-4 py-3 text-text-muted">{c.enrolled}</td>
                  <td className="px-4 py-3 text-amber-500 flex items-center gap-1"><Star className="h-3 w-3 fill-current" /> {c.rating}</td>
                  <td className="px-4 py-3">{c.is_published ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">Published</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">Draft</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin-control/courses/${c.id}/lessons`} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary text-xs transition-colors" title="Manage Lessons"><BookOpen className="h-3.5 w-3.5" /> Lessons</Link>
                      <Link href={`/admin-control/courses/${c.id}/edit`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => handleDelete(c.id)} aria-label="Delete" className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && <tr><td colSpan={9} className="px-4 py-8 text-center text-text-muted">No courses yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
