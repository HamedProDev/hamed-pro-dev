'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShareButtons } from '@/components/shared/ShareButtons'
import { ExternalLink, Github } from 'lucide-react'

interface ProjectDetailProps {
  title: string
  description: string
  longDescription: string
  techStack: string[]
  status: string
  demoUrl?: string
  sourceUrl?: string
  coverImage?: string
}

export function ProjectDetail({ title, description, longDescription, techStack, status, demoUrl, sourceUrl }: ProjectDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge variant="outline" className="mb-3">{status}</Badge>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-text-secondary">{description}</p>
        </div>
        <ShareButtons title={title} url={typeof window !== 'undefined' ? window.location.href : ''} />
      </div>
      <div className="flex flex-wrap gap-2">{techStack.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}</div>
      <div className="flex gap-3">
        {demoUrl && <Button asChild><a href={demoUrl} target="_blank"><ExternalLink className="h-4 w-4 mr-2" />Live Demo</a></Button>}
        {sourceUrl && <Button variant="outline" asChild><a href={sourceUrl} target="_blank"><Github className="h-4 w-4 mr-2" />Source Code</a></Button>}
      </div>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{longDescription}</ReactMarkdown>
      </div>
    </div>
  )
}
