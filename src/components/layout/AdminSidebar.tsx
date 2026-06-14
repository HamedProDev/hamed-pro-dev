'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard, FolderOpen, GraduationCap, FileText, Briefcase,
  Users, Image, Search, UserCircle, Mail, Settings, ChevronLeft, ChevronRight,
  Zap, Trophy
} from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/about', label: 'About Page', icon: UserCircle },
  { href: '/admin/email', label: 'Email', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn('sticky top-16 h-[calc(100vh-4rem)] border-r border-dark-500 bg-dark-800 transition-all', collapsed ? 'w-16' : 'w-60')}>
      <nav className="flex flex-col p-2 gap-1">
        {links.map(link => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-blue-500/10 text-blue-400' : 'text-text-secondary hover:bg-dark-700 hover:text-text-primary',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-text-muted hover:text-text-primary"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}
