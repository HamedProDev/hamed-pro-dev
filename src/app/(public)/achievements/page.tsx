'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ExternalLink, Download, Trophy, Award, Star, Milestone, BookOpen, BadgeCheck, FileText, Loader2 } from 'lucide-react'
import { FadeIn, ScaleIn } from '@/components/shared/Animations'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { useAuth } from '@/lib/hooks/useAuth'

interface Certificate {
  id: string
  certificate_number: string
  course_title: string
  recipient_name: string
  issue_date: string
  score: number | null
}

interface Achievement {
  _id: string
  title: string
  description: string
  year: string
  type: 'award' | 'certification' | 'milestone' | 'project' | 'publication'
  link?: string
  image?: string
  issuer?: string
  order: number
  featured: boolean
}

const typeConfig: Record<string, { color: string; bg: string; border: string; glow: string; icon: any }> = {
  award: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'rgba(251,191,36,0.15)', icon: Trophy },
  certification: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: 'rgba(52,211,153,0.15)', icon: Award },
  milestone: { color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20', glow: 'rgba(167,139,250,0.15)', icon: Milestone },
  project: { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', glow: 'rgba(192,132,252,0.15)', icon: Star },
  publication: { color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20', glow: 'rgba(244,114,182,0.15)', icon: BookOpen },
}

const ease = [0.25, 0.46, 0.45, 0.94]

export default function AchievementsPage() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [resumeUrl, setResumeUrl] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/achievements')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setAchievements(
            d.data
              .map((a: any) => ({
                _id: a.id,
                title: a.title,
                description: a.description,
                year: String(a.date || '').slice(0, 4),
                type: (a.category || 'milestone') as Achievement['type'],
                link: a.certificate_url || '',
                image: a.image_url || '',
                issuer: a.issuer || '',
                order: a.order_index || 0,
                featured: a.is_published || false,
              }))
              .sort((a: Achievement, b: Achievement) => Number(b.year) - Number(a.year))
          )
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user) return
    fetch('/api/certificates/me')
      .then(r => r.json())
      .then(d => { if (d.success) setCertificates(d.data || []) })
      .catch(() => {})
  }, [user])

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.resume_url) setResumeUrl(d.data.resume_url) })
      .catch(() => {})
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-12 w-12 border-2 border-brand-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const certifications = achievements.filter(a => a.type === 'certification')
  const timeline = achievements.filter(a => a.type !== 'certification')

  return (
    <main id="main-content" className="min-h-screen bg-surface-primary py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <MetadataInjector title="Achievements" description="Milestones, awards, certificates, and recognitions along Hamed Hussein's journey as a developer." url="/achievements" />
        <Breadcrumbs items={[{ label: 'Achievements' }]} />

        <SectionHeading
          eyebrow="Recognition & Milestones"
          title="Achievements"
          highlight="& Certificates"
          description="Milestones, awards, and credentials earned along the journey."
        />

        {/* ── Certificates I obtained ── */}
        {certifications.length > 0 && (
          <FadeIn className="mb-20">
            <div className="text-center mb-8">
              <span className="eyebrow mb-4">Credentials</span>
              <h2 className="display text-3xl md:text-4xl text-text-primary">
                Certificates I <span className="gradient-text">Obtained</span>
              </h2>
              <p className="text-text-secondary mt-3 max-w-xl mx-auto">Industry certifications and credentials earned over the years.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certifications.map(c => {
                const target = c.link || c.image || '#'
                const content = (
                  <>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border-primary bg-surface-tertiary flex items-center justify-center">
                      {c.image ? (
                        <Image src={c.image} alt={c.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                      ) : (
                        <Award className="h-12 w-12 text-text-muted opacity-50" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-brand-primary transition-colors">{c.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-text-muted">{c.issuer || ''}</span>
                        <span className="text-xs font-bold text-brand-primary">{c.year}</span>
                      </div>
                    </div>
                  </>
                )
                return (
                  <motion.div key={c._id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }} className="group rounded-2xl border border-border-primary bg-surface-card/60 overflow-hidden card-hover">
                    {target !== '#' ? (
                      <a href={target} target="_blank" rel="noopener noreferrer" className="block h-full">{content}</a>
                    ) : (
                      <div className="h-full">{content}</div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </FadeIn>
        )}

        {/* ── Timeline ── */}
        {timeline.length > 0 && (
          <div className="relative mb-20">
            <div className="text-center mb-10">
              <span className="eyebrow mb-4">The journey</span>
              <h2 className="display text-3xl md:text-4xl text-text-primary">Timeline</h2>
            </div>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, ease }}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-primary/40 via-brand-primary/10 to-transparent origin-top"
            />

            {timeline.map((achievement, i) => {
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
                  className={`relative mb-14 pl-14 md:pl-0 ${isLeft ? 'md:pr-[52%]' : 'md:pl-[52%]'}`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 300, damping: 15 }}
                    className="absolute left-2.5 md:left-1/2 md:-translate-x-1/2 top-2 z-10"
                  >
                    <div className="w-4 h-4 rounded-full bg-brand-primary border-4 border-surface-primary" />
                  </motion.div>

                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease }} className="bg-surface-card/50 border border-border-primary rounded-2xl p-6 hover:border-border-primary transition-all duration-300 relative overflow-hidden group">
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${config.glow}, transparent 70%)` }}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-primary text-white">{achievement.year}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${config.bg} ${config.border} ${config.color}`}>
                          <Icon className="h-3 w-3 inline mr-1" />
                          {achievement.type}
                        </span>
                      </div>
                      <h3 className="text-text-primary font-semibold text-lg mb-2 group-hover:text-brand-primary transition-colors duration-300">{achievement.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{achievement.description}</p>
                      {achievement.link && (
                        <motion.a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 4 }}
                          className="inline-flex items-center gap-1.5 mt-3 text-sm text-brand-primary hover:underline transition-colors"
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
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-surface-tertiary/50 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-text-muted" />
            </div>
            <p className="text-text-muted text-lg">No achievements yet</p>
          </motion.div>
        )}

        {/* ── My earned course certificates (logged-in student) ── */}
        {certificates.length > 0 && (
          <FadeIn className="mt-20">
            <div className="text-center mb-8">
              <span className="eyebrow mb-4">My Credentials</span>
              <h2 className="display text-3xl md:text-4xl text-text-primary">
                My <span className="gradient-text">Certificates</span>
              </h2>
              <p className="text-text-secondary mt-3 max-w-xl mx-auto">Every course you complete earns a verifiable certificate — all in one place.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {certificates.map(c => (
                <Link key={c.id} href={`/verify/${c.certificate_number}`} className="group flex items-center gap-4 rounded-2xl border border-border-primary bg-surface-card/60 p-5 card-hover">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
                    <BadgeCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary truncate group-hover:text-brand-primary transition-colors">{c.course_title}</h3>
                    <p className="text-xs text-text-muted">
                      {new Date(c.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      {c.score !== null && c.score !== undefined ? ` · ${c.score}%` : ''}
                    </p>
                    <p className="text-[11px] font-mono text-text-muted truncate">{c.certificate_number}</p>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        )}

        {/* ── Resume / CV ── */}
        <ScaleIn delay={0.2} className="mt-20">
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="relative bg-surface-card/50 border border-border-primary rounded-2xl p-8 text-center overflow-hidden group">
            <div className="relative z-10">
              <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">Resume / CV</h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">Download my complete resume with detailed experience, education, and skills.</p>
              {resumeUrl ? (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium transition-all">
                  <Download className="h-4 w-4" /> Download Resume
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border-primary text-text-muted text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Resume coming soon
                </span>
              )}
            </div>
          </motion.div>
        </ScaleIn>
      </div>
    </main>
  )
}
