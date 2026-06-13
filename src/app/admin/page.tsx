'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderOpen, GraduationCap, Briefcase, Users, FileText, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, courses: 0, jobs: 0, users: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/projects?limit=1').then(r => r.json()),
      fetch('/api/courses?limit=1').then(r => r.json()),
      fetch('/api/jobs?limit=1').then(r => r.json()),
    ]).then(([p, c, j]) => {
      setStats({
        projects: p.pagination?.total || p.data?.length || 0,
        courses: c.pagination?.total || c.data?.length || 0,
        jobs: j.pagination?.total || j.data?.length || 0,
        users: 0,
      })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, href: '/admin/projects', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Courses', value: stats.courses, icon: GraduationCap, href: '/admin/courses', color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Jobs', value: stats.jobs, icon: Briefcase, href: '/admin/jobs', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(s => (
          <Link key={s.label} href={s.href} className="rounded-xl border border-white/5 bg-dark-700 p-4 text-center hover:bg-dark-600 transition-colors">
            <s.icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
            <p className="text-2xl font-bold text-brand-primary">{s.value}</p>
            <p className="text-sm text-text-secondary">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/5 bg-dark-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/projects/new" className="px-3 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary text-sm hover:bg-brand-primary/20 transition-colors">New Project</Link>
            <Link href="/admin/courses/new" className="px-3 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary text-sm hover:bg-brand-primary/20 transition-colors">New Course</Link>
            <Link href="/admin/jobs/new" className="px-3 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary text-sm hover:bg-brand-primary/20 transition-colors">New Job</Link>
            <Link href="/admin/settings" className="px-3 py-1.5 rounded-lg bg-brand-primary/10 text-brand-primary text-sm hover:bg-brand-primary/20 transition-colors">Settings</Link>
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-dark-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-sm text-text-muted">No recent activity.</p>
        </div>
      </div>
    </div>
  )
}
