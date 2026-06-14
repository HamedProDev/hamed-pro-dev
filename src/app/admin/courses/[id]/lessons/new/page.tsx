'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NewLessonPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.id as string
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [courseTitle, setCourseTitle] = useState('')
  const [form, setForm] = useState({
    title: '', type: 'text', content: '', youtubeUrl: '', videoDuration: '',
    isFree: false, isPublished: true,
    resources: [] as { title: string; url: string; type: string }[],
    quiz: [] as { question: string; options: string[]; correctIndex: number; explanation: string }[],
  })

  useEffect(() => {
    if (courseId) {
      fetch(`/api/courses/${courseId}`).then(r => r.json()).then(d => {
        if (d.success) setCourseTitle(d.data?.title || '')
      }).catch(() => {})
    }
  }, [courseId])

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const addResource = () => setForm(f => ({ ...f, resources: [...f.resources, { title: '', url: '', type: 'link' }] }))
  const updateResource = (i: number, key: string, value: any) => {
    const resources = [...form.resources]
    resources[i] = { ...resources[i], [key]: value }
    update('resources', resources)
  }
  const removeResource = (i: number) => setForm(f => ({ ...f, resources: f.resources.filter((_, idx) => idx !== i) }))

  const addQuiz = () => setForm(f => ({ ...f, quiz: [...f.quiz, { question: '', options: ['', ''], correctIndex: 0, explanation: '' }] }))
  const updateQuiz = (i: number, key: string, value: any) => {
    const quiz = [...form.quiz]
    quiz[i] = { ...quiz[i], [key]: value }
    update('quiz', quiz)
  }
  const updateQuizOption = (qIdx: number, oIdx: number, value: string) => {
    const quiz = [...form.quiz]
    quiz[qIdx].options[oIdx] = value
    update('quiz', quiz)
  }
  const addQuizOption = (qIdx: number) => {
    const quiz = [...form.quiz]
    quiz[qIdx].options.push('')
    update('quiz', quiz)
  }
  const removeQuiz = (i: number) => setForm(f => ({ ...f, quiz: f.quiz.filter((_, idx) => idx !== i) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const body: any = {
        title: form.title,
        type: form.type,
        content: form.content,
        isFree: form.isFree,
        isPublished: form.isPublished,
        resources: form.resources.filter(r => r.title && r.url),
        quiz: form.quiz.filter(q => q.question && q.options.some(o => o)),
      }
      if (form.type === 'video' || form.youtubeUrl) body.youtubeUrl = form.youtubeUrl
      if (form.videoDuration) body.videoDuration = Number(form.videoDuration)

      const res = await fetch(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) router.push(`/admin/courses/${courseId}/lessons`)
      else setError(data.error || 'Failed to create lesson')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl">
      <Link href={`/admin/courses/${courseId}/lessons`} className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Lessons</Link>
      <h1 className="text-3xl font-bold mb-2">Create Lesson</h1>
      {courseTitle && <p className="text-text-muted text-sm mb-6">Course: {courseTitle}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Lesson Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><Input required value={form.title} onChange={e => update('title', e.target.value)} placeholder="Lesson Title" /></div>
            <div><label className="text-sm font-medium mb-1 block">Type</label><select value={form.type} onChange={e => update('type', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm">
              <option value="text">Text</option><option value="video">Video</option><option value="quiz">Quiz</option><option value="mixed">Mixed</option>
            </select></div>
            <div><label className="text-sm font-medium mb-1 block">Content (Markdown supported)</label><Textarea rows={8} value={form.content} onChange={e => update('content', e.target.value)} placeholder="Write your lesson content here... (supports **bold**, *italic*, lists, code blocks)" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">YouTube URL</label><Input value={form.youtubeUrl} onChange={e => update('youtubeUrl', e.target.value)} placeholder="https://youtube.com/watch?v=..." /></div>
              <div><label className="text-sm font-medium mb-1 block">Video Duration (minutes)</label><Input type="number" min="0" value={form.videoDuration} onChange={e => update('videoDuration', e.target.value)} placeholder="e.g. 15" /></div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFree} onChange={e => update('isFree', e.target.checked)} className="accent-brand-primary" /> Free preview</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={e => update('isPublished', e.target.checked)} className="accent-brand-primary" /> Published</label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Resources</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={addResource}><Plus className="h-3 w-3 mr-1" /> Add Resource</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {form.resources.length === 0 && <p className="text-sm text-text-muted">No resources added yet.</p>}
            {form.resources.map((r, i) => (
              <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-surface-secondary">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <Input placeholder="Title" value={r.title} onChange={e => updateResource(i, 'title', e.target.value)} />
                  <Input placeholder="URL" value={r.url} onChange={e => updateResource(i, 'url', e.target.value)} />
                  <select value={r.type} onChange={e => updateResource(i, 'type', e.target.value)} className="rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm">
                    <option value="pdf">PDF</option><option value="link">Link</option><option value="code">Code</option>
                  </select>
                </div>
                <button type="button" onClick={() => removeResource(i)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400"><X className="h-4 w-4" /></button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quiz Questions</CardTitle>
            <Button type="button" size="sm" variant="outline" onClick={addQuiz}><Plus className="h-3 w-3 mr-1" /> Add Question</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.quiz.length === 0 && <p className="text-sm text-text-muted">No quiz questions added.</p>}
            {form.quiz.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-lg bg-surface-secondary border border-border-primary">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Question {qIdx + 1}</span>
                  <button type="button" onClick={() => removeQuiz(qIdx)} className="p-1 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400"><X className="h-4 w-4" /></button>
                </div>
                <Input className="mb-3" placeholder="Question" value={q.question} onChange={e => updateQuiz(qIdx, 'question', e.target.value)} />
                <label className="text-xs text-text-muted mb-1 block">Options</label>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2 mb-2">
                    <input type="radio" name={`correct-${qIdx}`} checked={q.correctIndex === oIdx} onChange={() => updateQuiz(qIdx, 'correctIndex', oIdx)} className="accent-brand-primary" />
                    <Input placeholder={`Option ${oIdx + 1}`} value={opt} onChange={e => updateQuizOption(qIdx, oIdx, e.target.value)} className="flex-1" />
                  </div>
                ))}
                <Button type="button" size="sm" variant="ghost" onClick={() => addQuizOption(qIdx)} className="text-xs mt-1"><Plus className="h-3 w-3 mr-1" /> Add Option</Button>
                <div className="mt-3">
                  <label className="text-xs text-text-muted mb-1 block">Explanation (shown after answering)</label>
                  <Input value={q.explanation} onChange={e => updateQuiz(qIdx, 'explanation', e.target.value)} placeholder="Optional explanation" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {saving ? 'Creating...' : 'Create Lesson'}
        </Button>
      </form>
    </div>
  )
}
