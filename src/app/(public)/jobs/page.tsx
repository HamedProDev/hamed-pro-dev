import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
export const metadata: Metadata = generateSEOMetadata({ title: 'Jobs Board', description: 'Tech job opportunities in Rwanda and remote positions for developers.', url: '/jobs' })

export default function JobsPage() {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="text-4xl font-bold mb-4">Jobs Board</h1>
        <p className="text-text-secondary mb-8">Find tech opportunities in Rwanda and beyond.</p>
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="rounded-xl border border-dark-500 bg-dark-700 p-6 card-hover">
              <h3 className="text-lg font-semibold mb-2">Job Title {i}</h3>
              <p className="text-sm text-text-secondary">Company — Location • Remote</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
