'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Eye, ArrowLeft, BookOpen, Youtube, FileText, HelpCircle } from 'lucide-react'

interface Lesson {
  _id: string; title: string; order: number; type: string; isFree: boolean; isPublished: boolean; youtubeUrl?: string
}

const typeIcons: Record<string, any> = {
  video: Youtube, text: FileText, quiz: HelpCircle, mixed: BookOpen,
}

const typeLabels: Record<string, string> = {
  video: 'Video', text: 'Text', quiz: 'Quiz', mixed: 'Mixed',
}

export default function AdminLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.id as string
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [courseTitle, setCourseTitle] = useState('')

  const fetchData = () => {
    Promise.all([
      fetch(`/api/courses/${courseId}`).then(r => r.json()),
      fetch(`/api/courses/${courseId}/lessons`).then(r => r.json()),
    ]).then(([course, lessonsData]) => {
      if (course.success) setCourseTitle(course.data?.title || '')
      if (lessonsData.success) setLessons(lessonsData.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [courseId])

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return
    await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _method: 'DELETE' }),
    })
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-2"><ArrowLeft className="h-4 w-4" /> Back to Courses</Link>
          <h1 className="text-3xl font-bold text-text-primary">Lessons: {courseTitle || 'Loading...'}</h1>
        </div>
        <Button asChild className="gradient-bg text-white"><Link href={`/admin/courses/${courseId}/lessons/new`}><Plus className="h-4 w-4 mr-2" /> New Lesson</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-primary">
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
                  <tr key={l._id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3 text-text-muted">{l.order}</td>
                    <td className="px-4 py-3 font-medium text-text-primary">{l.title}</td>
                    <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500"><TypeIcon className="h-3 w-3" /> {typeLabels[l.type] || l.type}</span></td>
                    <td className="px-4 py-3">{l.youtubeUrl ? <span className="text-xs text-green-500">✓</span> : <span className="text-xs text-text-muted">—</span>}</td>
                    <td className="px-4 py-3">{l.isFree ? <span className="text-xs text-green-500">Free</span> : <span className="text-xs text-text-muted">Premium</span>}</td>
                    <td className="px-4 py-3">{l.isPublished ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">Published</span> : <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">Draft</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/courses/${courseId}/lessons/${l._id}/edit`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                        <button onClick={() => handleDelete(l._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {lessons.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-text-muted">No lessons yet. Create your first lesson!</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
