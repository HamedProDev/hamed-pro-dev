'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Github, Loader2, Tag } from 'lucide-react'
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
    fetch(`/api/projects/${slug}`).then(r => r.json()).then(d => {
      if (d.success && d.data) setProject(d.data)
      else {
        fetch('/api/projects').then(r => r.json()).then(d => {
          if (d.success) {
            const found = d.data.find((p: any) => p.slug === slug || p._id === slug)
            if (found) setProject(found)
          }
          setLoading(false)
        }).catch(() => setLoading(false))
        return
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  if (!project) return (
    <div className="section-padding text-center">
      <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
      <Button asChild><Link href="/projects">Back to Projects</Link></Button>
    </div>
  )

  const techStack = project.techStack || project.tags || []
  const demoUrl = project.demoUrl || project.liveUrl || ''
  const sourceUrl = project.sourceUrl || project.githubUrl || ''

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-4xl">
        <MetadataInjector title={project.title} description={project.description} url={`/projects/${slug}`} />
        <Breadcrumbs items={[{ label: 'Projects', href: '/projects' }, { label: project.title }]} />
        {project.coverImage && <img src={project.coverImage} alt={`${project.title} project screenshot`} loading="lazy" className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">{project.category}</Badge>
          {project.featured && <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Featured</Badge>}
          {project.status && <Badge className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">{project.status}</Badge>}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
        <p className="text-lg text-text-secondary mb-8">{project.description}</p>
        {project.longDescription && <div className="prose prose-invert max-w-none mb-8"><p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{project.longDescription}</p></div>}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {techStack.map((t: string) => <Badge key={t} variant="outline" className="text-xs"><Tag className="h-3 w-3 mr-1" />{t}</Badge>)}
          </div>
        )}
        <div className="flex gap-3">
          {demoUrl && <Button asChild><a href={demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> Live Demo</a></Button>}
          {sourceUrl && <Button asChild variant="outline"><a href={sourceUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4 mr-2" /> Source Code</a></Button>}
        </div>
      </div>
    </main>
  )
}
