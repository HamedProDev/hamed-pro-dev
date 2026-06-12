'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MapPin, Users, ExternalLink, Globe, ArrowRight, Building2, Rocket, Briefcase, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

const tabs = ['All', 'Startups', 'Agencies', 'Companies', 'Open Source']

const orgs = [
  { name: 'NovaSoft Solutions', type: 'Agency', desc: 'Full-service software development agency specializing in web, mobile, and AI solutions for businesses across Africa.', location: 'Kigali, Rwanda', team: '15-30', roles: 12, gradient: 'from-blue-600/30 via-indigo-700/20 to-dark-800', tech: ['Next.js', 'React', 'Python'], hiring: true },
  { name: 'InnoHub Africa', type: 'Startup', desc: 'Innovation hub building digital tools for agriculture and financial inclusion across East Africa.', location: 'Nairobi, Kenya', team: '10-20', roles: 8, gradient: 'from-purple-600/30 via-pink-700/20 to-dark-800', tech: ['React', 'Node.js', 'AWS'], hiring: true },
  { name: 'FarmConnect', type: 'Startup', desc: 'Digital marketplace connecting Rwandan farmers directly with buyers, eliminating middlemen.', location: 'Kigali, Rwanda', team: '5-10', roles: 5, gradient: 'from-green-600/30 via-emerald-700/20 to-dark-800', tech: ['React Native', 'Firebase', 'Stripe'], hiring: true },
  { name: 'TechStart Rwanda', type: 'Company', desc: 'Leading tech company providing enterprise solutions and cloud infrastructure for Rwandan businesses.', location: 'Kigali, Rwanda', team: '50-100', roles: 6, gradient: 'from-amber-600/30 via-orange-700/20 to-dark-800', tech: ['Java', 'AWS', 'Kubernetes'], hiring: true },
  { name: 'CloudRwanda', type: 'Company', desc: 'Cloud infrastructure provider offering hosting, DevOps, and managed services for the African market.', location: 'Kigali, Rwanda', team: '20-50', roles: 3, gradient: 'from-cyan-600/30 via-sky-700/20 to-dark-800', tech: ['Docker', 'Kubernetes', 'Terraform'], hiring: false },
  { name: 'OpenDev Rwanda', type: 'Open Source', desc: 'Community-driven organization building open-source tools and contributing to global projects.', location: 'Remote', team: '30+', roles: 0, gradient: 'from-teal-600/30 via-emerald-700/20 to-dark-800', tech: ['TypeScript', 'Go', 'Rust'], hiring: false },
]

export default function StartupsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = orgs.filter(o => {
    const matchTab = activeTab === 'All' || o.type === activeTab
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.desc.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="section-padding pt-24">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">🏢 Trusted Partners</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Startups & <span className="gradient-text">Organizations</span></h1>
          <p className="text-text-secondary">Discover innovative startups, agencies, and companies building the future in Rwanda and across Africa.</p>
        </div>

        {/* Search + Tabs */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <Input placeholder="Search organizations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 py-6 text-base bg-dark-700 border-white/5" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab ? 'bg-brand-primary text-white' : 'bg-dark-700 text-text-secondary hover:text-text-primary border border-white/5'
              )}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Building2, value: '24', label: 'Organizations', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
            { icon: Briefcase, value: '34', label: 'Open Roles', color: 'text-green-500', bg: 'bg-green-500/10' },
            { icon: Users, value: '200+', label: 'Team Members', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { icon: Rocket, value: '12', label: 'Startups', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3">
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', s.bg)}><s.icon className={cn('h-5 w-5', s.color)} /></div>
                <div><div className="text-xl font-bold">{s.value}</div><div className="text-xs text-text-muted">{s.label}</div></div>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>

        {/* Org Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((o, i) => (
            <motion.div key={o.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full card-hover group overflow-hidden">
                <div className={cn('h-32 rounded-t-xl bg-gradient-to-br relative', o.gradient)}>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center text-sm font-bold text-brand-primary">{o.name.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{o.name}</h3>
                      <Badge variant="outline" className="text-xs">{o.type}</Badge>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{o.desc}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {o.team}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {o.tech.map(t => <Badge key={t} className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/20">{t}</Badge>)}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    {o.hiring ? (
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">🟢 {o.roles} open roles</Badge>
                    ) : (
                      <span className="text-xs text-text-muted">Not hiring</span>
                    )}
                    <div className="flex items-center gap-2">
                      <a href="#" className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"><Globe className="h-3.5 w-3.5 text-text-muted" /></a>
                      <a href="#" className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"><ExternalLink className="h-3.5 w-3.5 text-text-muted" /></a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && <p className="text-center text-text-muted py-12">No organizations found.</p>}

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-r from-dark-700 to-dark-800 p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Want to list your organization?</h3>
          <p className="text-text-secondary mb-6">Join our network of tech companies and reach talented developers.</p>
          <Button asChild className="gradient-bg text-white"><Link href="/contact">Get Listed →</Link></Button>
        </div>
      </div>
    </div>
  )
}
