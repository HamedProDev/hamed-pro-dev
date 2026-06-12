'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Github, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

const gradients = [
  'from-blue-600/30 via-purple-600/20 to-dark-800',
  'from-indigo-600/30 via-blue-600/20 to-dark-800',
  'from-green-600/30 via-emerald-600/20 to-dark-800',
]

export function FeaturedProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects?featured=true&limit=3')
      .then(r => r.json())
      .then(d => { setProjects(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-10">
            <div><h2 className="text-3xl font-bold">Featured Projects</h2><p className="text-text-secondary mt-2">Some of my best work</p></div>
            <Button variant="ghost" asChild><Link href="/projects">View all <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) return null

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <p className="text-text-secondary mt-2">Some of my best work</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/projects">View all projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full card-hover group overflow-hidden">
                <div className={cn('h-52 rounded-t-xl bg-gradient-to-br relative', gradients[i % gradients.length])}>
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white border-0 text-xs">Featured</Badge>
                  <div className="absolute inset-4 rounded-lg bg-dark-900/40 border border-white/5 p-3">
                    <div className="h-2 w-16 bg-white/10 rounded mb-2" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-12 bg-white/5 rounded" />
                      <div className="h-12 bg-white/5 rounded" />
                      <div className="h-12 bg-white/5 rounded" />
                    </div>
                    <div className="mt-2 h-8 bg-white/5 rounded" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-text-secondary mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(p.techStack || []).map((t: string) => (
                      <Badge key={t} className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/20 font-medium">{t}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    {p.demoUrl && <a href={p.demoUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"><ExternalLink className="h-3.5 w-3.5" /> Live Demo</a>}
                    {p.sourceUrl && <a href={p.sourceUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"><Github className="h-3.5 w-3.5" /> GitHub</a>}
                    <ArrowRight className="h-4 w-4 text-text-muted ml-auto group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
