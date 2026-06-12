import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Users, Star } from 'lucide-react'

interface CourseCardProps {
  title: string
  slug: string
  description: string
  level: string
  type: string
  duration: number
  enrolled: number
  rating: number
  coverImage?: string
}

export function CourseCard({ title, slug, description, level, type, duration, enrolled, rating }: CourseCardProps) {
  return (
    <Link href={`/courses/${slug}`}>
      <Card className="h-full card-hover group">
        <div className="h-48 bg-dark-600 rounded-t-xl" />
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs capitalize">{level}</Badge>
            <Badge variant={type === 'free' ? 'success' : 'default'} className="text-xs">{type === 'free' ? 'Free' : 'Premium'}</Badge>
          </div>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors">{title}</h3>
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.floor(duration / 60)}h</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {enrolled}</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {rating.toFixed(1)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
