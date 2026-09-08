'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, MessageSquare, Check, EyeOff, Trash2, RefreshCw } from 'lucide-react'

interface Comment {
  id: string
  lesson_id: string
  lesson_title: string
  course_id: string | null
  content: string
  status: string
  created_at: string
  author: { name: string; avatar_url: string | null } | null
}

const statusStyles: Record<string, string> = {
  visible: 'bg-green-500/10 text-green-500',
  pending: 'bg-amber-500/10 text-amber-500',
  hidden: 'bg-gray-500/10 text-gray-400',
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState<string | null>(null)

  const fetchData = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/comments?status=${filter}`)
      .then(r => r.json())
      .then(d => { if (d.success) setComments(d.data || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filter])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAction = async (id: string, action: string) => {
    setBusy(id)
    await fetch('/api/admin/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    })
    setBusy(null)
    fetchData()
  }

  const counts = {
    all: comments.length,
    visible: comments.filter(c => c.status === 'visible').length,
    pending: comments.filter(c => c.status === 'pending').length,
    hidden: comments.filter(c => c.status === 'hidden').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Comment Moderation</h1>
          <p className="text-text-muted text-sm">Review and moderate community comments on lessons.</p>
        </div>
        <button onClick={fetchData} className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary" aria-label="Refresh"><RefreshCw className="h-4 w-4" /></button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'visible', 'pending', 'hidden'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${filter === f ? 'bg-brand-primary text-white' : 'bg-surface-secondary text-text-secondary hover:text-text-primary'}`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
      ) : comments.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <MessageSquare className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted">No comments to moderate right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(c => (
            <div key={c.id} className="admin-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary text-sm">{c.author?.name || 'Student'}</span>
                    <span className="text-xs text-text-muted">on</span>
                    <Link href={c.course_id ? `/admin-control/courses/${c.course_id}/lessons` : '#'} className="text-sm text-brand-primary hover:underline">{c.lesson_title}</Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusStyles[c.status] || ''}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{c.content}</p>
                  <p className="text-xs text-text-muted mt-1">{new Date(c.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {c.status !== 'visible' && (
                    <button onClick={() => handleAction(c.id, 'approve')} disabled={busy === c.id} className="p-2 rounded-lg hover:bg-green-500/10 text-text-muted hover:text-green-500" title="Approve" aria-label="Approve"><Check className="h-4 w-4" /></button>
                  )}
                  {c.status !== 'hidden' && (
                    <button onClick={() => handleAction(c.id, 'hide')} disabled={busy === c.id} className="p-2 rounded-lg hover:bg-amber-500/10 text-text-muted hover:text-amber-500" title="Hide" aria-label="Hide"><EyeOff className="h-4 w-4" /></button>
                  )}
                  <button onClick={() => handleAction(c.id, 'delete')} disabled={busy === c.id} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400" title="Delete" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
