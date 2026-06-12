'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { MobileNav } from './MobileNav'
import { UserMenu } from './UserMenu'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/courses', label: 'Courses' },
  { href: '/jobs', label: 'Get Job' },
  { href: '/startups', label: 'Startups / Orgs' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-dark-900/80 backdrop-blur-xl">
        <div className="container-wide flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-text-primary">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-sm font-bold">HP</span>
            <span>Hamed<span className="text-brand-primary">Pro</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1 text-xs text-text-secondary mr-1">
              🇬🇧 EN
            </span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              {mounted ? (theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <div className="h-4 w-4" />}
            </button>
            <Button asChild className="hidden md:flex gradient-bg text-white hover:shadow-lg hover:shadow-brand-primary/30 transition-all duration-200">
              <Link href="/hire">Hire Me</Link>
            </Button>
            <div className="hidden md:block ml-1">
              <UserMenu />
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
