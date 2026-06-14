'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard, FolderOpen, GraduationCap, FileText, Briefcase,
  Users, Search, UserCircle, Mail, Settings, ChevronLeft, ChevronRight,
  Zap, Trophy, LogOut
} from 'lucide-react'
import { useState } from 'react'
import { useAdminAuth } from '@/components/admin/AdminGate'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
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
    <aside className={cn('sticky top-16 h-[calc(100vh-4rem)] border-r border-border-primary bg-surface-secondary transition-all flex flex-col', collapsed ? 'w-16' : 'w-60')}>
      <nav className="flex flex-col p-2 gap-1 flex-1 overflow-y-auto">
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
      <div className="border-t border-border-primary p-2 flex flex-col gap-1">
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
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium w-full text-text-muted hover:text-text-primary hover:bg-surface-tertiary transition-colors',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5 shrink-0" /> : <ChevronLeft className="h-5 w-5 shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
