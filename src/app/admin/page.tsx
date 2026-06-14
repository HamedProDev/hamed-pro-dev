'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FolderOpen, GraduationCap, Briefcase, Users, FileText, Settings, Zap, Trophy, TrendingUp, Eye } from 'lucide-react'

interface Stats {
  projects: number
  courses: number
  jobs: number
  users: number
  skills: number
  achievements: number
  blog: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, courses: 0, jobs: 0, users: 0, skills: 0, achievements: 0, blog: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/courses').then(r => r.json()),
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/skills').then(r => r.json()),
      fetch('/api/achievements').then(r => r.json()),
      fetch('/api/blog').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
    ]).then(([p, c, j, s, a, b, u]) => {
      setStats({
        projects: p.data?.length || 0,
        courses: c.data?.length || 0,
        jobs: j.data?.length || 0,
        skills: s.data?.length || 0,
        achievements: a.data?.length || 0,
        blog: b.data?.length || 0,
        users: u.data?.length || 0,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Courses', value: stats.courses, icon: GraduationCap, href: '/admin/courses', color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Jobs', value: stats.jobs, icon: Briefcase, href: '/admin/jobs', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Skills', value: stats.skills, icon: Zap, href: '/admin/skills', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Achievements', value: stats.achievements, icon: Trophy, href: '/admin/achievements', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Blog Posts', value: stats.blog, icon: FileText, href: '/admin/blog', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { label: 'Users', value: stats.users, icon: Users, href: '/admin/users', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Settings', value: null, icon: Settings, href: '/admin/settings', color: 'text-gray-500', bg: 'bg-gray-500/10' },
  ]

  const quickActions = [
    { label: 'New Project', href: '/admin/projects/new' },
    { label: 'New Course', href: '/admin/courses/new' },
    { label: 'New Job', href: '/admin/jobs/new' },
    { label: 'New Skill', href: '/admin/skills/new' },
    { label: 'New Achievement', href: '/admin/achievements/new' },
    { label: 'New Blog Post', href: '/admin/blog/new' },
    { label: 'Site Settings', href: '/admin/settings' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-1">Admin Dashboard</h1>
        <p className="text-text-muted">Manage your entire platform from here</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={s.href} className="block admin-card hover:shadow-lg transition-all duration-200 group">
              <s.icon className={`h-5 w-5 mb-2 ${s.color} group-hover:scale-110 transition-transform`} />
              <p className="text-2xl font-bold text-text-primary">{loading ? '...' : s.value ?? '—'}</p>
              <p className="text-sm text-text-muted">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="admin-card">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-2">
            {quickActions.map(a => (
              <Link key={a.href} href={a.href} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 text-sm hover:bg-blue-500/20 transition-colors">
                {a.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-500" />
            Platform Overview
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">Total Content</span><span className="text-text-primary font-medium">{stats.projects + stats.courses + stats.blog + stats.skills + stats.achievements} items</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Total Users</span><span className="text-text-primary font-medium">{stats.users}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Job Listings</span><span className="text-text-primary font-medium">{stats.jobs}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Skills</span><span className="text-text-primary font-medium">{stats.skills}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
