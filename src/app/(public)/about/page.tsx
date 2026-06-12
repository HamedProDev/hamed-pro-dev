'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Calendar, Briefcase, Award, Users, Code2, Heart, ArrowRight, Star, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

const tabs = ['About', 'Experience', 'Education']

const experiences = [
  { role: 'Senior Fullstack Developer', company: 'NovaSoft Solutions', period: '2023 - Present', desc: 'Leading development of enterprise web applications using Next.js, TypeScript, and cloud technologies.', tech: ['Next.js', 'TypeScript', 'AWS', 'MongoDB'] },
  { role: 'Fullstack Developer', company: 'Kwanda Facility', period: '2021 - 2023', desc: 'Built and maintained multiple client projects including e-commerce platforms and management systems.', tech: ['React', 'Node.js', 'PostgreSQL', 'Docker'] },
  { role: 'Frontend Developer', company: 'TechStart Rwanda', period: '2020 - 2021', desc: 'Developed responsive web interfaces and contributed to the design system.', tech: ['React', 'TypeScript', 'Tailwind CSS'] },
]

const education = [
  { degree: 'B.Sc. Computer Science', school: 'University of Rwanda', period: '2016 - 2020', desc: 'Specialized in software engineering and distributed systems.' },
  { degree: 'Fullstack Web Development', school: 'Andela Learning Program', period: '2019', desc: 'Intensive bootcamp covering React, Node.js, and agile methodologies.' },
]

const skills = [
  { name: 'React / Next.js', level: 95 },
  { name: 'TypeScript', level: 92 },
  { name: 'Node.js / Express', level: 90 },
  { name: 'Python / Django', level: 85 },
  { name: 'MongoDB / PostgreSQL', level: 88 },
  { name: 'AWS / Cloud', level: 80 },
  { name: 'Docker / DevOps', level: 78 },
  { name: 'UI/UX Design', level: 75 },
]

const stats = [
  { value: '5+', label: 'Years Experience', icon: Briefcase },
  { value: '30+', label: 'Projects Completed', icon: Code2 },
  { value: '15+', label: 'Happy Clients', icon: Users },
  { value: '10+', label: 'Technologies', icon: Award },
]

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('About')

  return (
    <div className="section-padding pt-24">
      <div className="container-wide">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">👋 About Me</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hi, I&apos;m <span className="gradient-text">Hamed Hussein</span></h1>
            <p className="text-lg text-text-secondary mb-4">Senior Fullstack Developer from Kigali, Rwanda</p>
            <p className="text-text-secondary mb-6">I build modern web applications, mobile apps, and AI-powered solutions. Passionate about creating technology that makes a difference in Africa and beyond.</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Kigali, Rwanda</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Available for work</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 5.0 Client Rating</span>
            </div>
            <div className="flex gap-3">
              <Button asChild className="gradient-bg text-white"><Link href="/contact">Contact Me <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
              <Button asChild variant="outline"><a href="#"><Download className="h-4 w-4 mr-1" /> Download CV</a></Button>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-transparent rounded-3xl blur-3xl" />
            <div className="relative w-72 h-72 rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">HH</div>
                <p className="text-sm text-text-muted">Senior Fullstack Developer</p>
                <p className="text-xs text-text-muted">Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="card-hover text-center"><CardContent className="p-6">
                <s.icon className="h-6 w-6 text-brand-primary mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{s.value}</div>
                <div className="text-xs text-text-muted">{s.label}</div>
              </CardContent></Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/5 mb-8">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
              'pb-3 px-1 text-sm font-medium transition-all border-b-2 -mb-px',
              activeTab === tab ? 'border-brand-primary text-brand-primary' : 'border-transparent text-text-muted hover:text-text-secondary'
            )}>{tab}</button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'About' && (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Bio */}
            <div>
              <h3 className="text-xl font-semibold mb-4">My Journey</h3>
              <div className="space-y-4 text-text-secondary">
                <p>I started my programming journey in university, building simple websites and falling in love with the power of code. Over the past 5+ years, I&apos;ve evolved into a fullstack developer with expertise spanning frontend frameworks, backend systems, cloud infrastructure, and AI/ML.</p>
                <p>Based in Kigali, Rwanda, I&apos;m passionate about building technology that solves real problems in Africa. From agricultural marketplaces to enterprise management systems, I focus on creating solutions that are both technically excellent and impactful.</p>
                <p>When I&apos;m not coding, you&apos;ll find me contributing to open-source projects, mentoring junior developers, and exploring the latest in AI and cloud computing.</p>
              </div>
            </div>
            {/* Skills */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Technical Skills</h3>
              <div className="space-y-4">
                {skills.map((s, i) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-text-muted">{s.level}%</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.level}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full rounded-full gradient-bg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Experience' && (
          <div className="space-y-6">
            {experiences.map((e, i) => (
              <motion.div key={e.role} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="card-hover"><CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{e.role}</h3>
                      <p className="text-brand-primary text-sm">{e.company}</p>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">{e.period}</Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">{e.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {e.tech.map(t => <Badge key={t} className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/20">{t}</Badge>)}
                  </div>
                </CardContent></Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'Education' && (
          <div className="space-y-6">
            {education.map((e, i) => (
              <motion.div key={e.degree} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="card-hover"><CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2"><GraduationCap className="h-5 w-5 text-brand-primary" /> {e.degree}</h3>
                      <p className="text-brand-primary text-sm">{e.school}</p>
                    </div>
                    <Badge variant="outline" className="w-fit text-xs">{e.period}</Badge>
                  </div>
                  <p className="text-sm text-text-secondary">{e.desc}</p>
                </CardContent></Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-r from-dark-700 to-dark-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Let&apos;s work together</h3>
            <p className="text-text-secondary">Have a project in mind? Let&apos;s build something amazing.</p>
          </div>
          <Button asChild className="gradient-bg text-white shrink-0"><Link href="/contact">Start a Project <ArrowRight className="h-4 w-4 ml-1" /></Link></Button>
        </div>
      </div>
    </div>
  )
}
