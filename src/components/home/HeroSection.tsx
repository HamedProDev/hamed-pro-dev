'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Github, Linkedin, Twitter, Instagram, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const techBadges = [
  { name: 'Next.js', icon: 'N', color: 'bg-white text-black', x: '10%', y: '15%', delay: 0.5 },
  { name: 'Python', icon: '🐍', color: 'bg-yellow-500/20 text-yellow-400', x: '75%', y: '10%', delay: 0.7 },
  { name: 'TypeScript', icon: 'TS', color: 'bg-blue-500/20 text-blue-400', x: '5%', y: '65%', delay: 0.9 },
  { name: 'Tailwind CSS', icon: '🌊', color: 'bg-cyan-500/20 text-cyan-400', x: '80%', y: '60%', delay: 1.1 },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.15),transparent_60%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="container-wide relative z-10 grid md:grid-cols-2 gap-8 items-center">
        {/* Left content */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" /></span>
              <span className="text-sm text-green-400">Available for work</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-2 leading-tight">
            Hi, I&apos;m
          </motion.h1>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight gradient-text">
            Hamed Hussein
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-text-secondary mb-1">
            Full Stack Developer & AI Engineer
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="text-lg text-text-secondary mb-8">
            Building scalable solutions that make an impact.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap items-center gap-4 mb-8">
            <Button size="lg" asChild className="gradient-bg text-white hover:shadow-lg hover:shadow-brand-primary/30 transition-all duration-200">
              <Link href="/projects">View My Work <ExternalLink className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/cv">Download CV <Download className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <p className="text-sm text-text-muted mb-3">Let&apos;s connect</p>
            <div className="flex items-center gap-3">
              {[{ icon: Github, href: 'https://github.com/HamedProDev' }, { icon: Linkedin, href: 'https://linkedin.com/in/hamedProDev' }, { icon: Twitter, href: 'https://twitter.com/hamedProDev' }, { icon: Instagram, href: 'https://instagram.com/hamedProDev' }].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 text-text-secondary hover:bg-brand-primary/20 hover:text-brand-primary transition-all duration-200">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right - Photo with floating tech badges */}
        <div className="relative flex justify-center items-center hidden md:flex">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative">
            {/* Glow behind photo */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 via-brand-secondary/20 to-brand-accent/30 rounded-full blur-3xl scale-75 opacity-60" />
            {/* Photo placeholder - gradient circle */}
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-dark-700 via-dark-600 to-dark-800 border-2 border-brand-primary/20 overflow-hidden flex items-center justify-center">
              <div className="text-6xl font-bold text-brand-primary/30">HP</div>
            </div>

            {/* Floating tech badges */}
            {mounted && techBadges.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: badge.delay }}
                className="absolute"
                style={{ left: badge.x, top: badge.y }}
              >
                <div className="animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-dark-800/90 backdrop-blur-sm shadow-lg`}>
                    <span className={`h-7 w-7 rounded-lg ${badge.color} flex items-center justify-center text-xs font-bold`}>{badge.icon}</span>
                    <span className="text-sm font-medium text-text-primary whitespace-nowrap">{badge.name}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
