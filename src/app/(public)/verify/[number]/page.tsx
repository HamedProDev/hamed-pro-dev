'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { CertificateDocument } from '@/components/courses/CertificateDocument'

interface VerifiedCert {
  certificate_number: string
  course_title: string
  recipient_name: string
  issue_date: string
  score: number | null
  verified: boolean
}

export default function VerifyCertificatePage() {
  const params = useParams()
  const number = params?.number as string
  const [cert, setCert] = useState<VerifiedCert | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!number) return
    fetch(`/api/certificates/${encodeURIComponent(number)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setCert(d.data)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [number])

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-3xl">
        <MetadataInjector
          title={cert ? `${cert.recipient_name} — ${cert.course_title} Certificate` : 'Verify Certificate'}
          description={cert ? `Verified certificate awarded to ${cert.recipient_name} for completing ${cert.course_title}.` : 'Verify a Hamed Hussein course certificate.'}
          image={`/verify/${number}/opengraph-image`}
          url={`/verify/${number}`}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
        ) : notFound || !cert ? (
          <Card className="card-hover">
            <CardContent className="p-12 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Certificate not found</h1>
              <p className="text-text-muted mb-6">This certificate number doesn&apos;t exist or has been revoked.</p>
              <Button asChild variant="outline"><Link href="/courses">Browse Courses</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <CertificateDocument
            certificateNumber={cert.certificate_number}
            courseTitle={cert.course_title}
            recipientName={cert.recipient_name}
            issueDate={cert.issue_date}
            score={cert.score}
            verified={cert.verified}
          />
        )}
      </div>
    </main>
  )
}
