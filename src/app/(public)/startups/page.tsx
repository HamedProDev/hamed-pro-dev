'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MapPin, Users, ExternalLink, Globe, ArrowRight, Building2, Rocket, Briefcase, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

const tabs = ['All', 'Startup', 'Agency', 'Company', 'Open Source']

const gradientMap: Record<string, string> = {
  Agency: 'from-blue-600/30 via-indigo-700/20 to-surface-secondary',
  Startup: 'from-purple-600/30 via-pink-700/20 to-surface-secondary',
  Company: 'from-amber-600/30 via-orange-700/20 to-surface-secondary',
  'Open Source': 'from-teal-600/30 via-emerald-700/20 to-surface-secondary',
}

export default function StartupsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/organizations').then(r => r.json()).then(d => {
      if (d.success) setOrgs(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = orgs.filter(o => {
    const matchTab = activeTab === 'All' || o.type === activeTab
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide">
        <MetadataInjector title="Startups & Organizations" description="Discover innovative startups, agencies, and companies building the future in Rwanda and across Africa." url="/startups" />
        <Breadcrumbs items={[{ label: 'Startups & Organizations' }]} />
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">Trusted Partners</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Startups & <span className="gradient-text">Organizations</span></h1>
          <p className="text-text-secondary">Discover innovative startups, agencies, and companies building the future in Rwanda and across Africa.</p>
        </div>
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <Input placeholder="Search organizations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-12 py-6 text-base" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200', activeTab === tab ? 'bg-brand-primary text-white' : 'bg-surface-card text-text-secondary hover:text-text-primary border border-border-primary')}>{tab}</button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((o, i) => (
              <motion.div key={o._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="h-full card-hover group overflow-hidden">
                  <div className={cn('h-32 rounded-t-xl bg-gradient-to-br relative', gradientMap[o.type] || gradientMap.Startup)}>
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-surface-card border border-border-primary flex items-center justify-center text-sm font-bold text-brand-primary">{o.name.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{o.name}</h3>
                        <Badge variant="outline" className="text-xs">{o.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{o.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mb-3">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {o.location}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {o.team}</span>
                    </div>
                    {o.tech?.length > 0 && <div className="flex flex-wrap gap-1.5 mb-4">{o.tech.map((t: string) => <Badge key={t} className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/20">{t}</Badge>)}</div>}
                    <div className="flex items-center justify-between pt-3 border-t border-border-primary">
                      {o.hiring ? <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">{o.roles} open roles</Badge> : <span className="text-xs text-text-muted">Not hiring</span>}
                      {o.website && <a href={o.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors"><Globe className="h-3.5 w-3.5 text-text-muted" /></a>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        {filtered.length === 0 && <p className="text-center text-text-muted py-12">No organizations found.</p>}
        <div className="mt-16 rounded-2xl border border-border-primary bg-gradient-to-r from-surface-card to-surface-secondary p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Want to list your organization?</h3>
          <p className="text-text-secondary mb-6">Join our network of tech companies and reach talented developers.</p>
          <Button asChild className="gradient-bg text-white"><Link href="/contact">Get Listed</Link></Button>
        </div>
      </div>
    </main>
  )
}
