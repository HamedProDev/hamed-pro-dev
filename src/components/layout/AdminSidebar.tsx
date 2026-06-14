'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard, FolderOpen, GraduationCap, FileText, Briefcase,
  Users, Image, Search, UserCircle, Mail, Settings, ChevronLeft, ChevronRight,
  Zap, Trophy, LogOut
} from 'lucide-react'
import { useState } from 'react'
import { useAdminAuth } from '@/components/admin/AdminGate'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/about', label: 'About Page', icon: UserCircle },
  { href: '/admin/email', label: 'Email', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { lock } = useAdminAuth()

  return (
    <aside className={cn('sticky top-16 h-[calc(100vh-4rem)] border-r border-border-primary bg-surface-secondary transition-all', collapsed ? 'w-16' : 'w-60')}>
      <nav className="flex flex-col p-2 gap-1">
        {links.map(link => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-blue-500/10 text-blue-500' : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary',
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
      <div className="absolute bottom-12 left-0 w-full px-2">
        <button
          onClick={lock}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium w-full text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Lock Admin' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Lock Admin</span>}
        </button>
      </div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-text-muted hover:text-text-primary"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}
