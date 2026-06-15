'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Loader2, MapPin, Building2, Briefcase, ExternalLink, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { JobPostingJsonLd } from '@/components/shared/JsonLd'

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

  const salary = job.salaryMin ? `$${job.salaryMin.toLocaleString()}${job.salaryMax ? ` - $${job.salaryMax.toLocaleString()}` : ''}` : ''
  const benefits = job.niceToHave || job.benefits || []

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-4xl">
        <MetadataInjector title={`${job.title} at ${job.company}`} description={job.description} url={`/jobs/${id}`} />
        <Breadcrumbs items={[{ label: 'Jobs', href: '/jobs' }, { label: `${job.title} at ${job.company}` }]} />
        <JobPostingJsonLd title={job.title} description={job.description} datePosted={job.createdAt} jobLocation={job.location} employmentType={job.type} salaryMin={job.salaryMin} salaryMax={job.salaryMax} currency={job.salaryCurrency} />
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">{job.type}</Badge>
          <Badge variant="outline">{job.locationType}</Badge>
          <Badge variant="outline">{job.category}</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-text-muted mb-6">
          <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {job.company}</span>
          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
          {salary && <span className="flex items-center gap-1 text-green-500 font-medium"><DollarSign className="h-4 w-4" /> {salary}</span>}
        </div>
        {job.companyLogo && <img src={job.companyLogo} alt={`${job.company} logo`} loading="lazy" className="h-16 rounded-lg mb-6" />}
        <p className="text-lg text-text-secondary mb-8">{job.description}</p>
        {job.requirements?.length > 0 && (
          <Card className="mb-6"><CardContent className="p-6">
            <h3 className="font-semibold mb-3">Requirements</h3>
            <ul className="space-y-2">{job.requirements.map((r: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {r}</li>)}</ul>
          </CardContent></Card>
        )}
        {benefits.length > 0 && (
          <Card className="mb-8"><CardContent className="p-6">
            <h3 className="font-semibold mb-3">Nice to Have</h3>
            <ul className="space-y-2">{benefits.map((b: string, i: number) => <li key={i} className="text-sm text-text-secondary">✓ {b}</li>)}</ul>
          </CardContent></Card>
        )}
        <div className="flex gap-3">
          {job.applicationUrl ? (
            <Button className="gradient-bg text-white" asChild><a href={job.applicationUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> Apply Now</a></Button>
          ) : (
            <Button className="gradient-bg text-white" asChild><Link href={`/contact?subject=Job%20Application%3A%20${encodeURIComponent(job.title)}&message=I%27m%20applying%20for%20the%20${encodeURIComponent(job.title)}%20position%20at%20${encodeURIComponent(job.company)}.`}>Apply Now</Link></Button>
          )}
        </div>
      </div>
    </main>
  )
}
