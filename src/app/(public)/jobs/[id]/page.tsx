'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, MapPin, Building2, Clock, Briefcase, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function JobDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/jobs/${id}`).then(r => r.json()).then(d => {
      if (d.success) setJob(d.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  if (!job) return (
    <div className="section-padding text-center">
      <h1 className="text-4xl font-bold mb-4">Job Not Found</h1>
      <Button asChild><Link href="/jobs">Back to Jobs</Link></Button>
    </div>
  )

  return (
    <div className="section-padding pt-24">
      <div className="container-wide max-w-4xl">
        <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-6"><ArrowLeft className="h-4 w-4" /> Back to Jobs</Link>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">{job.type}</Badge>
          <Badge variant="outline">{job.locationType}</Badge>
          <Badge variant="outline">{job.category}</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-text-muted mb-6">
          <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {job.company}</span>
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
          {job.salary && <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.salary}</span>}
        </div>
        <p className="text-lg text-text-secondary mb-8">{job.description}</p>
        {job.requirements?.length > 0 && (
          <Card className="mb-6"><CardContent className="p-6">
            <h3 className="font-semibold mb-3">Requirements</h3>
            <ul className="space-y-2">{job.requirements.map((r: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {r}</li>)}</ul>
          </CardContent></Card>
        )}
        {job.benefits?.length > 0 && (
          <Card className="mb-8"><CardContent className="p-6">
            <h3 className="font-semibold mb-3">Benefits</h3>
            <ul className="space-y-2">{job.benefits.map((b: string, i: number) => <li key={i} className="text-sm text-text-secondary">✓ {b}</li>)}</ul>
          </CardContent></Card>
        )}
        <Button className="gradient-bg text-white" asChild><Link href="/contact">Apply Now</Link></Button>
      </div>
    </div>
  )
}
