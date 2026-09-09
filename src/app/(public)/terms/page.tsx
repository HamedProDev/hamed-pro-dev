import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Terms of Service',
  description: 'Terms of service for Hamed Hussein — acceptable use of the site, courses, and certificates.',
  url: '/terms',
})

const sections = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing this website, you agree to these terms. If you do not agree, please do not use the site.',
  },
  {
    title: 'Use of Content',
    body: 'Courses and other content are provided for personal learning. You may not redistribute, resell, or republish course content without written permission.',
  },
  {
    title: 'Certificates',
    body: 'Certificates are issued upon verified completion of a course and are intended to recognize learning. They do not constitute an academic degree or professional certification.',
  },
  {
    title: 'Accounts',
    body: 'You are responsible for keeping your login credentials secure and for the accuracy of the information you provide.',
  },
  {
    title: 'Limitation of Liability',
    body: 'The site and its content are provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of the site.',
  },
]

export default function TermsPage() {
  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-3xl">
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} />
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
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
