'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { signOut } from 'next-auth/react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/courses', label: 'Courses' },
  { href: '/jobs', label: 'Get Job' },
  { href: '/startups', label: 'Startups / Orgs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[280px] p-0">
        <SheetHeader className="border-b border-white/5 p-4">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-brand-primary bg-brand-primary/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-dark-600'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/5 p-4 mt-auto">
          {isAuthenticated ? (
            <div className="space-y-2">
              <Link href="/dashboard" onClick={onClose} className="block px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-dark-600">
                Dashboard
              </Link>
              <Link href="/my-courses" onClick={onClose} className="block px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-dark-600">
                My Courses
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" onClick={onClose} className="block px-4 py-3 rounded-lg text-sm font-medium text-brand-primary hover:bg-brand-primary/10">
                  Admin Panel
                </Link>
              )}
              <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut({ callbackUrl: '/' }); onClose() }}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button asChild className="w-full gradient-bg text-white">
                <Link href="/register" onClick={onClose}><UserPlus className="h-4 w-4 mr-2" /> Sign Up</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login" onClick={onClose}><LogIn className="h-4 w-4 mr-2" /> Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
