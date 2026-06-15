'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, Loader2, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  category: string
  coverImage?: string
  views: number
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(d => {
      if (d.success) setPosts(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide">
        <MetadataInjector title="Blog" description="Thoughts, tutorials, and insights on web development, AI/ML, and technology by Hamed Hussein." url="/blog" />
        <Breadcrumbs items={[{ label: 'Blog' }]} />
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-text-secondary text-lg">Thoughts, tutorials, and insights on development.</p>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-text-muted py-12">No blog posts yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map(p => (
              <Link key={p._id} href={`/blog/${p.slug || p._id}`}>
                <Card className="card-hover h-full overflow-hidden">
                  {p.coverImage && <img src={p.coverImage} alt={`${p.title} blog cover`} loading="lazy" className="w-full h-48 object-cover" />}
                  <CardContent className="p-5">
                    <Badge className="mb-2 text-xs">{p.category}</Badge>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{p.title}</h3>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">{p.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views || 0}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
