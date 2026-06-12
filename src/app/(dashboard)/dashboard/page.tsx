'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookMarked, Bookmark, Award, User, Mail, Shield, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({ courses: 0, jobs: 0, certs: 0 })

  useEffect(() => {
    if (session?.user) {
      fetch('/api/users/me').then(r => r.json()).then(d => {
        if (d.data) {
          setStats({
            courses: d.data.enrolledCourses?.length || 0,
            jobs: d.data.savedJobs?.length || 0,
            certs: 0,
          })
        }
      }).catch(() => {})
    }
  }, [session])

  if (status === 'loading') {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-text-muted mb-6">Please sign in to access your dashboard.</p>
        <Button asChild className="gradient-bg text-white"><Link href="/login">Sign In</Link></Button>
      </div>
    )
  }

  const user = session.user
  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-xl font-bold">{initials}</div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name?.split(' ')[0] || 'User'}</h1>
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
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: BookMarked, label: 'My Courses', value: stats.courses, color: 'text-brand-primary', bg: 'bg-brand-primary/10', href: '/my-courses' },
          { icon: Bookmark, label: 'Saved Jobs', value: stats.jobs, color: 'text-green-500', bg: 'bg-green-500/10', href: '/saved-jobs' },
          { icon: Award, label: 'Certificates', value: stats.certs, color: 'text-amber-500', bg: 'bg-amber-500/10', href: '#' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="card-hover"><CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', s.bg)}><s.icon className={cn('h-5 w-5', s.color)} /></div>
                <ArrowRight className="h-4 w-4 text-text-muted" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{s.value}</h3>
              <p className="text-sm text-text-muted">{s.label}</p>
            </CardContent></Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Browse Courses', desc: 'Explore available courses', href: '/courses', icon: '📚' },
          { label: 'Find Jobs', desc: 'Discover job opportunities', href: '/jobs', icon: '💼' },
          { label: 'View Projects', desc: 'See portfolio projects', href: '/projects', icon: '🚀' },
          { label: 'Contact Me', desc: 'Get in touch', href: '/contact', icon: '📬' },
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
