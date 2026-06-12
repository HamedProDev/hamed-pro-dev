'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Github, Linkedin, Twitter, Youtube, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const roles = ['Fullstack Engineer', 'AI/ML Developer', 'Open Source Builder', 'Rwanda 🇷🇼 → Worldwide']

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: ReturnType<typeof setTimeout>
    if (!isDeleting && displayText === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    } else {
      timeout = setTimeout(() => {
        setDisplayText(isDeleting ? current.substring(0, displayText.length - 1) : current.substring(0, displayText.length + 1))
      }, isDeleting ? 50 : 100)
    }
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, roleIndex])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] opacity-70" /> {/* Adjusted glow opacity */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(99,102,241,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} /> {/* Adjusted dot opacity */}
      <div className="container-wide relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 mb-6 md:mb-8"> {/* Adjusted margin */}
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" /></span>
            <span className="text-sm text-green-400">Available for work</span>
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 md:mb-6"> {/* Adjusted margin */}
          Hello, I&apos;m <span className="gradient-text">Hamed Hussein</span>
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl sm:text-2xl text-text-secondary mb-6 md:mb-8 h-8"> {/* Adjusted margin */}
          {displayText}<span className="animate-blink">|</span> {/* Changed to animate-blink */}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 md:mb-10"> {/* Adjusted margin */}
          <Button size="lg" asChild className="gradient-bg text-white"><Link href="/projects">View My Work <ExternalLink className="ml-2 h-4 w-4" /></Link></Button> {/* Primary button style */}
          <Button size="lg" variant="outline" asChild><Link href="/cv">Download CV <Download className="ml-2 h-4 w-4" /></Link></Button> {/* Secondary button style */}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex items-center justify-center gap-3 md:gap-4"> {/* Adjusted gap */}
          {[{ icon: Github, href: 'https://github.com/hamedProDev' }, { icon: Linkedin, href: 'https://linkedin.com/in/hamedProDev' }, { icon: Twitter, href: 'https://twitter.com/hamedProDev' }, { icon: Youtube, href: 'https://youtube.com/@hamedProDev' }].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"> {/* Brand-colored circles */}
              <s.icon className="h-5 w-5" />
            </a>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ArrowDown className="h-6 w-6 text-text-muted animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
}
