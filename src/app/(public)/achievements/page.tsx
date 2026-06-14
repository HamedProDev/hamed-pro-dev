'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Download, Trophy, Award, Star, Milestone, BookOpen } from 'lucide-react'
import { FadeIn, ScaleIn, PopupIn, GlowPulse } from '@/components/shared/Animations'

interface Achievement {
  _id: string
  title: string
  description: string
  year: string
  type: 'award' | 'certification' | 'milestone' | 'project' | 'publication'
  icon?: string
  link?: string
  order: number
  featured: boolean
}

const typeConfig: Record<string, { color: string; bg: string; border: string; glow: string; icon: any }> = {
  award: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'rgba(251,191,36,0.15)', icon: Trophy },
  certification: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: 'rgba(52,211,153,0.15)', icon: Award },
  milestone: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', glow: 'rgba(96,165,250,0.15)', icon: Milestone },
  project: { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', glow: 'rgba(192,132,252,0.15)', icon: Star },
  publication: { color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20', glow: 'rgba(244,114,182,0.15)', icon: BookOpen },
}

const ease = [0.25, 0.46, 0.45, 0.94]

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/achievements')
      .then(r => r.json())
      .then(d => {
        if (d.success) setAchievements(d.data.sort((a: Achievement, b: Achievement) => Number(b.year) - Number(a.year)))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-3 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
          >
            Recognition & Milestones
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Achievements
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Milestones and recognitions along the journey
          </p>
        </FadeIn>

        {achievements.length > 0 && (
          <div className="relative">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, ease }}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-blue-500/10 to-transparent origin-top"
            />

            {achievements.map((achievement, i) => {
              const config = typeConfig[achievement.type] || typeConfig.milestone
              const Icon = config.icon
              const isLeft = i % 2 === 0

              return (
                <motion.div
                  key={achievement._id}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease }}
                  className={`relative mb-14 pl-14 md:pl-0 ${
                    isLeft ? 'md:pr-[52%]' : 'md:pl-[52%]'
                  }`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute left-2.5 md:left-1/2 md:-translate-x-1/2 top-2 z-10"
                  >
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-[#0a0a1a]" />
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className="absolute inset-0 rounded-full bg-blue-500"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.2, ease }}
                    className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 relative overflow-hidden group"
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${config.glow}, transparent 70%)` }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08 + 0.3, type: 'spring', stiffness: 400 }}
                          className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                        >
                          {achievement.year}
                        </motion.span>
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${config.bg} ${config.border} ${config.color}`}>
                          <Icon className="h-3 w-3 inline mr-1" />
                          {achievement.type}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors duration-300">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{achievement.description}</p>
                      {achievement.link && (
                        <motion.a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 4 }}
                          className="inline-flex items-center gap-1.5 mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Details
                        </motion.a>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        )}

        {achievements.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg">No achievements yet</p>
          </motion.div>
        )}

        <PopupIn delay={0.4} className="mt-20">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white/[0.03] border border-white/5 rounded-2xl p-8 text-center overflow-hidden group hover:border-blue-500/20 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25"
              >
                <Download className="h-7 w-7 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3">Resume / CV</h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Download my complete resume with detailed experience, education, and skills.
              </p>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </motion.a>
            </div>
          </motion.div>
        </PopupIn>
      </div>
    </div>
  )
}
