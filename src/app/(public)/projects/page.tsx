import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
export const metadata: Metadata = generateSEOMetadata({ title: 'Projects', description: 'Explore my portfolio of fullstack projects — from large enterprise systems to mini tools and school projects.', url: '/projects' })

export default function ProjectsPage() {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-text-secondary mb-8">Explore my portfolio of web applications, mobile apps, and AI/ML projects.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="rounded-xl border border-dark-500 bg-dark-700 p-6 card-hover">
              <div className="h-40 bg-dark-600 rounded-lg mb-4" />
              <h3 className="text-lg font-semibold mb-2">Project {i}</h3>
              <p className="text-sm text-text-secondary">Project description goes here.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
