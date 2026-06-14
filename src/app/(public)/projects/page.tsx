'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ExternalLink, Github, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

const categories = ['All', 'large', 'mini', 'school']

const categoryLabels: Record<string, string> = {
  large: 'Web App',
  mini: 'Mini Project',
  school: 'School Project',
}

const gradients = [
  'from-green-600/30 via-surface-card to-surface-secondary',
  'from-blue-600/30 via-indigo-700/20 to-surface-secondary',
  'from-purple-600/30 via-pink-700/20 to-surface-secondary',
  'from-cyan-600/30 via-blue-700/20 to-surface-secondary',
  'from-amber-600/30 via-orange-700/20 to-surface-secondary',
  'from-teal-600/30 via-emerald-700/20 to-surface-secondary',
]

interface Project {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  techStack: string[]
  featured: boolean
  status: string
  demoUrl?: string
  sourceUrl?: string
  coverImage?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (activeCategory !== 'All') params.set('category', activeCategory)
    if (search) params.set('search', search)
    params.set('limit', '50')

    fetch(`/api/projects?${params}`)
      .then(r => r.json())
      .then(d => { setProjects(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeCategory, search])

  const filtered = projects.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <div className="section-padding">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Featured <span className="gradient-text">Projects</span></h1>
            <p className="text-text-secondary">Explore my portfolio of web applications, mobile apps, and AI/ML projects.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeCategory === cat ? 'bg-brand-primary text-white' : 'bg-surface-card text-text-secondary hover:text-text-primary border border-border-primary'
            )}>{cat === 'All' ? 'All' : categoryLabels[cat] || cat}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full card-hover group overflow-hidden">
                  <div className={cn('h-48 rounded-t-xl bg-gradient-to-br relative', gradients[i % gradients.length])}>
                    {p.coverImage ? (
                      <img src={p.coverImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-4 rounded-lg bg-dark-900/40 border border-border-primary p-3">
                        <div className="h-2 w-16 bg-surface-tertiary rounded mb-2" />
                        <div className="grid grid-cols-2 gap-2"><div className="h-10 bg-surface-tertiary/50 rounded" /><div className="h-10 bg-surface-tertiary/50 rounded" /></div>
                      </div>
                    )}
                    {p.featured && <Badge className="absolute top-4 left-4 bg-green-500 text-white border-0 text-xs z-10">Featured</Badge>}
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3 text-xs">{categoryLabels[p.category] || p.category}</Badge>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors">{p.title}</h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {(p.techStack || []).slice(0, 4).map((t: string) => <Badge key={t} className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/20">{t}</Badge>)}
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-border-primary">
                      {p.demoUrl && <a href={p.demoUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"><ExternalLink className="h-3.5 w-3.5" /> Live Demo</a>}
                      {p.sourceUrl && <a href={p.sourceUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"><Github className="h-3.5 w-3.5" /> GitHub</a>}
                      <ArrowRight className="h-4 w-4 text-text-muted ml-auto group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted mb-4">No projects yet.</p>
            <p className="text-sm text-text-muted">Projects will appear here once added from the admin panel.</p>
          </div>
        )}
      </div>
    </div>
  )
}
