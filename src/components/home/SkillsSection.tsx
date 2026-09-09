'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { TechIcon, techBrandColor, techIsDark } from '@/components/shared/TechIcon'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Loader2 } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  color?: string
}

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(d => { if (d.success) setSkills(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="section-padding">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      </section>
    )
  }

  if (skills.length === 0) return null

  const categories = Array.from(new Set(skills.map(s => s.category || 'Other')))

  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeading
          eyebrow="My toolbox"
          title="Tech"
          highlight="Stack"
          description="Technologies I work with daily — from frontend to AI/ML and the cloud."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const items = skills.filter(s => (s.category || 'Other') === cat)
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full card-hover overflow-hidden">
                  <CardContent className="p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">{cat}</h3>
                    <div className="space-y-3">
                      {items.map(skill => {
                        const brand = techBrandColor(skill.name)
                        const dark = techIsDark(skill.name)
                        const chipBg = dark ? '#e2e8f0' : `${brand}1a`
                        const chipBorder = dark ? 'rgba(15,23,42,0.1)' : `${brand}40`
                        return (
                          <div key={skill.id} className="flex items-center gap-3">
                            <span
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border shrink-0"
                              style={{ backgroundColor: chipBg, borderColor: chipBorder }}
                            >
                              <TechIcon name={skill.name} size={18} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-sm text-text-primary">{skill.name}</span>
                              <div className="mt-1 h-1 rounded-full bg-surface-tertiary overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${skill.proficiency || 0}%`, background: brand }} />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
