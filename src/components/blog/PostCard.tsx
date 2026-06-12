import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface PostCardProps {
  title: string
  slug: string
  excerpt: string
  category: string
  readingTime: number
  coverImage?: string
}

export function PostCard({ title, slug, excerpt, category, readingTime }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="h-full card-hover group">
        <div className="h-48 bg-dark-600 rounded-t-xl" />
        <CardContent className="p-6">
          <Badge variant="secondary" className="mb-3">{category}</Badge>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">{title}</h3>
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">{excerpt}</p>
          <div className="flex items-center text-xs text-text-muted">
            <Clock className="h-3 w-3 mr-1" /> {readingTime} min read
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
