'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'

const categoryConfig: Record<string, { color: string; gradient: string }> = {
  Backend: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', gradient: 'from-blue-700/40 via-dark-700 to-dark-800' },
  'AI/ML': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', gradient: 'from-purple-700/40 via-dark-700 to-dark-800' },
  Career: { color: 'bg-green-500/20 text-green-400 border-green-500/30', gradient: 'from-green-700/40 via-dark-700 to-dark-800' },
}

const posts = [
  { title: 'Building Scalable APIs with Next.js', category: 'Backend', excerpt: 'A deep dive into production-ready APIs...', readingTime: 8, slug: 'scalable-apis-nextjs' },
  { title: 'AI in Agriculture in Rwanda', category: 'AI/ML', excerpt: 'Exploring real-world ML applications...', readingTime: 12, slug: 'ai-agriculture-rwanda' },
  { title: 'Complete Guide to Fullstack Dev', category: 'Career', excerpt: 'Everything to become a fullstack developer...', readingTime: 15, slug: 'complete-guide-fullstack' },
]

export function LatestPosts() {
  return (
    <section className="section-padding bg-dark-800/30">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-10">
          <div><h2 className="text-3xl font-bold">Latest from the Blog</h2><p className="text-text-secondary mt-2">Tutorials, insights, and updates</p></div>
          <Button variant="ghost" asChild><Link href="/blog">Read All <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/blog/${post.slug}`}>
                <Card className="h-full card-hover">
                  <div className={cn('h-48 rounded-t-xl bg-gradient-to-br', categoryConfig[post.category]?.gradient || 'from-dark-700 to-dark-800')} />
                  <CardContent className="p-6">
                    <Badge variant="outline" className={cn('mb-3', categoryConfig[post.category]?.color)}>{post.category}</Badge>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-text-muted pt-4 border-t border-dark-500">
                      <Clock className="h-3 w-3 mr-1" /> {post.readingTime} min read
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
