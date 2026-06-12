'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Star, Clock, Users, BookOpen, Award, MessageCircle, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

const categories = [
  { name: 'All Courses', count: 15, icon: BookOpen, color: 'bg-brand-primary text-white' },
  { name: 'Frontend', count: 4, icon: null, color: 'bg-dark-700 text-text-secondary border border-white/5' },
  { name: 'Backend', count: 4, icon: null, color: 'bg-dark-700 text-text-secondary border border-white/5' },
  { name: 'AI / ML', count: 3, icon: null, color: 'bg-dark-700 text-text-secondary border border-white/5' },
  { name: 'Mobile', count: 2, icon: null, color: 'bg-dark-700 text-text-secondary border border-white/5' },
  { name: 'DevOps', count: 2, icon: null, color: 'bg-dark-700 text-text-secondary border border-white/5' },
]

const courses = [
  { title: 'React.js — From Zero to Hero', category: 'Frontend', desc: 'Build modern, responsive web apps with React, Hooks, Context API, and real-world projects.', hours: 8.5, level: 'Beginner', rating: 4.9, reviews: 8, price: 49, oldPrice: 79, gradient: 'from-blue-600/30 via-cyan-700/20 to-dark-800', icon: '⚛️' },
  { title: 'Node.js & Express — Complete Guide', category: 'Backend', desc: 'Learn backend development with Node.js, Express, MongoDB, authentication & more.', hours: 10, level: 'Intermediate', rating: 4.8, reviews: 4, price: 59, oldPrice: 89, gradient: 'from-green-600/30 via-emerald-700/20 to-dark-800', icon: '🟢' },
  { title: 'TypeScript — Master the Fundamentals', category: 'Frontend', desc: 'Strongly type your JavaScript apps and scale your development career.', hours: 4, level: 'Beginner', rating: 4.9, reviews: 2, price: 29, oldPrice: 49, gradient: 'from-blue-700/30 via-indigo-700/20 to-dark-800', icon: 'TS' },
  { title: 'Python — For Developers', category: 'Backend', desc: 'Learn Python programming for backend, automation, data analysis and AI.', hours: 6, level: 'Beginner', rating: 4.7, reviews: 4, price: 39, oldPrice: 59, gradient: 'from-yellow-600/30 via-amber-700/20 to-dark-800', icon: '🐍' },
  { title: 'Next.js 14 — The Complete Guide', category: 'Frontend', desc: 'Build production-ready apps with Next.js, App Router, SSR, and API routes.', hours: 7.5, level: 'Intermediate', rating: 4.8, reviews: 2, price: 59, oldPrice: 89, gradient: 'from-gray-600/30 via-dark-700 to-dark-800', icon: 'N' },
  { title: 'Machine Learning A-Z', category: 'AI / ML', desc: 'From theory to deployment — learn ML models, training, and real projects.', hours: 12, level: 'Advanced', rating: 4.9, reviews: 1, price: 79, oldPrice: 129, gradient: 'from-purple-600/30 via-pink-700/20 to-dark-800', icon: '🧠' },
  { title: 'Flutter & Dart — Build Mobile Apps', category: 'Mobile', desc: 'Build beautiful cross-platform mobile applications for iOS & Android.', hours: 9, level: 'Intermediate', rating: 4.7, reviews: 2, price: 49, oldPrice: 79, gradient: 'from-cyan-600/30 via-blue-700/20 to-dark-800', icon: '📱' },
  { title: 'Docker & Kubernetes — Practical Guide', category: 'DevOps', desc: 'Containerization, orchestration and DevOps workflows for developers.', hours: 6.5, level: 'Intermediate', rating: 4.8, reviews: 2, price: 59, oldPrice: 99, gradient: 'from-blue-600/30 via-sky-700/20 to-dark-800', icon: '🐳' },
  { title: 'Fullstack Project Bootcamp', category: 'Frontend', desc: 'Build a complete SaaS application from scratch using modern technologies.', hours: 15, level: 'Advanced', rating: 4.9, reviews: 3, price: 99, oldPrice: 149, gradient: 'from-brand-primary/30 via-brand-secondary/20 to-dark-800', icon: '🚀' },
]

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const sortOptions = ['Popular', 'Newest', 'Price: Low', 'Price: High']

