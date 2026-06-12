import Link from 'next/link'
import { Code2, Github, Twitter, Linkedin, Youtube, Heart } from 'lucide-react'

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
              <Code2 className="h-6 w-6 text-brand-primary" />
              <span>Hamed<span className="text-brand-primary">Pro</span></span>
            </Link>
            <p className="text-sm text-text-secondary mb-4">Building innovative solutions from Kigali, Rwanda.</p>
            <div className="flex gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-brand-primary transition-colors">
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">{title}</h3>
              <ul className="space-y-2">
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
        </div>

        <div className="mt-12 pt-8 border-t border-dark-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">© {new Date().getFullYear()} HamedProDev. All rights reserved.</p>
          <p className="text-sm text-text-muted flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> in Kigali, Rwanda
          </p>
        </div>
      </div>
    </footer>
  )
}
