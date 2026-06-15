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
  'from-blue-600/30 via-purple-600/20 to-surface-secondary',
  'from-indigo-600/30 via-blue-600/20 to-surface-secondary',
  'from-cyan-600/30 via-blue-600/20 to-surface-secondary',
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
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) return null

  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <p className="text-text-secondary mt-2">Some of my best work</p>
          </div>
          <motion.div whileHover={{ x: 4 }}>
            <Button variant="ghost" asChild>
              <Link href="/projects">View all projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8 }}
            >
                <Card className="h-full group overflow-hidden border-border-primary hover:border-blue-500/30 transition-all duration-300">
                <div className={cn('h-52 rounded-t-xl bg-gradient-to-br relative overflow-hidden', gradients[i % gradients.length])}>
                  {p.coverImage ? (
                    <img src={p.coverImage} alt={`${p.title} project screenshot`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-dark-900/40 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-4 rounded-lg bg-surface-card/40 border border-border-primary p-3">
                        <div className="h-2 w-16 bg-white/10 rounded mb-2" />
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-12 bg-white/5 rounded" />
                          <div className="h-12 bg-white/5 rounded" />
                          <div className="h-12 bg-white/5 rounded" />
                        </div>
                        <div className="mt-2 h-8 bg-white/5 rounded" />
                      </div>
                    </>
                  )}
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white border-0 text-xs z-10">Featured</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors duration-300">{p.title}</h3>
                  <p className="text-sm text-text-secondary mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(p.techStack || []).map((t: string) => (
                      <Badge key={t} className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20 font-medium">{t}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-border-primary">
                    {p.demoUrl && <a href={p.demoUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-blue-400 transition-colors"><ExternalLink className="h-3.5 w-3.5" /> Live Demo</a>}
                    {p.sourceUrl && <a href={p.sourceUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-blue-400 transition-colors"><Github className="h-3.5 w-3.5" /> GitHub</a>}
                    <motion.div className="ml-auto">
                      <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                    </motion.div>
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
