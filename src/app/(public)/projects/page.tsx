'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ExternalLink, Github, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

const categories = ['All', 'Web App', 'Mobile', 'AI/ML', 'Enterprise', 'Open Source']

const projects = [
  { title: 'FarmConnect', description: 'Digital marketplace connecting Rwandan farmers directly with buyers.', tech: ['Next.js', 'TypeScript', 'MongoDB'], category: 'Web App', gradient: 'from-green-600/30 via-dark-700 to-dark-800', featured: true, demoUrl: '#', sourceUrl: '#' },
  { title: 'Kwanda EMS', description: 'Enterprise management system for Kwanda Facility operations.', tech: ['Next.js', 'Express', 'PostgreSQL'], category: 'Enterprise', gradient: 'from-blue-600/30 via-indigo-700/20 to-dark-800', featured: true, demoUrl: '#', sourceUrl: '#' },
  { title: 'AI Health Assistant', description: 'ML-powered health screening tool for rural communities.', tech: ['Python', 'TensorFlow', 'React Native'], category: 'AI/ML', gradient: 'from-purple-600/30 via-pink-700/20 to-dark-800', featured: true, demoUrl: '#', sourceUrl: '#' },
  { title: 'EduConnect Platform', description: 'Learning management system for schools across Rwanda.', tech: ['React', 'Node.js', 'Supabase'], category: 'Web App', gradient: 'from-cyan-600/30 via-blue-700/20 to-dark-800', featured: false, demoUrl: '#', sourceUrl: '#' },
  { title: 'PaySmart Mobile', description: 'Mobile payment solution for small businesses in East Africa.', tech: ['React Native', 'Firebase', 'Stripe'], category: 'Mobile', gradient: 'from-amber-600/30 via-orange-700/20 to-dark-800', featured: false, demoUrl: '#', sourceUrl: '#' },
  { title: 'OpenDev CLI', description: 'Command-line tool for scaffolding fullstack projects.', tech: ['Go', 'TypeScript', 'Docker'], category: 'Open Source', gradient: 'from-teal-600/30 via-emerald-700/20 to-dark-800', featured: false, demoUrl: '#', sourceUrl: '#' },
]

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = projects.filter(p => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="section-padding">
      <div className="container-wide">
        {/* Header */}
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

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeCategory === cat ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary hover:text-text-primary border border-white/5'
            )}>{cat}</button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full card-hover group overflow-hidden">
                <div className={cn('h-48 rounded-t-xl bg-gradient-to-br relative', p.gradient)}>
                  {p.featured && <Badge className="absolute top-4 left-4 bg-green-500 text-white border-0 text-xs">Featured</Badge>}
                  <div className="absolute inset-4 rounded-lg bg-dark-900/40 border border-white/5 p-3">
                    <div className="h-2 w-16 bg-white/10 rounded mb-2" />
                    <div className="grid grid-cols-2 gap-2"><div className="h-10 bg-white/5 rounded" /><div className="h-10 bg-white/5 rounded" /></div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="outline" className="mb-3 text-xs">{p.category}</Badge>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors">{p.title}</h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tech.map(t => <Badge key={t} className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/20">{t}</Badge>)}
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <a href={p.demoUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"><ExternalLink className="h-3.5 w-3.5" /> Live Demo</a>
                    <a href={p.sourceUrl} target="_blank" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-brand-primary transition-colors"><Github className="h-3.5 w-3.5" /> GitHub</a>
                    <ArrowRight className="h-4 w-4 text-text-muted ml-auto group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-text-muted py-12">No projects found.</p>}
      </div>
    </div>
  )
}
