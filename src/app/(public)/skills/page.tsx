'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn } from '@/components/shared/Animations'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Marquee } from '@/components/shared/Marquee'
import { Wrench } from 'lucide-react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  color: string
  featured?: boolean
}

const ease = [0.25, 0.46, 0.45, 0.94]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(d => { if (d.success) setSkills(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))]
  const filtered = activeTab === 'All' ? skills : skills.filter(s => s.category === activeTab)

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-12 w-12 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main id="main-content" className="min-h-screen bg-surface-primary py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <MetadataInjector title="Skills & Expertise" description="Hamed Hussein (hamedprodev) — full stack developer & AI/ML engineer. React, Next.js, TypeScript, Node.js, Python, and more." url="/skills" />
        <Breadcrumbs items={[{ label: 'Skills' }]} />

        <SectionHeading
          eyebrow="Technologies & Tools"
          title="Skills &"
          highlight="Expertise"
          description="The stack I use daily to design, build, and ship full-stack and AI/ML products."
        />

        {skills.length > 0 && (
          <FadeIn className="mb-12 -mx-4 sm:mx-0">
            <Marquee items={skills.map(s => s.name)} />
          </FadeIn>
        )}

        <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === cat
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-surface-tertiary/60 text-text-secondary hover:bg-surface-tertiary hover:text-text-primary border border-transparent hover:border-border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.35, ease }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-border-primary bg-surface-card/60 p-5 card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-text-primary font-semibold text-base group-hover:text-brand-primary transition-colors">{skill.name}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface-tertiary text-text-secondary">{skill.category}</span>
                </div>
                <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.02, ease }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary"
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">Proficiency</span>
                  <span className="font-semibold text-text-primary">{skill.proficiency}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-surface-tertiary/50 flex items-center justify-center">
              <Wrench className="h-7 w-7 text-text-muted" />
            </div>
            <p className="text-text-muted text-lg">No skills found in this category</p>
          </motion.div>
        )}

        <FadeIn delay={0.3} className="mt-14 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-tertiary/60 border border-border-primary text-sm text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            {skills.length} skills across {categories.length - 1} categories
          </div>
        </FadeIn>
      </div>
    </main>
  )
}
