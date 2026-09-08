'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { Award, Loader2, Download, ExternalLink, BadgeCheck, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MetadataInjector } from '@/components/shared/MetadataInjector'

interface Certificate {
  id: string
  certificate_number: string
  course_title: string
  recipient_name: string
  issue_date: string
  score: number | null
  is_verified: boolean
}

export default function CertificationPage() {
  const { user, isLoading } = useAuth()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (user) {
      fetch('/api/certificates/me')
        .then(r => r.json())
        .then(d => setCerts(d.data || []))
        .catch(() => {})
        .finally(() => setFetching(false))
    } else {
      setFetching(false)
    }
  }, [user])

  if (isLoading || fetching) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Award className="h-12 w-12 text-text-muted mb-4" />
        <h1 className="text-3xl font-bold mb-2">Certification</h1>
        <p className="text-text-muted mb-6">Sign in to view certificates you've earned.</p>
        <Button asChild className="gradient-bg text-white"><Link href="/login">Sign In</Link></Button>
      </div>
    )
  }

  return (
    <div>
      <MetadataInjector title="Certification" description="Certificates earned by completing free courses." url="/certification" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certification</h1>
        <p className="text-text-secondary">Complete courses to earn verifiable certificates. Each one has a unique ID anyone can verify.</p>
      </div>

      {certs.length === 0 ? (
        <Card className="card-hover">
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
            <p className="text-sm text-text-secondary mb-4">Complete a free course to earn your first certificate.</p>
            <Button asChild className="gradient-bg text-white"><Link href="/courses">Browse Courses</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {certs.map(cert => (
            <Card key={cert.id} className="card-hover overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 sm:p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10 pointer-events-none" />
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <Award className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wider">Certificate of Completion</p>
                        <h3 className="text-xl font-bold text-text-primary">{cert.course_title}</h3>
                        <p className="text-sm text-text-secondary">Awarded to <span className="font-medium text-text-primary">{cert.recipient_name}</span> · {new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified
                      </span>
                      <span className="font-mono text-xs text-text-muted">{cert.certificate_number}</span>
                    </div>
                  </div>
                  <div className="relative flex flex-wrap gap-2 mt-6">
                    <Button size="sm" className="gradient-bg text-white" asChild>
                      <Link href={`/verify/${cert.certificate_number}`}><Download className="h-3.5 w-3.5 mr-1" /> View / Print</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/verify/${cert.certificate_number}`}><ExternalLink className="h-3.5 w-3.5 mr-1" /> Verify</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
