import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
export const metadata: Metadata = generateSEOMetadata({ title: 'About', description: 'Learn about Hamed Hussein — Fullstack & AI/ML Engineer based in Kigali, Rwanda.', url: '/about' })

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-wide max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p className="text-text-secondary mb-8">Fullstack & AI/ML Engineer based in Kigali, Rwanda. Building innovative solutions for Africa and beyond.</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-dark-500 bg-dark-700 p-6"><h2 className="text-xl font-semibold mb-4">Experience</h2><p className="text-text-secondary text-sm">5+ years building web and mobile applications.</p></div>
          <div className="rounded-xl border border-dark-500 bg-dark-700 p-6"><h2 className="text-xl font-semibold mb-4">Education</h2><p className="text-text-secondary text-sm">Computer Science degree with focus on AI/ML.</p></div>
        </div>
      </div>
    </div>
  )
}
