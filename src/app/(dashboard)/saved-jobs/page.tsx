'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Bookmark, Loader2, MapPin, Building2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Job {
  _id: string
  title: string
  company: string
  location: string
  type: string
}

export default function SavedJobsPage() {
  const { data: session, status } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetch('/api/users/me').then(r => r.json()).then(d => {
        if (d.data?.savedJobs?.length) {
          Promise.all(
            d.data.savedJobs.map((id: string) =>
              fetch(`/api/jobs/${id}`).then(r => r.json()).then(d => d.data).catch(() => null)
            )
          ).then(results => {
            setJobs(results.filter(Boolean))
            setLoading(false)
          })
        } else {
          setLoading(false)
        }
      }).catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [session])

  if (status === 'loading' || loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl font-bold mb-4">Saved Jobs</h1>
        <p className="text-text-muted mb-6">Please sign in to see saved jobs.</p>
        <Button asChild className="gradient-bg text-white"><Link href="/login">Sign In</Link></Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Saved Jobs</h1>
      {jobs.length === 0 ? (
        <div className="rounded-xl border border-border-primary bg-surface-card p-12 text-center">
          <Bookmark className="h-12 w-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
          <p className="text-sm text-text-secondary mb-4">Browse jobs and save the ones you like.</p>
          <Button asChild className="gradient-bg text-white"><Link href="/jobs">Browse Jobs</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(j => (
            <Link key={j._id} href={`/jobs/${j._id}`}>
              <Card className="card-hover">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{j.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                      <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {j.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.location}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{j.type}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
