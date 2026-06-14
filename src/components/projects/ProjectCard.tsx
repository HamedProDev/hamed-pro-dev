import Link from 'next/link'
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
  'in-progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const statusDotColors: Record<string, string> = {
  live: 'text-green-500',
  'in-progress': 'text-yellow-500',
  archived: 'text-gray-500',
}

export function ProjectCard({ title, slug, description, techStack, status, demoUrl, sourceUrl, imageUrl, gradientClass }: ProjectCardProps) {
  const defaultGradient = 'bg-gradient-to-br from-surface-card to-surface-secondary' // Default gradient
  return (
    <Link href={`/projects/${slug}`}>
      <Card className="h-full card-hover group">
        {/* Project Image/Gradient Fallback */}
        <div className={cn(
          "h-48 rounded-t-xl overflow-hidden relative",
          imageUrl ? "" : (gradientClass || defaultGradient) // Dynamic gradient fallback
        )}>
          {imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-cover" />} {/* Placeholder for actual image */}
        </div>
        <CardContent className="p-6">
          {/* Status Badge */}
          <Badge variant="outline" className={cn("mb-3 flex items-center gap-1", statusColors[status] || '')}> {/* Styled status badge */}
            <CircleDot className={cn("h-3 w-3", statusDotColors[status] || '')} />{status}
          </Badge>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors">{title}</h3>
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">{description}</p>
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">{techStack.map(t => <Badge key={t} variant="secondary" className="text-xs bg-brand-primary/10 text-brand-primary border-brand-primary/30">{t}</Badge>)}</div> {/* Indigo tech pills */}
          {/* Demo/Code Buttons */}
          <div className="flex gap-2" onClick={e => e.preventDefault()}> {/* Prevent navigation when clicking buttons */}
            {demoUrl && (
              <Button size="sm" asChild className="gradient-bg text-white hover:shadow-lg hover:shadow-brand-primary/20 transition-all duration-200"> {/* Gradient primary button */}
                <a href={demoUrl} target="_blank"><ExternalLink className="h-3 w-3 mr-1" />Demo</a>
              </Button>
            )}
            {sourceUrl && (
              <Button size="sm" variant="outline" asChild> {/* Outline secondary button */}
                <a href={sourceUrl} target="_blank"><Github className="h-3 w-3 mr-1" />Code</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
