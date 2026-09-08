'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, Clock, BarChart3, Loader2, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { SectionHeading } from '@/components/shared/SectionHeading'

const categories = ['All Courses', 'Frontend', 'Backend', 'AI / ML', 'Mobile', 'DevOps', 'Game Dev']
const levels = ['All Levels', 'beginner', 'intermediate', 'advanced']

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  category: string
  level: string
  duration: string
  image_url?: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All Courses')
  const [activeLevel, setActiveLevel] = useState('All Levels')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (activeCategory !== 'All Courses') params.set('category', activeCategory)
    if (activeLevel !== 'All Levels') params.set('level', activeLevel)
    params.set('limit', '50')

    fetch(`/api/courses?${params}`)
      .then(r => r.json())
      .then(d => { setCourses(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeCategory, activeLevel])

  const filtered = courses.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main id="main-content" className="section-padding pt-28">
      <div className="container-wide">
        <MetadataInjector title="Free Courses" description="Practical, project-based courses for developers — free to learn, with a verifiable certificate when you finish." url="/courses" />
        <Breadcrumbs items={[{ label: 'Courses' }]} />

        <SectionHeading
          eyebrow="Free learning library"
          title="Courses for"
          highlight="Developers & Builders"
          description="Practical, project-based courses to help you master in-demand skills. Every course is 100% free, and you earn a verifiable certificate on completion."
        />

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <Input placeholder="Search courses, topics or skills..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 h-12 text-base bg-surface-tertiary border-border-primary" />
        </div>

        {/* Category + level filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                activeCategory === cat ? 'bg-brand-primary text-white' : 'bg-surface-card text-text-secondary hover:text-text-primary border border-border-primary'
              )}>{cat}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {levels.map(l => (
              <button key={l} onClick={() => setActiveLevel(l)} className={cn(
                'px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200',
                activeLevel === l ? 'bg-brand-primary text-white' : 'bg-surface-card text-text-secondary hover:text-text-primary border border-border-primary'
              )}>{l === 'All Levels' ? l : levelLabels[l] || l}</button>
            ))}
          </div>
        </div>

        {/* Course grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/courses/${c.slug}`} className="block h-full">
                  <Card className="h-full card-hover group overflow-hidden">
                    <div className="h-44 relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-surface-card to-surface-secondary">
                      {c.image_url ? (
                        <Image src={c.image_url} alt={`${c.title} course cover`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                      ) : (
                        <span className="text-5xl opacity-50">📚</span>
                      )}
                      <Badge className="absolute top-3 left-3 bg-brand-primary text-white border-0 text-xs z-10">{c.category}</Badge>
                      <Badge className="absolute top-3 right-3 bg-green-500/90 text-white border-0 text-xs z-10">Free</Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-1.5 group-hover:text-brand-primary transition-colors">{c.title}</h3>
                      <p className="text-xs text-text-secondary mb-4 line-clamp-2">{c.description}</p>
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        {c.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>}
                        <span className="flex items-center gap-1 capitalize"><BarChart3 className="h-3 w-3" /> {levelLabels[c.level] || c.level}</span>
                        <span className="ml-auto font-semibold text-green-500">Free</span>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-brand-primary/25 bg-brand-primary/10 py-2.5 text-sm font-semibold text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                        Enroll Free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted mb-4">No courses match your search.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All Courses'); setActiveLevel('All Levels') }} className="text-brand-primary hover:underline text-sm">Clear filters</button>
          </div>
        )}

        {/* Benefits strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 py-8 border-y border-border-primary">
          {[
            { icon: '🎯', title: 'Project-Based', desc: 'Learn by building real projects.' },
            { icon: '♾️', title: 'Lifetime Access', desc: 'All content and updates, forever.' },
            { icon: '🏆', title: 'Certificate', desc: 'Earn a verifiable certificate.' },
            { icon: '🎁', title: 'Always Free', desc: 'No paywalls, no credit card.' },
          ].map(f => (
            <div key={f.title} className="text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
              <p className="text-xs text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
