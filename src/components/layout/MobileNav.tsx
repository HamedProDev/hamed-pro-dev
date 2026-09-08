'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, LogIn, GraduationCap, Briefcase } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/courses', label: 'Courses' },
  { href: '/skills', label: 'Skills' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] p-0 border-l border-white/10 bg-[rgba(9,11,28,0.9)] backdrop-blur-2xl">
        <SheetHeader className="border-b border-white/10 p-4">
          <SheetTitle className="text-text-primary flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold">
              <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
                HH
              </span>
              Hamed<span className="gradient-text"> Hussein</span>
            </span>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary" aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                'px-4 py-3 rounded-full text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-white bg-blue-500/15 border border-blue-500/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 mt-auto space-y-2">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={onClose} className="block px-4 py-3 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5">
                Dashboard
              </Link>
              <Link href="/my-courses" onClick={onClose} className="block px-4 py-3 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5">
                My Courses
              </Link>
              <Link href="/certificates" onClick={onClose} className="block px-4 py-3 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5">
                Certificates
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin-control" onClick={onClose} className="block px-4 py-3 rounded-full text-sm font-medium text-blue-400 hover:bg-blue-500/10">
                  Admin Panel
                </Link>
              )}
              <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut(); onClose() }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="w-full gradient-bg">
                <Link href="/courses" onClick={onClose}><GraduationCap className="h-4 w-4 mr-2" /> Start Learning</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/hire" onClick={onClose}><Briefcase className="h-4 w-4 mr-2" /> Hire Me</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login" onClick={onClose}><LogIn className="h-4 w-4 mr-2" /> Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
