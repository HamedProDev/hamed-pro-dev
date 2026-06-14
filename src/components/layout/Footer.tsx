'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'

const socialIconConfig: Record<string, { bg: string; hoverShadow: string; label: string }> = {
  github: { bg: 'bg-[#24292e]', hoverShadow: 'hover:shadow-[#24292e]/40', label: 'GitHub' },
  devto: { bg: 'bg-[#0a0a0a]', hoverShadow: 'hover:shadow-[#0a0a0a]/40', label: 'Dev.to' },
  linkedin: { bg: 'bg-[#0077B5]', hoverShadow: 'hover:shadow-[#0077B5]/40', label: 'LinkedIn' },
  email: { bg: 'bg-[#EA4335]', hoverShadow: 'hover:shadow-[#EA4335]/40', label: 'Email' },
  facebook: { bg: 'bg-[#1877F2]', hoverShadow: 'hover:shadow-[#1877F2]/40', label: 'Facebook' },
  instagram: { bg: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]', hoverShadow: 'hover:shadow-[#DD2A7B]/40', label: 'Instagram' },
  whatsapp: { bg: 'bg-[#25D366]', hoverShadow: 'hover:shadow-[#25D366]/40', label: 'WhatsApp' },
  phone: { bg: 'bg-[#3B82F6]', hoverShadow: 'hover:shadow-[#3B82F6]/40', label: 'Phone' },
  discord: { bg: 'bg-[#5865F2]', hoverShadow: 'hover:shadow-[#5865F2]/40', label: 'Discord' },
  twitter: { bg: 'bg-[#1DA1F2]', hoverShadow: 'hover:shadow-[#1DA1F2]/40', label: 'Twitter' },
  codepen: { bg: 'bg-[#1E1F1E]', hoverShadow: 'hover:shadow-[#1E1F1E]/40', label: 'CodePen' },
  gitlab: { bg: 'bg-[#FC6D26]', hoverShadow: 'hover:shadow-[#FC6D26]/40', label: 'GitLab' },
  kaggle: { bg: 'bg-[#20BEFF]', hoverShadow: 'hover:shadow-[#20BEFF]/40', label: 'Kaggle' },
  hackerrank: { bg: 'bg-[#2EC866]', hoverShadow: 'hover:shadow-[#2EC866]/40', label: 'HackerRank' },
  website: { bg: 'bg-[#374151]', hoverShadow: 'hover:shadow-[#374151]/40', label: 'Website' },
  stackoverflow: { bg: 'bg-[#F48024]', hoverShadow: 'hover:shadow-[#F48024]/40', label: 'StackOverflow' },
}

const svgIcons: Record<string, string> = {
  github: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
  gitlab: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M12 0L5.866 18.75h12.268L12 0zM7.464 18.75L5.137 12.188 3.268 18.75H7.464zM20.732 18.75H16.536l4.196-6.562L20.732 18.75zM14.395 18.75H9.605L12 13.438 14.395 18.75z"/></svg>`,
}

interface Settings {
  siteName?: string
  location?: string
  socialLinks?: Record<string, string>
}

export function Footer() {
  const [settings, setSettings] = useState<Settings>({})

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success) setSettings(d.data)
      })
      .catch(() => {})
  }, [])

  const socialLinks: Record<string, string> = settings.socialLinks || {}
  const activeSocials = Object.entries(socialLinks).filter(
    ([, url]) => url && typeof url === 'string' && url.trim()
  )

  const footerLinks = {
    platform: [
      { label: 'Projects', href: '/projects' },
      { label: 'Courses', href: '/courses' },
      { label: 'Get Job', href: '/jobs' },
      { label: 'Startups / Orgs', href: '/startups' },
      { label: 'Skills', href: '/skills' },
      { label: 'Achievements', href: '/achievements' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Open Source', href: '/open-source' },
      { label: 'Community', href: '/community' },
      { label: 'Newsletter', href: '/newsletter' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Hire Me', href: '/hire' },
    ],
  }

  return (
    <footer className="border-t border-border-primary bg-surface-secondary">
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-text-primary mb-4"
            >
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                HP
              </span>
              <span>
                Hamed<span className="text-blue-500">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary mb-3">
              Building innovative solutions from {settings.location || 'Kigali, Rwanda'}.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-green-500 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Available for freelance projects
            </div>

            {activeSocials.length > 0 && (
              <div className="flex gap-2.5 flex-wrap mt-2">
                {activeSocials.map(([key, url]) => {
                  const config = socialIconConfig[key] || socialIconConfig.website
                  const svg = svgIcons[key]
                  return (
                    <motion.a
                      key={key}
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={config.label}
                      whileHover={{ scale: 1.2, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center justify-center h-10 w-10 rounded-full ${config.bg} text-white shadow-md shadow-transparent hover:shadow-lg ${config.hoverShadow}`}
                    >
                      {svg ? (
                        <span dangerouslySetInnerHTML={{ __html: svg }} />
                      ) : (
                        <span className="text-sm font-bold uppercase">{key[0]}</span>
                      )}
                    </motion.a>
                  )
                })}
              </div>
            )}
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-blue-500 transition-all duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Location
            </h3>
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-text-secondary">
                  {settings.location || 'Kigali, Rwanda'}
                </p>
                <p className="text-xs text-text-muted">UTC +2</p>
              </div>
            </div>
            <div className="h-20 rounded-lg bg-surface-tertiary border border-border-primary overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-primary flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} {settings.siteName || 'HamedProDev'}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/privacy" className="hover:text-text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-text-secondary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
