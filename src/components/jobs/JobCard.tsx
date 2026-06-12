import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Clock } from 'lucide-react'

interface JobCardProps {
  _id: string
  title: string
  company: string
  location: string
  locationType: string
  type: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  deadline?: string
  skills: string[]
}

export function JobCard({ _id, title, company, location, locationType, type, salaryMin, salaryMax, salaryCurrency, deadline, skills }: JobCardProps) {
  return (
    <Link href={`/jobs/${_id}`}>
      <Card className="card-hover group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold group-hover:text-brand-primary transition-colors">{title}</h3>
            <Badge variant="outline" className="capitalize shrink-0">{locationType}</Badge>
          </div>
          <p className="text-sm text-text-secondary mb-1">{company}</p>
          <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {location}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {type}</span>
          </div>
          {salaryMin && <p className="text-sm text-brand-primary font-medium mb-3">{salaryCurrency} {salaryMin.toLocaleString()}{salaryMax ? ` - ${salaryMax.toLocaleString()}` : ''}</p>}
          <div className="flex flex-wrap gap-1.5">{skills.slice(0, 5).map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div>
        </CardContent>
      </Card>
    </Link>
  )
}
