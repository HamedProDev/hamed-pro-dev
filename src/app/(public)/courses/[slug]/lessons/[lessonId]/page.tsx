'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Loader2, ArrowLeft, ArrowRight, CheckCircle, XCircle, ChevronLeft, ChevronRight, Youtube, FileText, BookOpen, HelpCircle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

const typeIcons: Record<string, any> = { video: Youtube, text: FileText, quiz: HelpCircle, mixed: BookOpen }
const typeLabels: Record<string, string> = { video: 'Video', text: 'Text', quiz: 'Quiz', mixed: 'Mixed' }

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const lessonId = params?.lessonId as string
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [lesson, setLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({})
  const [showResources, setShowResources] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch('/api/courses').then(r => r.json()).then(d => {
      if (!d.success) { setLoading(false); return }
      const found = d.data.find((c: any) => c.slug === slug || c._id === slug)
      if (!found) { setLoading(false); return }
      setCourse(found)
      fetch(`/api/courses/${found._id}/lessons`).then(r2 => r2.json()).then(d2 => {
        if (d2.success) {
          setLessons(d2.data || [])
          const current = d2.data.find((l: any) => l._id === lessonId || l.slug === lessonId)
          if (current) setLesson(current)
        }
        setLoading(false)
      }).catch(() => setLoading(false))
    }).catch(() => setLoading(false))
  }, [slug, lessonId])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
  if (!course || !lesson) return (
    <main id="main-content" className="section-padding pt-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Lesson Not Found</h1>
      <Button asChild><Link href={course ? `/courses/${slug}` : '/courses'}>Back to Course</Link></Button>
    </main>
  )

  const currentIndex = lessons.findIndex(l => l._id === lesson._id)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  const progress = lessons.length > 0 ? Math.round(((currentIndex + 1) / lessons.length) * 100) : 0
  const TypeIcon = typeIcons[lesson.type] || BookOpen

  const handleAnswer = (qIdx: number, optionIdx: number) => {
    setAnswers(a => ({ ...a, [qIdx]: optionIdx }))
  }

  const handleSubmitQuiz = (qIdx: number) => {
    setSubmitted(s => ({ ...s, [qIdx]: true }))
  }

  const handleResetQuiz = (qIdx: number) => {
    setAnswers(a => {
      const n = { ...a }
      delete n[qIdx]
      return n
    })
    setSubmitted(s => {
      const n = { ...s }
      delete n[qIdx]
      return n
    })
  }

  return (
    <main id="main-content" className="min-h-screen bg-surface-primary">
      <MetadataInjector title={`${lesson.title} - ${course.title}`} description={lesson.content?.slice(0, 160) || `${course.title} lesson`} url={`/courses/${slug}/lessons/${lessonId}`} />
      <div className="border-b border-border-primary bg-surface-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container-wide py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={`/courses/${slug}`} className="text-text-muted hover:text-text-primary transition-colors shrink-0"><ChevronLeft className="h-5 w-5" /></Link>
            <div className="h-6 w-px bg-border-primary" />
            <div className="min-w-0">
              <p className="text-xs text-text-muted truncate">{course.title}</p>
              <p className="text-sm font-medium truncate">{lesson.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-text-muted hidden sm:inline">{currentIndex + 1} / {lessons.length}</span>
            <div className="hidden sm:flex items-center gap-1">
              {prevLesson && (
                <Button size="sm" variant="ghost" asChild className="h-8 px-2">
                  <Link href={`/courses/${slug}/lessons/${prevLesson._id}`}><ChevronLeft className="h-4 w-4" /></Link>
                </Button>
              )}
              {nextLesson && (
                <Button size="sm" variant="ghost" asChild className="h-8 px-2">
                  <Link href={`/courses/${slug}/lessons/${nextLesson._id}`}><ChevronRight className="h-4 w-4" /></Link>
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="h-1 bg-surface-tertiary">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="container-wide max-w-4xl py-8">
        <Breadcrumbs items={[
          { label: 'Courses', href: '/courses' },
          { label: course.title, href: `/courses/${slug}` },
          { label: lesson.title },
        ]} />

        <div className="flex items-center gap-3 mb-6 mt-4">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 flex items-center gap-1"><TypeIcon className="h-3 w-3" /> {typeLabels[lesson.type] || lesson.type}</Badge>
          {lesson.isFree && <Badge variant="outline" className="text-green-500 border-green-500/20">Free Preview</Badge>}
          <span className="text-xs text-text-muted ml-auto">Lesson {currentIndex + 1} of {lessons.length}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">{lesson.title}</h1>

        {lesson.youtubeUrl && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-surface-card border border-border-primary">
            <iframe src={lesson.youtubeUrl.replace('watch?v=', 'embed/').split('&')[0]} title={lesson.title} allowFullScreen className="w-full h-full" />
          </div>
        )}

        <article className="prose prose-invert max-w-none mb-12 prose-headings:text-text-primary prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-text-secondary prose-p:leading-relaxed prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-code:text-brand-primary prose-code:bg-surface-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-pre:bg-surface-tertiary prose-pre:border prose-pre:border-border-primary prose-pre:rounded-xl prose-li:text-text-secondary prose-img:rounded-xl prose-img:border prose-img:border-border-primary">
          <ReactMarkdown>{lesson.content || ''}</ReactMarkdown>
        </article>

        {lesson.resources && lesson.resources.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="cursor-pointer select-none" onClick={() => setShowResources(!showResources)}>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Resources & References</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${showResources ? 'rotate-90' : ''}`} />
              </CardTitle>
            </CardHeader>
            {showResources && (
              <CardContent className="space-y-2">
                {lesson.resources.map((r: any, i: number) => (
                  <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors group">
                    <Badge className="shrink-0 text-xs">{r.type.toUpperCase()}</Badge>
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{r.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-auto text-text-muted" />
                  </a>
                ))}
              </CardContent>
            )}
          </Card>
        )}

        {lesson.quiz && lesson.quiz.length > 0 && (
          <Card className="mb-8 border-brand-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><HelpCircle className="h-5 w-5 text-brand-primary" /> Knowledge Check</CardTitle>
              <p className="text-sm text-text-muted">Test your understanding of this lesson.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {lesson.quiz.map((q: any, qIdx: number) => {
                const isCorrect = submitted[qIdx] && answers[qIdx] === q.correctIndex
                const isWrong = submitted[qIdx] && answers[qIdx] !== q.correctIndex
                return (
                  <div key={qIdx} className={`p-5 rounded-xl border transition-colors ${isCorrect ? 'border-green-500/30 bg-green-500/5' : isWrong ? 'border-red-500/30 bg-red-500/5' : 'border-border-primary bg-surface-secondary'}`}>
                    <p className="font-medium mb-3 text-text-primary">{qIdx + 1}. {q.question}</p>
                    <div className="space-y-2 mb-4">
                      {q.options.map((opt: string, oIdx: number) => {
                        const showCorrect = submitted[qIdx] && oIdx === q.correctIndex
                        const showWrong = submitted[qIdx] && oIdx === answers[qIdx] && oIdx !== q.correctIndex
                        return (
                          <label key={oIdx} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${showCorrect ? 'border-green-500/40 bg-green-500/10' : showWrong ? 'border-red-500/40 bg-red-500/10' : answers[qIdx] === oIdx ? 'border-brand-primary/40 bg-brand-primary/10' : 'border-border-primary hover:bg-surface-tertiary'}`}>
                            <input type="radio" name={`quiz-${qIdx}`} checked={answers[qIdx] === oIdx} onChange={() => handleAnswer(qIdx, oIdx)} disabled={submitted[qIdx]} className="accent-brand-primary" />
                            <span className="text-sm flex-1">{opt}</span>
                            {showCorrect && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                            {showWrong && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                          </label>
                        )
                      })}
                    </div>
                    {!submitted[qIdx] ? (
                      <Button size="sm" onClick={() => handleSubmitQuiz(qIdx)} disabled={answers[qIdx] === undefined} className="gradient-bg text-white">
                        <Check className="h-3.5 w-3.5 mr-1" /> Check Answer
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 text-sm ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                          {isCorrect ? <><CheckCircle className="h-4 w-4" /> Correct!</> : <><XCircle className="h-4 w-4" /> Incorrect. The correct answer is option {q.correctIndex + 1}.</>}
                        </div>
                        {q.explanation && <p className="text-sm text-text-muted bg-surface-tertiary p-3 rounded-lg">{q.explanation}</p>}
                        <Button size="sm" variant="ghost" onClick={() => handleResetQuiz(qIdx)} className="text-xs">Retry</Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-border-primary">
          <div>
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link href={`/courses/${slug}/lessons/${prevLesson._id}`}><ChevronLeft className="h-4 w-4 mr-1" /> Previous: {prevLesson.title}</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={`/courses/${slug}`}><ChevronLeft className="h-4 w-4 mr-1" /> Back to Course</Link>
              </Button>
            )}
          </div>
          <div>
            {nextLesson ? (
              <Button className="gradient-bg text-white" asChild>
                <Link href={`/courses/${slug}/lessons/${nextLesson._id}`}>Next: {nextLesson.title} <ChevronRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            ) : (
              <Button className="gradient-bg text-white" asChild>
                <Link href={`/courses/${slug}`}>Complete Course <Check className="h-4 w-4 ml-1" /></Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
