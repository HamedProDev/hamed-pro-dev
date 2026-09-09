'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Smartphone, Brain, Code2, Gamepad2, Briefcase, CheckCircle2, MessageCircle, Star, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

interface HireService { title: string; description: string; price: string }

const iconPool = [Globe, Smartphone, Brain, Code2, Gamepad2, Briefcase]
const gradientPool = [
  'from-violet-500/20 to-violet-600/10',
  'from-green-500/20 to-green-600/10',
  'from-purple-500/20 to-purple-600/10',
  'from-amber-500/20 to-orange-600/10',
  'from-teal-500/20 to-teal-600/10',
  'from-pink-500/20 to-pink-600/10',
]

const defaultServices: HireService[] = [
  { title: 'Web Development', description: 'Full-stack web apps with React, Next.js, Node.js, Supabase, and modern APIs.', price: 'From $500' },
  { title: 'Mobile Development', description: 'Cross-platform mobile apps with React Native, Kotlin, and Flutter.', price: 'From $800' },
  { title: 'AI/ML Solutions', description: 'Custom AI models, data pipelines, NLP, computer vision, and ML integration.', price: 'From $1000' },
  { title: 'Game Development', description: 'Interactive games and simulations with Unity, Phaser, Three.js, and WebGL.', price: 'From $700' },
  { title: 'Technical Consultation', description: 'Architecture review, code audits, team mentoring, and technical strategy.', price: 'From $100/hr' },
]

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '30+', label: 'Projects Completed' },
  { value: '15+', label: 'Happy Clients' },
  { value: '10+', label: 'Technologies' },
]

const whyMe = [
  'Full-stack expertise across web, mobile, and AI/ML',
  'Based in Rwanda, working globally at competitive rates',
  'Fast turnaround with clean, maintainable code',
  'Ongoing support and maintenance after delivery',
]

export default function HirePage() {
  const [whatsappNumber, setWhatsappNumber] = useState('+250793553492')
  const [resumeUrl, setResumeUrl] = useState('')
  const [services, setServices] = useState<HireService[]>(defaultServices)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data) {
          if (d.data.integrations?.whatsappNumber) setWhatsappNumber(d.data.integrations.whatsappNumber)
          if (d.data.resume_url) setResumeUrl(d.data.resume_url)
          if (Array.isArray(d.data.hire_services) && d.data.hire_services.length > 0) {
            setServices(d.data.hire_services.filter((s: HireService) => s && s.title))
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleNegotiate = (serviceName: string) => {
    const msg = encodeURIComponent(`Hi Hamed, I'm interested in your ${serviceName} services. Can we discuss pricing?`)
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide">
        <MetadataInjector title="Hire Me" description="Hire Hamed Hussein for web development, mobile apps, AI/ML, game development, and technical consultation. All prices negotiable." url="/hire" />
        <Breadcrumbs items={[{ label: 'Hire Me' }]} />

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">🟢 Available for Work</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Let&apos;s Build Something <span className="gradient-text">Amazing Together</span></h1>
          <p className="text-lg text-text-secondary">Available for freelance and contract work. Based in Kigali, Rwanda — working globally. All prices are negotiable.</p>
          {resumeUrl && (
            <Button asChild className="mt-5 gradient-bg text-white">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4 mr-2" /> Download Resume</a>
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center p-6 rounded-2xl bg-surface-card border border-border-primary">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Services */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Services & Pricing</h2>
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => {
                const Icon = iconPool[i % iconPool.length]
                const gradient = gradientPool[i % gradientPool.length]
                return (
                  <motion.div key={`${s.title}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Card className="h-full card-hover group overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                      <CardContent className="p-6">
                        <Icon className="h-10 w-10 text-brand-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                        <p className="text-sm text-text-secondary mb-4">{s.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-primary font-semibold">{s.price}</span>
                          <span className="text-xs text-amber-500 font-medium flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400" /> Negotiable</span>
                        </div>
                        <Button size="sm" className="w-full mt-4 gradient-bg text-white" onClick={() => handleNegotiate(s.title)}>
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Negotiate Price
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Why Me */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Why Work With Me?</h2>
            <div className="space-y-3">
              {whyMe.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-8 rounded-2xl bg-surface-card border border-border-primary">
            <h3 className="text-lg font-semibold mb-2">Ready to start?</h3>
            <p className="text-sm text-text-secondary mb-4">Let&apos;s discuss your project. All prices are negotiable — message me on WhatsApp for a quick chat.</p>
            <div className="flex flex-col gap-3">
              <Button size="lg" className="gradient-bg text-white w-full" onClick={() => handleNegotiate('general')}>
                <MessageCircle className="h-4 w-4 mr-2" /> Chat on WhatsApp
              </Button>
              {resumeUrl && (
                <Button size="lg" variant="outline" asChild className="w-full">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4 mr-2" /> Download Resume</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
