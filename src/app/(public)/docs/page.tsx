import type { Metadata } from 'next'
import Link from 'next/link'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { BookOpen, FolderGit2, GraduationCap, Mail, ShieldCheck, User } from 'lucide-react'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Documentation',
  description: 'Getting started guide for the Hamed Hussein developer platform — portfolio, courses, and certificates.',
  url: '/docs',
})

const sections = [
  {
    icon: BookOpen,
    title: 'For Learners',
    href: '/courses',
    items: [
      'Create an account to enroll in free courses.',
      'Complete lessons and quizzes to track your progress.',
      'Finish a course to earn a verifiable certificate.',
      'View and share your certificates from the My Certificates page.',
    ],
  },
  {
    icon: FolderGit2,
    title: 'For Employers & Clients',
    href: '/projects',
    items: [
      'Browse the portfolio to see past projects and work.',
      'Read the About page for experience and education.',
      'Use the Hire Me page to explore services and pricing.',
      'Reach out via the contact form for project inquiries.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Verify a Certificate',
    href: '/verify',
    items: [
      'Every certificate has a unique certificate number.',
      'Open the Verify page and enter the number.',
      'Valid certificates show the recipient, course, and issue date.',
    ],
  },
  {
    icon: Mail,
    title: 'Newsletter',
    href: '/newsletter',
    items: [
      'Subscribe to receive weekly insights on web development and AI/ML.',
      'Unsubscribe at any time via the link in each email.',
    ],
  },
  {
    icon: User,
    title: 'Account & Profile',
    href: '/profile',
    items: [
      'Sign in to access your dashboard.',
      'Update your name and bio from the Profile page.',
      'View enrolled courses and earned certificates from the dashboard.',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Admin Panel',
    href: '/admin-control',
    items: [
      'Administrators manage all content from the admin panel.',
      'Protected by a PIN and password gate.',
    ],
  },
]

export default function DocsPage() {
  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-4xl">
        <Breadcrumbs items={[{ label: 'Documentation' }]} />
        <h1 className="text-4xl font-bold mb-2">Documentation</h1>
        <p className="text-text-secondary mb-8">Everything you need to know about using this platform.</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {sections.map(s => (
            <Card key={s.title} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-brand-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">{s.title}</h2>
                </div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {s.items.map(item => (
                    <li key={item} className="flex gap-2"><span className="text-brand-primary">•</span>{item}</li>
                  ))}
                </ul>
                <Link href={s.href} className="inline-block mt-4 text-sm text-brand-primary hover:underline">
                  Go to {s.title} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
