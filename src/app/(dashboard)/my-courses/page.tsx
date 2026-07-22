'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import Link from 'next/link'
import { BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function MyCoursesPage() {
  const { user, loading } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (user) {
      fetch('/api/users/me').then(r => r.json()).then(d => {
        if (d.data?.enrolledCourses?.length) {
          Promise.all(
            d.data.enrolledCourses.map((id: string) =>
              fetch(`/api/courses/${id}`).then(r => r.json()).then(d => d.data).catch(() => null)
            )
          ).then(results => {
            setCourses(results.filter(Boolean))
            setFetching(false)
          })
        } else {
          setFetching(false)
        }
      }).catch(() => setFetching(false))
    } else {
      setFetching(false)
    }
  }, [user])

  if (loading || fetching) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

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
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      {courses.length === 0 ? (
        <div className="rounded-xl border border-border-primary bg-surface-card p-12 text-center">
          <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
          <p className="text-sm text-text-secondary mb-4">Browse our courses and start learning.</p>
          <Button asChild className="gradient-bg text-white"><Link href="/courses">Browse Courses</Link></Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c: any) => (
            <Link key={c.id} href={`/courses/${c.id}`}>
              <Card className="card-hover h-full">
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-1">{c.title}</h3>
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">{c.description}</p>
                  <div className="flex gap-2 text-xs text-text-muted">
                    <span className="px-2 py-0.5 rounded bg-surface-tertiary">{c.category}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-tertiary">{c.level}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
