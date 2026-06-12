'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase, Clock, Star, Building2, ArrowRight, Filter, CheckCircle2, Code2, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

const filters = {
  types: ['All Types', 'Full-time', 'Part-time', 'Contract', 'Internship'],
  levels: ['All Levels', 'Junior', 'Mid', 'Senior'],
  tags: ['All Tech', 'React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 'Tailwind'],
}

const jobs = [
  { title: 'Frontend Developer', company: 'TechStart Rwanda', location: 'Kigali, Rwanda', type: 'Full-time', level: 'Mid', salary: '$800 - $1,500', posted: '2d ago', tags: ['React', 'TypeScript', 'Tailwind'], hot: true, gradient: 'from-green-500/10 via-emerald-700/5 to-transparent' },
  { title: 'Fullstack Engineer', company: 'InnoHub Africa', location: 'Remote, Africa', type: 'Full-time', level: 'Senior', salary: '$2,000 - $3,500', posted: '5d ago', tags: ['Next.js', 'Node.js', 'PostgreSQL'], hot: true, gradient: 'from-blue-500/10 via-indigo-700/5 to-transparent' },
  { title: 'Mobile Developer', company: 'FarmConnect', location: 'Kigali, Rwanda', type: 'Full-time', level: 'Junior', salary: '$600 - $1,200', posted: '1d ago', tags: ['React Native', 'TypeScript'], hot: false, gradient: 'from-amber-500/10 via-orange-700/5 to-transparent' },
  { title: 'Backend Developer', company: 'NovaSoft Solutions', location: 'Remote, Global', type: 'Contract', level: 'Mid', salary: '$1,500 - $2,800', posted: '3d ago', tags: ['Python', 'Django', 'AWS'], hot: false, gradient: 'from-purple-500/10 via-violet-700/5 to-transparent' },
  { title: 'DevOps Engineer', company: 'CloudRwanda', location: 'Kigali, Rwanda', type: 'Full-time', level: 'Senior', salary: '$2,500 - $4,000', posted: '1w ago', tags: ['Docker', 'Kubernetes', 'AWS'], hot: false, gradient: 'from-cyan-500/10 via-sky-700/5 to-transparent' },
  { title: 'AI/ML Engineer', company: 'DataKigali', location: 'Hybrid, Kigali', type: 'Full-time', level: 'Senior', salary: '$3,000 - $5,000', posted: '4d ago', tags: ['Python', 'TensorFlow', 'PyTorch'], hot: true, gradient: 'from-pink-500/10 via-rose-700/5 to-transparent' },
]

const topCompanies = [
  { name: 'NovaSoft Solutions', role: '12 positions', gradient: 'from-blue-600/30 to-indigo-700/30' },
  { name: 'InnoHub Africa', role: '8 positions', gradient: 'from-purple-600/30 to-pink-700/30' },
  { name: 'TechStart Rwanda', role: '6 positions', gradient: 'from-green-600/30 to-emerald-700/30' },
  { name: 'FarmConnect', role: '5 positions', gradient: 'from-amber-600/30 to-orange-700/30' },
]

export default function JobsPage() {
  const [activeType, setActiveType] = useState('All Types')
  const [activeLevel, setActiveLevel] = useState('All Levels')
  const [search, setSearch] = useState('')

  const filtered = jobs.filter(j => {
    const matchType = activeType === 'All Types' || j.type === activeType
    const matchLevel = activeLevel === 'All Levels' || j.level === activeLevel
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
    return matchType && matchLevel && matchSearch
  })

  return (
    <div className="section-padding pt-24">
      <div className="container-wide">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">🟢 Actively hiring</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream<br /><span className="gradient-text">Developer Job</span></h1>
            <p className="text-text-secondary mb-6">Curated job opportunities for developers in Rwanda and across Africa. Full-time, remote, and hybrid positions.</p>
            <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> All jobs verified</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Updated weekly</span>
            </div>
          </div>
          <div className="relative hidden md:flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-700/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative grid grid-cols-2 gap-3">
              {[
                { icon: '💻', label: 'Remote', sub: 'Work anywhere' },
                { icon: '🏢', label: 'Hybrid', sub: 'Best of both' },
                { icon: '📈', label: 'Growth', sub: 'Career path' },
                { icon: '🤝', label: 'Network', sub: 'Community' },
              ].map((s, i) => (
                <div key={s.label} className="p-4 rounded-xl bg-dark-800/80 border border-white/5 backdrop-blur-sm text-center animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xs font-semibold">{s.label}</div>
                  <div className="text-[10px] text-text-muted">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Briefcase, value: '24', label: 'Open Positions', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
            { icon: Building2, value: '12', label: 'Partner Companies', color: 'text-green-500', bg: 'bg-green-500/10' },
            { icon: Users, value: '850+', label: 'Developers Hired', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { icon: TrendingUp, value: '95%', label: 'Placement Rate', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', s.bg)}><s.icon className={cn('h-5 w-5', s.color)} /></div>
                <div><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-text-muted">{s.label}</div></div>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <Input placeholder="Search by job title or company..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 py-6 text-base bg-dark-700 border-white/5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {filters.types.map(t => (
            <button key={t} onClick={() => setActiveType(t)} className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeType === t ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary hover:text-text-primary border border-white/5'
            )}>{t}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.levels.map(l => (
            <button key={l} onClick={() => setActiveLevel(l)} className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              activeLevel === l ? 'bg-white/10 text-text-primary' : 'text-text-muted hover:text-text-secondary'
            )}>{l}</button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* Job Listings */}
          <div className="flex-1 space-y-4">
            {filtered.map((j, i) => (
              <motion.div key={j.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={cn('card-hover group cursor-pointer overflow-hidden', j.gradient)}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-dark-600 border border-white/10 flex items-center justify-center text-xs font-bold text-brand-primary">{j.company.slice(0, 2).toUpperCase()}</div>
                        <div>
                          <h3 className="font-semibold group-hover:text-brand-primary transition-colors">{j.title}</h3>
                          <p className="text-sm text-text-secondary">{j.company}</p>
                        </div>
                      </div>
                      {j.hot && <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">🔥 Hot</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mb-3">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {j.type}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {j.posted}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {j.tags.map(t => <Badge key={t} className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/20">{t}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-sm font-semibold text-green-500">{j.salary}</span>
                      <Button size="sm" className="gradient-bg text-white group/btn">Apply Now <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filtered.length === 0 && <p className="text-center text-text-muted py-12">No jobs match your filters.</p>}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 shrink-0 space-y-6">
            <Card className="overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h3 className="font-semibold">Top Companies Hiring</h3>
                <p className="text-xs text-text-muted">Companies actively looking for talent</p>
              </div>
              <CardContent className="p-0">
                {topCompanies.map((c, i) => (
                  <div key={c.name} className={cn('p-4 border-b border-white/5 last:border-0 hover:bg-white/2 cursor-pointer transition-colors', i === 0 && 'bg-white/2')}>
                    <div className="flex items-center gap-3">
                      <div className={cn('h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-xs font-bold text-white', c.gradient)}>{c.name.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-brand-primary">{c.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="gradient-bg text-white">
              <CardContent className="p-6 text-center">
                <Code2 className="h-8 w-8 mx-auto mb-3 text-green-400" />
                <h3 className="font-semibold mb-1">For Employers</h3>
                <p className="text-sm text-white/70 mb-4">Hire skilled developers from our community.</p>
                <Button asChild className="bg-white text-brand-primary hover:bg-white/90 w-full"><Link href="/contact">Post a Job</Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
