import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, Github, CircleDot } from 'lucide-react' // Added CircleDot
import { Button } from '@/components/ui/button' // Added Button import
import { cn } from '@/lib/utils/cn' // Added cn import

interface ProjectCardProps {
  title: string
  slug: string
  description: string
  techStack: string[]
  status: string
  demoUrl?: string
  sourceUrl?: string
  imageUrl?: string // Added imageUrl for gradient fallback
  gradientClass?: string // Added gradientClass for fallback
}

const statusColors: Record<string, string> = {
  live: 'bg-green-500/20 text-green-400 border-green-500/30',
  completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'in progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  beta: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  maintained: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const statusDotColors: Record<string, string> = {
  live: 'text-green-500',
  completed: 'text-green-500',
  'in-progress': 'text-yellow-500',
  'in progress': 'text-yellow-500',
  beta: 'text-blue-500',
  maintained: 'text-cyan-500',
  archived: 'text-gray-500',
}

export function ProjectCard({ title, slug, description, techStack, status, demoUrl, sourceUrl, imageUrl, gradientClass }: ProjectCardProps) {
  const defaultGradient = 'bg-gradient-to-br from-surface-card to-surface-secondary'
  const statusKey = (status || '').toLowerCase()
  return (
    <Link href={`/projects/${slug}`}>
      <Card className="h-full card-hover group overflow-hidden">
        <div className={cn(
          'h-48 rounded-t-xl overflow-hidden relative',
          imageUrl ? '' : (gradientClass || defaultGradient)
        )}>
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-brand-primary/40">{title.charAt(0)}</span>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className={cn('flex items-center gap-1', statusColors[statusKey] || '')}>
              <CircleDot className={cn('h-3 w-3', statusDotColors[statusKey] || '')} />
              {status || 'Project'}
            </Badge>
            {techStack.length > 0 && <span className="text-xs text-text-muted">{techStack.length} tech</span>}
          </div>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors">{title}</h3>
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">{description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">{techStack.slice(0, 4).map(t => <Badge key={t} variant="secondary" className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/30">{t}</Badge>)}</div>
          <div className="flex gap-2" onClick={e => e.preventDefault()}>
            {demoUrl && (
              <Button size="sm" asChild className="gradient-bg text-white">
                <a href={demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1" />Demo</a>
              </Button>
            )}
            {sourceUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer"><Github className="h-3 w-3 mr-1" />Code</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
