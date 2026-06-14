'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn, PopupIn, StaggerContainer, StaggerItem } from '@/components/shared/Animations'

interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
  color: string
  icon?: string
  order: number
  featured: boolean
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-3 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-primary py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            Technologies & Tools
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
            Skills &{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Expertise
            </span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Technologies and tools I work with daily to build innovative solutions
          </p>
        </FadeIn>

        <FadeIn delay={0.15} className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => setActiveTab(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-surface-tertiary/50 text-text-secondary hover:bg-surface-tertiary hover:text-text-primary hover:shadow-md hover:shadow-white/5'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((skill, i) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative bg-surface-card/50 border border-border-primary rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 cursor-default overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${skill.color || '#3B82F6'}10, transparent 70%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-text-primary font-semibold text-lg group-hover:text-blue-300 transition-colors duration-300">
                      {skill.name}
                    </h3>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-surface-tertiary text-text-secondary group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-all duration-300">
                      {skill.category}
                    </span>
                  </div>
                  <div className="relative h-3 bg-surface-tertiary/50 rounded-full overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1.2, delay: i * 0.04 + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${skill.color || '#3B82F6'}cc, ${skill.color || '#3B82F6'})`,
                        boxShadow: `0 0 20px ${skill.color || '#3B82F6'}40, 0 0 6px ${skill.color || '#3B82F6'}60`,
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{ duration: 2, delay: i * 0.04 + 0.8, repeat: Infinity, repeatDelay: 3 }}
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${skill.proficiency}%`,
                        background: `linear-gradient(90deg, transparent, ${skill.color || '#3B82F6'}30, transparent)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-muted">Proficiency</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 + 0.5 }}
                      className="text-sm text-text-primary font-bold"
                      style={{ color: skill.color || '#3B82F6' }}
                    >
                      {skill.proficiency}%
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-surface-tertiary/50 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-text-muted text-lg">No skills found in this category</p>
          </motion.div>
        )}

        <FadeIn delay={0.3} className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-tertiary/50 border border-border-primary text-sm text-text-secondary">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            {skills.length} skills across {categories.length - 1} categories
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
