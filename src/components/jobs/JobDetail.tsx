'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShareButtons } from '@/components/shared/ShareButtons'
import { MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react'

interface JobDetailProps {
  title: string
  company: string
  location: string
  locationType: string
  type: string
  description: string
  requirements: string[]
  niceToHave: string[]
  skills: string[]
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  applicationUrl?: string
  applicationEmail?: string
}

export function JobDetail({ title, company, location, locationType, type, description, requirements, niceToHave, skills, salaryMin, salaryMax, salaryCurrency, applicationUrl, applicationEmail }: JobDetailProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-text-secondary">{company}</p>
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-text-muted">
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {location}</span>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {type}</span>
          <Badge variant="outline" className="capitalize">{locationType}</Badge>
          {salaryMin && <span className="flex items-center gap-1 text-brand-primary"><DollarSign className="h-4 w-4" /> {salaryMin.toLocaleString()}{salaryMax ? ` - ${salaryMax.toLocaleString()}` : ''} {salaryCurrency}</span>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">{skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
      </div>
      {requirements.length > 0 && (
        <div><h3 className="text-lg font-semibold mb-3">Requirements</h3>
          <ul className="space-y-2">{requirements.map((r, i) => <li key={i} className="text-text-secondary text-sm flex items-start gap-2"><span className="text-brand-primary mt-1">•</span>{r}</li>)}</ul>
        </div>
      )}
      {niceToHave.length > 0 && (
        <div><h3 className="text-lg font-semibold mb-3">Nice to Have</h3>
          <ul className="space-y-2">{niceToHave.map((n, i) => <li key={i} className="text-text-secondary text-sm flex items-start gap-2"><span className="text-brand-accent mt-1">•</span>{n}</li>)}</ul>
        </div>
      )}
      <div className="flex gap-3">
        {applicationUrl && <Button asChild><a href={applicationUrl} target="_blank"><ExternalLink className="h-4 w-4 mr-2" />Apply Now</a></Button>}
        {applicationEmail && <Button asChild><a href={`mailto:${applicationEmail}`}><ExternalLink className="h-4 w-4 mr-2" />Apply via Email</a></Button>}
      </div>
    </div>
  )
}
