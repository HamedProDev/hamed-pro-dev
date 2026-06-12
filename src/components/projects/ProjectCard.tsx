import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Github } from 'lucide-react'

interface ProjectCardProps {
  title: string
  slug: string
  description: string
  techStack: string[]
  status: string
  demoUrl?: string
  sourceUrl?: string
}

const statusColors: Record<string, string> = {
  live: 'bg-green-500/20 text-green-400 border-green-500/30',
  'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export function ProjectCard({ title, slug, description, techStack, status, demoUrl, sourceUrl }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}>
      <Card className="h-full card-hover group">
        <div className="h-48 bg-dark-600 rounded-t-xl" />
        <CardContent className="p-6">
          <Badge variant="outline" className={`mb-3 ${statusColors[status] || ''}`}>{status}</Badge>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors">{title}</h3>
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">{techStack.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
          <div className="flex gap-2" onClick={e => e.preventDefault()}>
            {demoUrl && <a href={demoUrl} target="_blank" className="text-xs text-brand-primary hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" />Demo</a>}
            {sourceUrl && <a href={sourceUrl} target="_blank" className="text-xs text-text-secondary hover:text-brand-primary flex items-center gap-1"><Github className="h-3 w-3" />Code</a>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
