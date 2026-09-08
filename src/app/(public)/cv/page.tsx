'use client'
import { useState, useEffect } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

export default function CVPage() {
  const [resumeUrl, setResumeUrl] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.resume_url) setResumeUrl(d.data.resume_url) })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  return (
    <main id="main-content" className="section-padding">
      <div className="container-wide max-w-3xl">
        <MetadataInjector title="Resume / CV" description="Hamed Hussein — Fullstack & AI/ML Engineer. Resume with experience, education, skills, and achievements." url="/cv" />
        <Breadcrumbs items={[{ label: 'Resume / CV' }]} />
        <h1 className="text-4xl font-bold mb-2">Hamed Hussein</h1>
        <p className="text-brand-primary text-lg mb-1">Fullstack & AI/ML Engineer</p>
        <p className="text-text-secondary mb-6">Kigali, Rwanda • hello@hamedpro.rw • github.com/hamedProDev</p>

        {loaded ? (
          resumeUrl ? (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium mb-8 transition-transform hover:scale-[1.02]">
              <Download className="h-4 w-4" /> Download Resume (PDF)
            </a>
          ) : (
            <p className="text-sm text-text-muted mb-8 inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Resume will be uploaded soon.
            </p>
          )
        ) : (
          <p className="text-sm text-text-muted mb-8 inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        )}

        <div className="space-y-8">
          <section><h2 className="text-xl font-bold border-b border-dark-500 pb-2 mb-4">Experience</h2><div className="space-y-4"><div><h3 className="font-semibold">Fullstack Developer — Kwanda Facility</h3><p className="text-sm text-text-muted">2021 — Present</p><p className="text-sm text-text-secondary mt-1">Building enterprise systems and digital solutions for Rwandan businesses.</p></div></div></section>
          <section><h2 className="text-xl font-bold border-b border-dark-500 pb-2 mb-4">Skills</h2><div className="flex flex-wrap gap-2">{['React','Next.js','TypeScript','Node.js','Python','MongoDB','Docker','AI/ML'].map(s => <span key={s} className="px-3 py-1 text-xs rounded-full border border-dark-500 bg-dark-700 text-text-secondary">{s}</span>)}</div></section>
          <section><h2 className="text-xl font-bold border-b border-dark-500 pb-2 mb-4">Education</h2><p className="font-semibold">Computer Science</p><p className="text-sm text-text-secondary">University — Focus on AI/ML</p></section>
        </div>
      </div>
    </main>
  )
}
