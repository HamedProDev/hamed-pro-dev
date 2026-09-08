'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { Loader2, Clock, BookOpen, Play, FileText, HelpCircle, Check, Lock, Award, ChevronRight, XCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { CourseJsonLd } from '@/components/shared/JsonLd'
import { useAuth } from '@/lib/hooks/useAuth'

const lessonTypeIcons: Record<string, any> = { video: Play, text: FileText, quiz: HelpCircle, mixed: BookOpen }

interface ProgressData {
  enrolled: boolean
  enrollment?: any
  completedLessonIds: string[]
  completedCount: number
  totalCount: number
  unlockedLessonId: string | null
  isCompleted: boolean
  needsFinalQuiz: boolean
  isCertificateIssued: boolean
}

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const { user, isLoading: authLoading } = useAuth()
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [enrolling, setEnrolling] = useState(false)

  // final quiz state
  const [showFinalQuiz, setShowFinalQuiz] = useState(false)
  const [finalAnswers, setFinalAnswers] = useState<Record<number, number>>({})
  const [finalResult, setFinalResult] = useState<{ passed: boolean; score: number; certificateNumber?: string } | null>(null)
  const [submittingFinal, setSubmittingFinal] = useState(false)

  useEffect(() => {
    fetch('/api/courses?limit=100').then(r => r.json()).then(d => {
      if (d.success) {
        const found = d.data.find((c: any) => c.slug === slug)
        if (found) {
          setCourse(found)
          fetch(`/api/courses/${found.id}/lessons`).then(r2 => r2.json()).then(d2 => {
            if (d2.success) setLessons(d2.data || [])
          }).catch(() => {})
        }
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!course || !user) return
    fetch(`/api/courses/${course.id}/progress`).then(r => r.json()).then(d => {
      if (d.success) setProgress(d.data)
    }).catch(() => {})
  }, [course, user])

  const handleEnroll = async () => {
    if (!course) return
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      })
      const d = await res.json()
      if (d.success) {
        const firstLesson = lessons[0]
        if (firstLesson) {
          window.location.href = `/courses/${slug}/lessons/${firstLesson.id}`
          return
        }
        setProgress({ enrolled: true, completedLessonIds: [], completedCount: 0, totalCount: lessons.length, unlockedLessonId: firstLesson?.id || null, isCompleted: false, needsFinalQuiz: false, isCertificateIssued: false })
      }
    } catch {}
    setEnrolling(false)
  }

  const submitFinalQuiz = async () => {
    if (!progress?.enrollment || !course) return
    const finalQuiz: QuizQuestion[] = course.final_quiz || []
    if (Object.keys(finalAnswers).length < finalQuiz.length) return
    setSubmittingFinal(true)
    try {
      const answers = finalQuiz.map((_, i) => finalAnswers[i])
      const res = await fetch(`/api/enrollments/${progress.enrollment.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const d = await res.json()
      if (d.success) {
        setFinalResult({ passed: d.data.passed, score: d.data.score, certificateNumber: d.data.certificateNumber })
        if (d.data.passed) {
          setProgress(p => p ? { ...p, isCertificateIssued: true, needsFinalQuiz: false, isCompleted: true } : p)
        }
      }
    } catch {}
    setSubmittingFinal(false)
  }

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>

  if (!course) return (
    <div className="section-padding text-center">
      <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
      <Button asChild><Link href="/courses">Back to Courses</Link></Button>
    </div>
  )

  const enrolled = progress?.enrolled
  const isCert = progress?.isCertificateIssued
  const isDone = isCert || (enrolled && progress?.isCompleted && !progress?.needsFinalQuiz)

  const lessonState = (id: string) => {
    if (!progress) return 'unlocked'
    if (progress.completedLessonIds.includes(id)) return 'completed'
    if (progress.unlockedLessonId === id) return 'current'
    return 'locked'
  }

  const continueHref = () => {
    if (!progress) return `/courses/${slug}/lessons/${lessons[0]?.id || ''}`
    if (progress.needsFinalQuiz) return '#'
    if (progress.unlockedLessonId) return `/courses/${slug}/lessons/${progress.unlockedLessonId}`
    if (lessons[0]) return `/courses/${slug}/lessons/${lessons[0].id}`
    return '#'
  }

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-4xl">
        <MetadataInjector title={course.title} description={course.description} url={`/courses/${slug}`} />
        <Breadcrumbs items={[{ label: 'Courses', href: '/courses' }, { label: course.title }]} />
        <CourseJsonLd name={course.title} description={course.description} provider="Hamed Hussein" url={typeof window !== 'undefined' ? window.location.href : `/courses/${slug}`} />

        {course.image_url && <Image src={course.image_url} alt={`${course.title} course cover`} width={1200} height={480} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" unoptimized />}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">{course.category}</Badge>
          <Badge variant="outline">{course.level}</Badge>
          <Badge variant="success">Free</Badge>
          {isCert && <Badge variant="success"><Award className="h-3 w-3 mr-1" /> Completed</Badge>}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
        <p className="text-lg text-text-secondary mb-6">{course.description}</p>
        <div className="flex flex-wrap gap-4 mb-8 text-sm text-text-muted">
          {course.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}</span>}
          <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {lessons.length} lessons</span>
        </div>

        {/* Progress bar (enrolled) */}
        {enrolled && progress && (
          <Card className="card-hover mb-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-text-secondary">Your progress</span>
                <span className="font-semibold text-brand-primary">{progress.enrollment?.progress ?? 0}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-tertiary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-400 transition-all duration-500" style={{ width: `${progress.enrollment?.progress ?? 0}%` }} />
              </div>
              <p className="text-xs text-text-muted mt-2">{progress.completedCount} of {progress.totalCount} lessons completed</p>
            </CardContent>
          </Card>
        )}

        {course.content && <article className="prose prose-invert max-w-none mb-8 prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-brand-primary"><ReactMarkdown>{course.content}</ReactMarkdown></article>}

        {/* Lessons */}
        {lessons.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
              <p className="text-sm text-text-muted">Lessons unlock in order — complete each one to continue.</p>
            </CardHeader>
            <CardContent className="space-y-1">
              {lessons.map((l, i) => {
                const TypeIcon = lessonTypeIcons[l.type] || BookOpen
                const state = lessonState(l.id)
                const locked = state === 'locked'
                const completed = state === 'completed'
                return (
                  <div key={l.id}>
                    {locked ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg opacity-50 cursor-not-allowed">
                        <span className="text-xs text-text-muted w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        <Lock className="h-3.5 w-3.5 text-text-muted shrink-0" />
                        <span className="text-sm flex-1">{l.title}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 capitalize">{l.type || 'text'}</Badge>
                      </div>
                    ) : (
                      <Link
                        href={`/courses/${slug}/lessons/${l.id}`}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg transition-colors group',
                          completed ? 'text-green-500 bg-green-500/5' : state === 'current' ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-surface-secondary'
                        )}
                      >
                        <span className="text-xs text-text-muted w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        {completed ? <Check className="h-4 w-4 shrink-0" /> : <TypeIcon className="h-3.5 w-3.5 shrink-0" />}
                        <span className="text-sm flex-1">{l.title}</span>
                        {completed && <Badge variant="success" className="text-[10px] px-1.5 py-0 h-5">Done</Badge>}
                        <ChevronRight className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        {isCert ? (
          <Button asChild className="gradient-bg text-white w-full sm:w-auto">
            <Link href="/certification"><Award className="h-4 w-4 mr-2" /> View Your Certificate</Link>
          </Button>
        ) : progress?.needsFinalQuiz ? (
          <Button className="gradient-bg text-white w-full sm:w-auto" onClick={() => { setFinalResult(null); setShowFinalQuiz(true) }}>
            <HelpCircle className="h-4 w-4 mr-2" /> Take Final Quiz
          </Button>
        ) : enrolled ? (
          <Button asChild className="gradient-bg text-white w-full sm:w-auto">
            <Link href={continueHref()}>
              {progress && progress.completedCount > 0 ? 'Continue Learning' : 'Start Learning'} <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        ) : user ? (
          <Button className="gradient-bg text-white w-full sm:w-auto" onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Enroll & Start
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="gradient-bg text-white">
              <Link href={`/courses/${slug}/lessons/${lessons[0]?.id || ''}`}>Start Learning</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Sign in to track progress</Link>
            </Button>
          </div>
        )}

        {/* Final Quiz modal */}
        {showFinalQuiz && course.final_quiz?.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFinalQuiz(false)} />
            <Card className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glow-border">
              <CardHeader className="sticky top-0 bg-surface-primary/95 backdrop-blur z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2"><HelpCircle className="h-5 w-5 text-brand-primary" /> Final Assessment</CardTitle>
                  <button onClick={() => setShowFinalQuiz(false)} className="text-text-muted hover:text-text-primary"><XCircle className="h-5 w-5" /></button>
                </div>
                <p className="text-sm text-text-muted">Score 70% or higher to earn your certificate.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {finalResult ? (
                  finalResult.passed ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-1">Congratulations! 🎉</h3>
                      <p className="text-text-secondary mb-6">You scored {finalResult.score}% and earned your certificate.</p>
                      <Button asChild className="gradient-bg text-white"><Link href="/certification"><Award className="h-4 w-4 mr-2" /> View Certificate</Link></Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <XCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-1">Not quite — {finalResult.score}%</h3>
                      <p className="text-text-secondary mb-6">You need 70% to pass. Review the lessons and try again.</p>
                      <Button variant="outline" onClick={() => { setFinalResult(null); setFinalAnswers({}) }}>Try Again</Button>
                    </div>
                  )
                ) : (
                  <>
                    {course.final_quiz.map((q: QuizQuestion, qIdx: number) => (
                      <div key={qIdx} className="p-5 rounded-xl border border-border-primary bg-surface-secondary/50">
                        <p className="font-medium mb-3 text-text-primary">{qIdx + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.options.map((opt: string, oIdx: number) => (
                            <label key={oIdx} className={cn('flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors', finalAnswers[qIdx] === oIdx ? 'border-brand-primary/40 bg-brand-primary/10' : 'border-border-primary hover:bg-surface-tertiary')}>
                              <input type="radio" name={`final-${qIdx}`} checked={finalAnswers[qIdx] === oIdx} onChange={() => setFinalAnswers(a => ({ ...a, [qIdx]: oIdx }))} className="accent-brand-primary" />
                              <span className="text-sm flex-1">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button className="gradient-bg text-white w-full" onClick={submitFinalQuiz} disabled={submittingFinal || Object.keys(finalAnswers).length < course.final_quiz.length}>
                      {submittingFinal ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Submit Assessment
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
