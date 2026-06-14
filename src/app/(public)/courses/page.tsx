'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Star, Clock, Users, BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

const categoryTabs = ['All Courses', 'Frontend', 'Backend', 'AI / ML', 'Mobile', 'DevOps']
const levels = ['All Levels', 'beginner', 'intermediate', 'advanced']

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

interface Course {
  _id: string
  title: string
  slug: string
  description: string
  category: string
  level: string
  type: string
  price: number
  duration: number
  enrolled: number
  rating: number
  featured: boolean
  coverImage?: string
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

  const filtered = courses.filter(c => {
    if (!search) return true
    return c.title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="section-padding pt-24">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">🚀 Level up your skills</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Courses for<br /><span className="gradient-text">Developers & Builders</span></h1>
            <p className="text-text-secondary mb-6">Practical, project-based courses to help you master in-demand skills and build real-world solutions.</p>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <Input placeholder="Search courses, topics or skills..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 py-6 text-base bg-surface-tertiary border-border-primary" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[{ icon: '📚', label: `${courses.length}+`, sub: 'Courses' }, { icon: '👥', label: '2.5K+', sub: 'Students' }, { icon: '⭐', label: '4.9', sub: 'Avg Rating' }, { icon: '🔄', label: 'Lifetime', sub: 'Access' }].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="text-lg font-bold text-text-primary">{s.label}</div>
                  <div className="text-xs text-text-muted">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative w-80 h-80 rounded-2xl bg-gradient-to-br from-surface-card to-surface-secondary border border-border-primary overflow-hidden flex items-center justify-center">
              <div className="text-6xl opacity-30">💻</div>
            </div>
            {[{ name: 'React', x: '-10%', y: '20%', icon: '⚛️' }, { name: 'Node.js', x: '80%', y: '10%', icon: '🟢' }, { name: 'Python', x: '-5%', y: '70%', icon: '🐍' }, { name: 'TypeScript', x: '85%', y: '65%', icon: 'TS' }].map((b, i) => (
              <div key={b.name} className="absolute animate-float" style={{ left: b.x, top: b.y, animationDelay: `${i * 0.3}s` }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border-primary bg-surface-card/90 backdrop-blur-sm shadow-lg">
                  <span className="text-sm">{b.icon}</span>
                  <span className="text-xs font-medium text-text-primary">{b.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categoryTabs.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={cn(
              'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              activeCategory === cat ? 'bg-brand-primary text-white' : 'bg-surface-card text-text-secondary hover:text-text-primary border border-border-primary'
            )}>{cat}</button>
          ))}
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">Filters</h3>
                <button onClick={() => { setActiveLevel('All Levels'); setSearch('') }} className="text-xs text-brand-primary hover:underline">Clear all</button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                <Input placeholder="Search within courses.." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 py-2 text-sm" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-3">Level</h4>
                {levels.map(l => (
                  <label key={l} className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary cursor-pointer py-1">
                    <input type="radio" name="level" checked={activeLevel === l} onChange={() => setActiveLevel(l)} className="accent-brand-primary" />
                    {l === 'All Levels' ? l : levelLabels[l] || l}
                  </label>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-surface-card border border-border-primary">
                <h4 className="font-medium text-text-primary mb-1">Can&apos;t find the right course?</h4>
                <p className="text-xs text-text-muted mb-3">Request a course and I&apos;ll create it for you.</p>
                <Button size="sm" className="gradient-bg text-white w-full" asChild><Link href="/contact">Request a Course</Link></Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">All Courses</h2>
                <p className="text-sm text-text-muted">{filtered.length} courses available</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((c, i) => (
                  <motion.div key={c._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="h-full card-hover group overflow-hidden">
                      <div className="h-40 rounded-t-xl bg-gradient-to-br from-brand-primary/30 via-brand-secondary/20 to-surface-secondary relative flex items-center justify-center">
                        <span className="text-5xl opacity-60">📚</span>
                        <Badge className="absolute top-3 left-3 bg-brand-primary/90 text-white border-0 text-xs">{c.category}</Badge>
                        {c.type === 'premium' && <Badge className="absolute top-3 right-3 bg-amber-500/90 text-white border-0 text-xs">⭐ Premium</Badge>}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold mb-1 group-hover:text-brand-primary transition-colors">{c.title}</h3>
                        <p className="text-xs text-text-secondary mb-3 line-clamp-2">{c.description}</p>
                        <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration || 0}h</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.enrolled || 0}</span>
                          <span className="flex items-center gap-1 capitalize">{levelLabels[c.level] || c.level}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border-primary">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{c.rating || '4.9'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {c.type === 'premium' ? (
                              <span className="text-lg font-bold text-brand-primary">${c.price}</span>
                            ) : (
                              <span className="text-lg font-bold text-green-500">Free</span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-muted mb-4">No courses yet.</p>
                <p className="text-sm text-text-muted">Courses will appear here once added from the admin panel.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 py-8 border-y border-border-primary">
          {[{ icon: '🎯', title: 'Project-Based Learning', desc: 'Learn by building real-world projects.' }, { icon: '♾️', title: 'Lifetime Access', desc: 'Get lifetime access to all content and updates.' }, { icon: '👥', title: 'Community Support', desc: 'Join our community of builders.' }, { icon: '🏆', title: 'Certificate', desc: 'Earn a certificate upon completion.' }].map(f => (
            <div key={f.title} className="text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
              <p className="text-xs text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
