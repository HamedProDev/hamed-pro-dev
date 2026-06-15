'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase, Building2, ArrowRight, Users, TrendingUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

const jobTypes = ['All Types', 'full-time', 'part-time', 'contract', 'internship']
const jobLevels = ['All Levels', 'junior', 'mid', 'senior']

const typeLabels: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  'contract': 'Contract',
  'internship': 'Internship',
  'freelance': 'Freelance',
}

interface Job {
  _id: string
  title: string
  company: string
  location: string
  locationType: string
  type: string
  category: string
  skills: string[]
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  featured: boolean
  createdAt: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState('All Types')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (activeType !== 'All Types') params.set('locationType', activeType)
    if (search) params.set('search', search)
    params.set('limit', '50')

    fetch(`/api/jobs?${params}`)
      .then(r => r.json())
      .then(d => { setJobs(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activeType, search])

  const filtered = jobs.filter(j => {
    if (!search) return true
    return j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide">
        <MetadataInjector title="Jobs" description="Curated developer job opportunities in Rwanda and across Africa. Full-time, remote, and hybrid positions." url="/jobs" />
        <Breadcrumbs items={[{ label: 'Jobs' }]} />
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">🟢 Actively hiring</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream<br /><span className="gradient-text">Developer Job</span></h1>
            <p className="text-text-secondary mb-6">Curated job opportunities for developers in Rwanda and across Africa. Full-time, remote, and hybrid positions.</p>
          </div>
          <div className="relative hidden md:flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-700/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative grid grid-cols-2 gap-3">
              {[{ icon: '💻', label: 'Remote', sub: 'Work anywhere' }, { icon: '🏢', label: 'Hybrid', sub: 'Best of both' }, { icon: '📈', label: 'Growth', sub: 'Career path' }, { icon: '🤝', label: 'Network', sub: 'Community' }].map((s, i) => (
                <div key={s.label} className="p-4 rounded-xl bg-surface-card/80 border border-border-primary backdrop-blur-sm text-center animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xs font-semibold">{s.label}</div>
                  <div className="text-[10px] text-text-muted">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Briefcase, value: String(filtered.length), label: 'Open Positions', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
            { icon: Building2, value: String(new Set(filtered.map(j => j.company)).size), label: 'Companies', color: 'text-green-500', bg: 'bg-green-500/10' },
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

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <Input placeholder="Search by job title or company..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 py-6 text-base bg-surface-tertiary border-border-primary" />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {jobTypes.map(t => (
            <button key={t} onClick={() => setActiveType(t)} className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeType === t ? 'bg-brand-primary text-white' : 'bg-surface-card text-text-secondary hover:text-text-primary border border-border-primary'
            )}>{t === 'All Types' ? t : typeLabels[t] || t}</button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
        ) : (
          <div className="space-y-4">
            {filtered.map((j, i) => (
              <motion.div key={j._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="card-hover group cursor-pointer overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-surface-tertiary border border-border-primary flex items-center justify-center text-xs font-bold text-brand-primary">{j.company.slice(0, 2).toUpperCase()}</div>
                        <div>
                          <h3 className="font-semibold group-hover:text-brand-primary transition-colors">{j.title}</h3>
                          <p className="text-sm text-text-secondary">{j.company}</p>
                        </div>
                      </div>
                      {j.featured && <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">🔥 Hot</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mb-3">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {typeLabels[j.type] || j.type}</span>
                      <span className="flex items-center gap-1 capitalize">{j.locationType}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(j.skills || []).slice(0, 4).map((t: string) => <Badge key={t} className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/20">{t}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border-primary">
                      <span className="text-sm font-semibold text-green-500">
                        {j.salaryMin ? `$${j.salaryMin.toLocaleString()}${j.salaryMax ? ` - $${j.salaryMax.toLocaleString()}` : ''}` : 'Competitive'}
                      </span>
                      <Button size="sm" className="gradient-bg text-white group/btn">Apply Now <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted mb-4">No jobs available yet.</p>
            <p className="text-sm text-text-muted">Jobs will appear here once posted from the admin panel.</p>
          </div>
        )}
      </div>
    </main>
  )
}
