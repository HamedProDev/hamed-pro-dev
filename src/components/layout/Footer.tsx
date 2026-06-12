import Link from 'next/link'
import { Github, Twitter, Linkedin, Youtube, MapPin } from 'lucide-react'

const footerLinks = {
  platform: [
    { label: 'Projects', href: '/projects' },
    { label: 'Courses', href: '/courses' },
    { label: 'Get Job', href: '/jobs' },
    { label: 'Startups / Orgs', href: '/startups' },
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

const socials = [
  { icon: Github, href: 'https://github.com/HamedProDev', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/hamedProDev', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com/hamedProDev', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/@hamedProDev', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900">
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-text-primary mb-4">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-sm font-bold">HP</span>
              <span>Hamed<span className="text-brand-primary">Pro</span></span>
            </Link>
            <p className="text-sm text-text-secondary mb-3">Building innovative solutions from Kigali, Rwanda.</p>
            <div className="inline-flex items-center gap-1.5 text-xs text-green-400 mb-4">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" /></span>
              Available for freelance projects
            </div>
            <div className="flex gap-2">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 text-text-muted hover:bg-brand-primary/20 hover:text-brand-primary transition-all duration-200">
                  <s.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-text-secondary hover:text-brand-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Location</h3>
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="h-4 w-4 text-brand-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-text-secondary">Kigali, Rwanda</p>
                <p className="text-xs text-text-muted">UTC +2</p>
              </div>
            </div>
            {/* Mini map placeholder */}
            <div className="h-20 rounded-lg bg-dark-700 border border-white/5 overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              </div>
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.1) 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">© {new Date().getFullYear()} HamedProDev. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/privacy" className="hover:text-text-secondary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-text-secondary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
