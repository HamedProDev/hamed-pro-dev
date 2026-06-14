'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(d => {
      if (d.success) {
        const found = d.data.find((p: any) => p.slug === slug || p._id === slug)
        if (found) setPost(found)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  if (!post) return (
    <div className="section-padding text-center">
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <Button asChild><Link href="/blog">Back to Blog</Link></Button>
    </div>
  )

  return (
    <div className="section-padding pt-24">
      <div className="container-wide max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-6"><ArrowLeft className="h-4 w-4" /> Back to Blog</Link>
        {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />}
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">{post.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-text-muted"><Eye className="h-3 w-3" /> {post.views || 0}</span>
          <span className="flex items-center gap-1 text-xs text-text-muted"><Calendar className="h-3 w-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
        {post.excerpt && <p className="text-lg text-text-secondary mb-8">{post.excerpt}</p>}
        <div className="prose prose-invert max-w-none">
          {post.content ? (
            <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">{post.content}</div>
          ) : (
            <p className="text-text-muted">No content available.</p>
          )}
        </div>
      </div>
    </div>
  )
}
