import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return { title: params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="section-padding">
      <div className="container-wide max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 capitalize">{params.slug.replace(/-/g, ' ')}</h1>
        <p className="text-text-secondary">Blog post content will be loaded from MongoDB.</p>
      </div>
    </div>
  )
}
