'use client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookMarked, Award, Mail, Shield, ArrowRight, Loader2, PlayCircle, GraduationCap, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

interface EnrolledCourse {
  id: string
  course_id: string
  progress: number
  status: string
  title: string
  slug: string
  unlockedLessonId: string | null
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [stats, setStats] = useState({ courses: 0, certs: 0 })
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      fetch('/api/enrollments').then(r => r.json()),
      fetch('/api/certificates/me').then(r => r.json()),
    ]).then(([enr, certs]) => {
      const enrollments = enr.data || []
      setStats({
        courses: enrollments.length,
        certs: certs.data?.length || 0,
      })
      if (enrollments.length > 0) {
        Promise.all(
          enrollments.map(async (e: any) => {
            const [courseRes, progressRes] = await Promise.all([
              fetch(`/api/courses/${e.course_id}`).then(r => r.json()),
              fetch(`/api/courses/${e.course_id}/progress`).then(r => r.json()),
            ])
            return {
              id: e.id,
              course_id: e.course_id,
              progress: progressRes.data?.enrollment?.progress ?? e.progress ?? 0,
              status: progressRes.data?.enrollment?.status ?? e.status,
              title: courseRes.data?.title || 'Course',
              slug: courseRes.data?.slug || e.course_id,
              unlockedLessonId: progressRes.data?.unlockedLessonId || null,
            }
          })
        ).then(setCourses).catch(() => {}).finally(() => setLoadingCourses(false))
      } else {
        setLoadingCourses(false)
      }
    }).catch(() => setLoadingCourses(false))
  }, [user])

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-text-muted mb-6">Please sign in to access your dashboard.</p>
        <Button asChild className="gradient-bg text-white"><Link href="/login">Sign In</Link></Button>
      </div>
    )
  }

  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30">
            {user.image ? <img src={user.image} alt={user.name || ''} className="h-16 w-16 rounded-full object-cover" /> : initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name?.split(' ')[0] || 'Student'}</h1>
            <p className="text-text-muted text-sm flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</p>
            <Badge className="mt-1 text-xs" variant="outline"><Shield className="h-3 w-3 mr-1" /> {user.role || 'visitor'}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link href="/profile">Edit Profile</Link></Button>
          <Button asChild size="sm" className="gradient-bg text-white"><Link href="/courses">Browse Courses</Link></Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {[
          { icon: BookMarked, label: 'My Courses', value: stats.courses, color: 'text-brand-primary', bg: 'bg-brand-primary/10', href: '/my-courses' },
          { icon: Award, label: 'Certificates', value: stats.certs, color: 'text-green-500', bg: 'bg-green-500/10', href: '/certification' },
          { icon: Users, label: 'Invite Friends', value: '∞', color: 'text-violet-500', bg: 'bg-violet-500/10', href: '/invite' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link href={s.href}>
              <Card className="card-hover"><CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', s.bg)}><s.icon className={cn('h-5 w-5', s.color)} /></div>
                  <ArrowRight className="h-4 w-4 text-text-muted" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{s.value}</h3>
                <p className="text-sm text-text-muted">{s.label}</p>
              </CardContent></Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Continue Learning */}
      <h2 className="text-lg font-semibold mb-4">Continue Learning</h2>
      {loadingCourses ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
      ) : courses.length === 0 ? (
        <Card className="card-hover mb-8">
          <CardContent className="p-10 text-center">
            <GraduationCap className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start your first course</h3>
            <p className="text-sm text-text-secondary mb-4">Enroll in a free course and track your progress here.</p>
            <Button asChild className="gradient-bg text-white"><Link href="/courses">Explore Courses</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {courses.map(c => {
            const done = c.status === 'completed'
            const href = done
              ? '/certification'
              : c.unlockedLessonId
                ? `/courses/${c.slug}/lessons/${c.unlockedLessonId}`
                : `/courses/${c.slug}`
            return (
              <Link key={c.id} href={href}>
                <Card className="card-hover h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold line-clamp-1">{c.title}</h3>
                      {done
                        ? <Badge variant="success"><Award className="h-3 w-3 mr-1" /> Done</Badge>
                        : <PlayCircle className="h-5 w-5 text-brand-primary shrink-0" />}
                    </div>
                    <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: `${c.progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{c.progress}% complete</span>
                      <span>{done ? 'View certificate →' : 'Continue →'}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Browse Courses', desc: 'Explore available courses', href: '/courses', icon: '📚' },
          { label: 'Certification', desc: 'View your certificates', href: '/certification', icon: '🏆' },
          { label: 'Invite', desc: 'Invite friends to learn', href: '/invite', icon: '🎁' },
          { label: 'Contact', desc: 'Get in touch', href: '/contact', icon: '📬' },
        ].map(a => (
          <Link key={a.label} href={a.href}>
            <Card className="card-hover h-full"><CardContent className="p-5">
              <div className="text-2xl mb-2">{a.icon}</div>
              <h3 className="font-medium mb-1">{a.label}</h3>
              <p className="text-xs text-text-muted">{a.desc}</p>
            </CardContent></Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
