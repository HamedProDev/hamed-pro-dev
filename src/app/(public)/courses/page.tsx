import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
export const metadata: Metadata = generateSEOMetadata({ title: 'Courses', description: 'Free and premium courses on web development, AI/ML, and more.', url: '/courses' })

export default function CoursesPage() {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="text-4xl font-bold mb-4">Courses</h1>
        <p className="text-text-secondary mb-8">Learn web development, AI/ML, and more with hands-on courses.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-xl border border-dark-500 bg-dark-700 p-6 card-hover">
              <div className="h-40 bg-dark-600 rounded-lg mb-4" />
              <h3 className="text-lg font-semibold mb-2">Course {i}</h3>
              <p className="text-sm text-text-secondary">Course description.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
