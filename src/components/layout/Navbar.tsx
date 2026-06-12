'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Square } from 'lucide-react' // Changed Code2 to Square
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { MobileNav } from './MobileNav'
import { UserMenu } from './UserMenu'
import { cn } from '@/lib/utils/cn'

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/courses', label: 'Courses' },
  { href: '/blog', label: 'Blog' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-dark-500/50 bg-dark-900/80 backdrop-blur-xl">
        <div className="container-wide flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-text-primary">
            <span className="h-6 w-6 relative flex items-center justify-center"><Square className="h-full w-full absolute text-brand-primary/20" /><span className="gradient-bg absolute w-3 h-3 rounded-sm rotate-45"></span></span>
            <span>Hamed<span className="gradient-text">Pro</span>Dev</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-brand-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-dark-600',
                  (pathname === link.href || pathname.startsWith(link.href + '/')) && 'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-brand-primary after:rounded-full' // Active link underline
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
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
