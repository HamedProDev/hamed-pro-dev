'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ArrowLeft, BookOpen, Youtube, FileText, HelpCircle, CheckSquare, Square, Eye, EyeOff } from 'lucide-react'

interface Lesson {
  id: string; title: string; order_index: number; type: string; is_free: boolean; is_published: boolean; video_url?: string
}

const typeIcons: Record<string, any> = {
  video: Youtube, text: FileText, quiz: HelpCircle, mixed: BookOpen,
}

const typeLabels: Record<string, string> = {
  video: 'Video', text: 'Text', quiz: 'Quiz', mixed: 'Mixed',
}

export default function AdminLessonsPage() {
  const params = useParams()
  const courseId = params?.id as string
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [courseTitle, setCourseTitle] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkBusy, setBulkBusy] = useState(false)

  const fetchData = useCallback(() => {
    Promise.all([
      fetch(`/api/courses/${courseId}`).then(r => r.json()),
      fetch(`/api/courses/${courseId}/lessons`).then(r => r.json()),
    ]).then(([course, lessonsData]) => {
      if (course.success) setCourseTitle(course.data?.title || '')
      if (lessonsData.success) setLessons(lessonsData.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [courseId])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return
    await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _method: 'DELETE' }),
    })
    fetchData()
  }

  const toggle = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const toggleAll = () => {
    if (selected.size === lessons.length) setSelected(new Set())
    else setSelected(new Set(lessons.map(l => l.id)))
  }

  const bulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    const ids = Array.from(selected)
    if (ids.length === 0) return
    if (action === 'delete' && !confirm(`Delete ${ids.length} lesson(s)?`)) return
    setBulkBusy(true)
    await fetch('/api/admin/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'lessons', ids, action }),
    })
    setBulkBusy(false)
    setSelected(new Set())
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin-control/courses" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-2"><ArrowLeft className="h-4 w-4" /> Back to Courses</Link>
          <h1 className="text-3xl font-bold text-text-primary">Lessons: {courseTitle || 'Loading...'}</h1>
        </div>
        <Button asChild className="gradient-bg text-white"><Link href={`/admin-control/courses/${courseId}/lessons/new`}><Plus className="h-4 w-4 mr-2" /> New Lesson</Link></Button>
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
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-primary">
              <th className="px-4 py-3 text-left text-text-muted w-10">
                <button onClick={toggleAll} aria-label="Select all" className="text-text-muted hover:text-text-primary">
                  {selected.size === lessons.length && lessons.length > 0 ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-text-muted w-12">#</th>
              <th className="px-4 py-3 text-left text-text-muted">Title</th>
              <th className="px-4 py-3 text-left text-text-muted">Type</th>
              <th className="px-4 py-3 text-left text-text-muted">Video</th>
              <th className="px-4 py-3 text-left text-text-muted">Free</th>
              <th className="px-4 py-3 text-left text-text-muted">Status</th>
              <th className="px-4 py-3 text-left text-text-muted">Actions</th>
            </tr></thead>
            <tbody>
              {lessons.map((l) => {
                const TypeIcon = typeIcons[l.type] || BookOpen
                return (
                  <tr key={l.id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(l.id)} aria-label={`Select ${l.title}`} className="text-text-muted hover:text-text-primary">
                        {selected.has(l.id) ? <CheckSquare className="h-4 w-4 text-brand-primary" /> : <Square className="h-4 w-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{l.order_index}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{l.title}</td>
                    <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500"><TypeIcon className="h-3 w-3" /> {typeLabels[l.type] || l.type}</span></td>
                    <td className="px-4 py-3">{l.video_url ? <span className="text-xs text-green-500">✓</span> : <span className="text-xs text-text-muted">—</span>}</td>
                    <td className="px-4 py-3">{l.is_free ? <span className="text-xs text-green-500">Free</span> : <span className="text-xs text-text-muted">Premium</span>}</td>
                    <td className="px-4 py-3">{l.is_published ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">Published</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">Draft</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin-control/courses/${courseId}/lessons/${l.id}/edit`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                        <button onClick={() => handleDelete(l.id)} aria-label="Delete" className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {lessons.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-text-muted">No lessons yet. Create your first lesson!</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
