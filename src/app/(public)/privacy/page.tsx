import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for Hamed Hussein — how your data is collected, used, and protected.',
  url: '/privacy',
})

const sections = [
  {
    title: 'Information We Collect',
    body: 'When you sign up, subscribe to the newsletter, or submit the contact form, we collect the information you provide — such as your name, email address, and message content. We also collect basic analytics (page views) to understand how the site is used.',
  },
  {
    title: 'How We Use Your Information',
    body: 'We use your information to respond to inquiries, deliver the newsletter, manage your account and course progress, and issue certificates. We do not sell or rent your personal information to third parties.',
  },
  {
    title: 'Cookies & Analytics',
    body: 'We use essential cookies for authentication and preferences (e.g. theme). Anonymous analytics help us improve the site. You can clear cookies at any time from your browser.',
  },
  {
    title: 'Data Storage',
    body: 'Data is stored securely in Supabase (PostgreSQL) with row-level security enabled. Your profile and course progress are accessible only to you and, where required, the site administrator.',
  },
  {
    title: 'Your Rights',
    body: 'You may request a copy, correction, or deletion of your personal data at any time by contacting us via the contact page. Newsletter emails include an unsubscribe link.',
  },
]

export default function PrivacyPage() {
  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-3xl">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-text-secondary mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        <div className="space-y-4">
          {sections.map(s => (
            <Card key={s.title} className="card-hover">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-2">{s.title}</h2>
                <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
