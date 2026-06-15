import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
export const metadata: Metadata = generateSEOMetadata({ title: 'Open Source', description: 'My open source contributions, repositories, and projects.', url: '/open-source' })

export default function OpenSourcePage() {
  return (
    <main id="main-content" className="section-padding">
      <div className="container-wide">
        <Breadcrumbs items={[{ label: 'Open Source' }]} />
        <h1 className="text-4xl font-bold mb-4">Open Source</h1>
        <p className="text-text-secondary mb-8">My contributions to the open source community.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-xl border border-dark-500 bg-dark-700 p-6 card-hover">
              <h3 className="text-lg font-semibold mb-2">repo-name-{i}</h3>
              <p className="text-sm text-text-secondary mb-3">Repository description goes here.</p>
              <div className="flex gap-4 text-xs text-text-muted"><span>⭐ 42</span><span>🍴 12</span><span>TypeScript</span></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