export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState('All Courses')
  const [activeLevel, setActiveLevel] = useState('All Levels')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('Popular')
  const [showFilters, setShowFilters] = useState(true)

  const filtered = courses.filter(c => {
    const matchCat = activeCategory === 'All Courses' || c.category === activeCategory
    const matchLevel = activeLevel === 'All Levels' || c.level === activeLevel
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchLevel && matchSearch
  })

  return (
    <div className="section-padding pt-24">
      <div className="container-wide">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">🚀 Level up your skills</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Courses for<br /><span className="gradient-text">Developers & Builders</span></h1>
            <p className="text-text-secondary mb-6">Practical, project-based courses to help you master in-demand skills and build real-world solutions.</p>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <Input placeholder="Search courses, topics or skills..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 py-6 text-base bg-dark-700 border-white/5" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[{ icon: '📚', label: '15+', sub: 'Courses' }, { icon: '👥', label: '2.5K+', sub: 'Students' }, { icon: '⭐', label: '4.9', sub: 'Average Rating' }, { icon: '🔄', label: 'Lifetime', sub: 'Access' }].map(s => (
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
            <div className="relative w-80 h-80 rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 border border-white/10 overflow-hidden flex items-center justify-center">
              <div className="text-6xl opacity-30">💻</div>
            </div>
            {/* Floating badges */}
            {[{ name: 'React', x: '-10%', y: '20%', icon: '⚛️' }, { name: 'Node.js', x: '80%', y: '10%', icon: '🟢' }, { name: 'Python', x: '-5%', y: '70%', icon: '🐍' }, { name: 'TypeScript', x: '85%', y: '65%', icon: 'TS' }].map((b, i) => (
              <div key={b.name} className="absolute animate-float" style={{ left: b.x, top: b.y, animationDelay: `${i * 0.3}s` }}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-dark-800/90 backdrop-blur-sm shadow-lg">
                  <span className="text-sm">{b.icon}</span>
                  <span className="text-xs font-medium text-text-primary">{b.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(cat => (
            <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              activeCategory === cat.name ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary hover:text-text-primary border border-white/5'
            )}>
              {cat.icon && <cat.icon className="h-4 w-4" />}
              {cat.name}
              <span className="text-xs opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
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
                      {l}
                    </label>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-dark-700 border border-white/5">
                  <h4 className="font-medium text-text-primary mb-1">Can&apos;t find the right course?</h4>
                  <p className="text-xs text-text-muted mb-3">Request a course and I&apos;ll create it for you.</p>
                  <Button size="sm" className="gradient-bg text-white w-full">Request a Course</Button>
                </div>
              </div>
            </div>
          )}

          {/* Course Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">All Courses</h2>
                <p className="text-sm text-text-muted">{filtered.length} courses available</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-dark-700 border border-white/5 rounded-lg px-3 py-2 text-sm text-text-secondary">
                  {sortOptions.map(s => <option key={s} value={s}>Sort by: {s}</option>)}
                </select>
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2 rounded-lg bg-dark-700 border border-white/5">
                  <Filter className="h-4 w-4 text-text-secondary" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((c, i) => (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full card-hover group overflow-hidden">
                    <div className={cn('h-40 rounded-t-xl bg-gradient-to-br relative flex items-center justify-center', c.gradient)}>
                      <span className="text-5xl opacity-60">{c.icon}</span>
                      <Badge className="absolute top-3 left-3 bg-brand-primary/90 text-white border-0 text-xs">{c.category}</Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-1 group-hover:text-brand-primary transition-colors">{c.title}</h3>
                      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{c.desc}</p>
                      <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.hours} hours</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.level}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium">{c.rating}</span>
                          <span className="text-xs text-text-muted">({c.reviews})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-brand-primary">${c.price}</span>
                          <span className="text-xs text-text-muted line-through">${c.oldPrice}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 py-8 border-y border-white/5">
          {[{ icon: '🎯', title: 'Project-Based Learning', desc: 'Learn by building real-world projects you can showcase.' }, { icon: '♾️', title: 'Lifetime Access', desc: 'Get lifetime access to all course content and future updates.' }, { icon: '👥', title: 'Community Support', desc: 'Join our community of builders and get help when needed.' }, { icon: '🏆', title: 'Certificate', desc: 'Earn a certificate upon completion of the course.' }].map(f => (
            <div key={f.title} className="text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
              <p className="text-xs text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-dark-700 to-dark-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand-primary/20 flex items-center justify-center text-2xl">🎓</div>
            <div>
              <h3 className="text-lg font-bold">Ready to start your learning journey?</h3>
              <p className="text-sm text-text-secondary">Join thousands of developers who are already building their future.</p>
            </div>
          </div>
          <Button asChild className="gradient-bg text-white shrink-0">
            <Link href="/contact">Get Started →</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
