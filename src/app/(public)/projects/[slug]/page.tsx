'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { ExternalLink, Github, Loader2, Tag, Building2, Calendar, User, Layers, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

export default function ProjectDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects?limit=100`)
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.data)) {
          const found = d.data.find((p: any) => p.slug === slug)
          if (found) setProject(found)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  if (!project) return (
    <div className="section-padding text-center">
      <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
      <Button asChild><Link href="/projects">Back to Projects</Link></Button>
    </div>
  )

  const techStack = project.tech_stack || project.tags || []
  const screenshots: string[] = Array.isArray(project.screenshots) ? project.screenshots.filter(Boolean) : []
  const demoUrl = project.demo_url || ''
  const sourceUrl = project.github_url || ''

  const meta = [
    { icon: Building2, label: 'Client', value: project.client },
    { icon: Calendar, label: 'Year', value: project.year },
    { icon: User, label: 'My Role', value: project.role },
    { icon: Layers, label: 'Status', value: project.status },
  ].filter(m => m.value)

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-4xl">
        <MetadataInjector title={project.title} description={project.description} image={project.image_url} url={`/projects/${slug}`} />
        <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: project.title }]} />

        {project.image_url && (
          <Image src={project.image_url} alt={`${project.title} cover`} width={1200} height={500} className="w-full h-64 md:h-96 object-cover rounded-3xl mb-8" unoptimized priority />
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">{project.category}</Badge>
          {project.featured && <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Featured</Badge>}
          {project.status && <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">{project.status}</Badge>}
        </div>

        <h1 className="display text-4xl md:text-5xl mb-4">{project.title}</h1>
        <p className="text-lg text-text-secondary mb-8">{project.description}</p>

        {/* Meta grid */}
        {meta.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {meta.map(m => (
              <div key={m.label} className="rounded-2xl border border-border-primary bg-surface-card/60 p-4">
                <m.icon className="h-4 w-4 text-brand-primary mb-2" />
                <p className="text-xs text-text-muted uppercase tracking-wide">{m.label}</p>
                <p className="text-sm font-medium text-text-primary">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        {project.content && (
          <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
            <ReactMarkdown>{project.content}</ReactMarkdown>
          </div>
        )}

        {techStack.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t: string) => (
                <Badge key={t} variant="outline" className="text-xs px-3 py-1"><Tag className="h-3 w-3 mr-1" />{t}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Screenshot gallery */}
        {screenshots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Screenshots</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {screenshots.map((s, i) => (
                <Image key={i} src={s} alt={`${project.title} screenshot ${i + 1}`} width={800} height={450} className="w-full h-52 object-cover rounded-2xl border border-border-primary" unoptimized />
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild className="gradient-bg text-white"><a href="/projects"><ArrowLeft className="h-4 w-4 mr-2" /> All Projects</a></Button>
          {demoUrl && <Button asChild><a href={demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> Live Demo</a></Button>}
          {sourceUrl && <Button asChild variant="outline"><a href={sourceUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4 mr-2" /> Source Code</a></Button>}
        </div>
      </div>
    </main>
  )
}
