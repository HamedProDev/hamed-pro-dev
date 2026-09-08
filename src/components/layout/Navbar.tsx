'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Moon, Sun, LogIn } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { MobileNav } from './MobileNav'
import { UserMenu } from './UserMenu'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

const publicLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/courses', label: 'Courses' },
  { href: '/skills', label: 'Skills' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const studentLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/certification', label: 'Certification' },
  { href: '/invite', label: 'Invite' },
  { href: '/dashboard', label: 'Dashboard' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { isAuthenticated } = useAuth()

  useEffect(() => setMounted(true), [])

  const navLinks = isAuthenticated ? studentLinks : publicLinks

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        <div className="relative border-b border-border-primary bg-surface-primary/60 backdrop-blur-2xl">
          {/* glowing underline */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
          <div className="container-wide flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-text-primary">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30">
                HH
              </span>
              <span>
                Hamed<span className="gradient-text"> Hussein</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-sm font-medium transition-all',
                    pathname === link.href || pathname.startsWith(link.href + '/')
                      ? 'text-brand-primary bg-brand-primary/10 border border-brand-primary/30 shadow-[0_0_20px_rgba(79,124,255,0.25)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-8 w-8 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all"
                aria-label="Toggle theme"
              >
                {mounted ? (theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <div className="h-4 w-4" />}
              </button>

              {isAuthenticated ? (
                <div className="hidden md:block ml-1">
                  <UserMenu />
                </div>
              ) : (
                <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
                  <Link href="/login"><LogIn className="h-4 w-4 mr-1.5" /> Sign in</Link>
                </Button>
              )}

              <Button variant="outline" size="sm" asChild className="hidden md:inline-flex hover:shadow-glow-sm">
                <Link href="/hire">Hire Me</Link>
              </Button>

              {!isAuthenticated && (
                <Button size="sm" asChild className="hidden md:inline-flex gradient-bg">
                  <Link href="/courses">Start Learning</Link>
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
