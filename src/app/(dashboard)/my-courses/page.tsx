'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import Link from 'next/link'
import { BookOpen, Loader2, PlayCircle, Award, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface EnrolledCourse {
  id: string
  course_id: string
  progress: number
  status: string
  title: string
  slug: string
  unlockedLessonId: string | null
  totalCount: number
  completedCount: number
  needsFinalQuiz: boolean
}

export default function MyCoursesPage() {
  const { user, loading } = useAuth()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) { setFetching(false); return }
    fetch('/api/enrollments').then(r => r.json()).then(async d => {
      const enrollments = d.data || []
      if (enrollments.length === 0) { setFetching(false); return }
      const rows = await Promise.all(
        enrollments.map(async (e: any) => {
          const [courseRes, progressRes] = await Promise.all([
            fetch(`/api/courses/${e.course_id}`).then(r => r.json()),
            fetch(`/api/courses/${e.course_id}/progress`).then(r => r.json()),
          ])
          const p = progressRes.data || {}
          return {
            id: e.id,
            course_id: e.course_id,
            progress: p.enrollment?.progress ?? e.progress ?? 0,
            status: p.enrollment?.status ?? e.status,
            title: courseRes.data?.title || 'Course',
            slug: courseRes.data?.slug || e.course_id,
            unlockedLessonId: p.unlockedLessonId || null,
            totalCount: p.totalCount || 0,
            completedCount: p.completedCount || 0,
            needsFinalQuiz: p.needsFinalQuiz || false,
          }
        })
      )
      setCourses(rows)
      setFetching(false)
    }).catch(() => setFetching(false))
  }, [user])

  if (loading || fetching) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl font-bold mb-4">My Courses</h1>
        <p className="text-text-muted mb-6">Please sign in to see your courses.</p>
        <Button asChild className="gradient-bg text-white"><Link href="/login">Sign In</Link></Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">My Courses</h1>
      <p className="text-text-secondary mb-6">Track your progress. Lessons unlock in order — you can&apos;t skip ahead.</p>

      {courses.length === 0 ? (
        <Card className="card-hover">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
            <p className="text-sm text-text-secondary mb-4">Browse our free courses and start learning.</p>
            <Button asChild className="gradient-bg text-white"><Link href="/courses">Browse Courses</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => {
            const done = c.status === 'completed'
            const href = done
              ? '/certification'
              : c.needsFinalQuiz
                ? `/courses/${c.slug}`
                : c.unlockedLessonId
                  ? `/courses/${c.slug}/lessons/${c.unlockedLessonId}`
                  : `/courses/${c.slug}`
            return (
              <Link key={c.id} href={href}>
                <Card className="card-hover h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold line-clamp-1">{c.title}</h3>
                      {done
                        ? <Award className="h-5 w-5 text-green-500 shrink-0" />
                        : c.needsFinalQuiz
                          ? <Badge variant="warning">Final Quiz</Badge>
                          : <PlayCircle className="h-5 w-5 text-brand-primary shrink-0" />}
                    </div>

                    <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-400" style={{ width: `${c.progress}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" /> {c.completedCount}/{c.totalCount} lessons
                      </span>
                      <span>{c.progress}%</span>
                    </div>

                    <span className="mt-auto text-sm text-brand-primary font-medium">
                      {done ? 'View certificate →' : c.needsFinalQuiz ? 'Take final quiz →' : 'Continue →'}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
