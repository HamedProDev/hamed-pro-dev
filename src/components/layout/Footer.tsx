import Link from 'next/link'
import { Github, Twitter, Linkedin, Youtube, Heart, Square } from 'lucide-react'

const footerLinks = {
  platform: [
    { label: 'Projects', href: '/projects' },
    { label: 'Courses', href: '/courses' },
    { label: 'Blog', href: '/blog' },
    { label: 'Jobs', href: '/jobs' },
  ],
  resources: [
    { label: 'Tools', href: '/tools' },
    { label: 'Open Source', href: '/open-source' },
    { label: 'Community', href: '/community' },
    { label: 'Newsletter', href: '/newsletter' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Hire Me', href: '/hire' },
    { label: 'CV', href: '/cv' },
  ],
}

const socials = [
  { icon: Github, href: 'https://github.com/hamedProDev', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/hamedProDev', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com/in/hamedProDev', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@hamedProDev', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-dark-500 bg-dark-900">
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-text-primary mb-4">
              <span className="h-6 w-6 relative flex items-center justify-center"><Square className="h-full w-full absolute text-brand-primary/20" /><span className="gradient-bg absolute w-3 h-3 rounded-sm rotate-45" /></span>
              <span>Hamed<span className="gradient-text">Pro</span>Dev</span>
            </Link>
            <p className="text-sm text-text-secondary mb-4">Building innovative solutions from Kigali, Rwanda.</p>
            <div className="flex gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-text-secondary hover:text-brand-primary hover:translate-x-0.5 transition-all duration-200 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-dark-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">© {new Date().getFullYear()} HamedProDev. All rights reserved.</p>
          <p className="text-sm text-text-muted flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by <span className="text-brand-primary font-semibold">Hamed Hussein</span> 🇷🇼
          </p>
        </div>
      </div>
    </footer>
  )
}
