'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

const categoryConfig: Record<string, { color: string; gradient: string; icon: string }> = {
  Backend: { color: 'bg-blue-500 text-white', gradient: 'from-blue-600/40 via-blue-800/30 to-surface-secondary', icon: 'N' },
  Frontend: { color: 'bg-cyan-500 text-white', gradient: 'from-cyan-600/40 via-cyan-800/30 to-surface-secondary', icon: 'F' },
  'AI/ML': { color: 'bg-purple-500 text-white', gradient: 'from-purple-600/40 via-purple-800/30 to-surface-secondary', icon: '🤖' },
  Career: { color: 'bg-green-500 text-white', gradient: 'from-green-600/40 via-green-800/30 to-surface-secondary', icon: '🚀' },
  DevOps: { color: 'bg-orange-500 text-white', gradient: 'from-orange-600/40 via-orange-800/30 to-surface-secondary', icon: '⚙' },
  Mobile: { color: 'bg-pink-500 text-white', gradient: 'from-pink-600/40 via-pink-800/30 to-surface-secondary', icon: '📱' },
}

interface Post {
  title: string
  slug: string
  excerpt: string
  category: string
  readingTime: number
  coverImage: string
  publishedAt: string
}

const fallbackPosts = [
  { title: 'Building Scalable APIs with Next.js', category: 'Backend', excerpt: 'A deep dive into production-ready API architecture.', readingTime: 8, slug: 'scalable-apis-nextjs', coverImage: '', publishedAt: '2024-05-30' },
  { title: 'AI in Agriculture in Rwanda', category: 'AI/ML', excerpt: 'Exploring real-world ML applications in agriculture.', readingTime: 6, slug: 'ai-agriculture-rwanda', coverImage: '', publishedAt: '2024-05-15' },
  { title: 'Complete Guide to Fullstack Dev', category: 'Career', excerpt: 'Everything to become a fullstack developer in 2024.', readingTime: 12, slug: 'complete-guide-fullstack', coverImage: '', publishedAt: '2024-05-10' },
]

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>(fallbackPosts)
  useEffect(() => {
    fetch('/api/blog?limit=3')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setPosts(d.data.map((p: any) => ({ ...p, publishedAt: p.publishedAt || p.createdAt }))) })
      .catch(() => {})
  }, [])

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Latest from the Blog</h2>
            <p className="text-text-secondary mt-2">Tutorials, insights, and updates</p>
          </div>
          <motion.div whileHover={{ x: 4 }}>
            <Button variant="ghost" asChild>
              <Link href="/blog">View all posts <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full group overflow-hidden border-border-primary hover:border-blue-500/20 transition-all duration-300">
                  <div className={cn('h-48 rounded-t-xl bg-gradient-to-br relative flex items-center justify-center overflow-hidden', categoryConfig[post.category]?.gradient || 'from-blue-600/40 via-blue-800/30 to-surface-secondary')}>
                    <motion.span
                      className="text-5xl opacity-50"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {categoryConfig[post.category]?.icon || '📝'}
                    </motion.span>
                    <Badge className={cn('absolute top-4 left-4 border-0 text-xs z-10', categoryConfig[post.category]?.color || 'bg-blue-500 text-white')}>
                      {post.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-text-muted pt-4 border-t border-border-primary">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime} min read</span>
                      {post.publishedAt && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.publishedAt)}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
