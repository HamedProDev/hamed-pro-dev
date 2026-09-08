'use client'
import { useEffect, useState, useCallback } from 'react'
import { MessageCircle, Send, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/hooks/useAuth'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  author?: { name: string; avatar_url: string | null }
}

export function LessonComments({ lessonId }: { lessonId: string }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  const fetchComments = useCallback(() => {
    fetch(`/api/lessons/${lessonId}/comments`)
      .then(r => r.json())
      .then(d => setComments(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [lessonId])

  useEffect(() => { fetchComments() }, [fetchComments])

  const handlePost = async () => {
    if (!text.trim()) return
    setPosting(true)
    try {
      await fetch(`/api/lessons/${lessonId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      })
      setText('')
      fetchComments()
    } catch {}
    setPosting(false)
  }

  const handleDelete = async (commentId: string) => {
    await fetch(`/api/lessons/${lessonId}/comments`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId }),
    })
    fetchComments()
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2"><MessageCircle className="h-5 w-5 text-brand-primary" /> Discussion</CardTitle>
        <p className="text-sm text-text-muted">Ask questions and share thoughts about this lesson.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          <div className="space-y-2">
            <Textarea rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." />
            <div className="flex justify-end">
              <Button size="sm" onClick={handlePost} disabled={posting || !text.trim()} className="gradient-bg">
                {posting ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1" />} Post
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-muted">Sign in to join the discussion.</p>
        )}

        {loading ? (
          <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-brand-primary" /></div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-text-muted">No comments yet — be the first to start the discussion.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map(c => (
              <li key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary/50">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {c.author?.avatar_url ? <img src={c.author.avatar_url} alt="" className="h-8 w-8 object-cover" /> : (c.author?.name?.[0] || 'S').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-text-primary">{c.author?.name || 'Student'}</span>
                    <span className="text-xs text-text-muted shrink-0">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5 whitespace-pre-wrap">{c.content}</p>
                </div>
                {user && (c.user_id === user.uid || user.role === 'admin') && (
                  <button onClick={() => handleDelete(c.id)} aria-label="Delete comment" className="text-text-muted hover:text-red-400 transition-colors shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
