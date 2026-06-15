'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Clock, Star, CheckCircle, BookOpen, Play, FileText, HelpCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { CourseJsonLd } from '@/components/shared/JsonLd'

const lessonTypeIcons: Record<string, any> = { video: Play, text: FileText, quiz: HelpCircle, mixed: BookOpen }

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(d => {
      if (d.success) {
        const found = d.data.find((c: any) => c.slug === slug || c._id === slug)
        if (found) {
          setCourse(found)
          fetch(`/api/courses/${found._id}/lessons`).then(r2 => r2.json()).then(d2 => {
            if (d2.success) setLessons(d2.data || [])
          }).catch(() => {})
        }
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  if (!course) return (
    <div className="section-padding text-center">
      <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
      <Button asChild><Link href="/courses">Back to Courses</Link></Button>
    </div>
  )

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-4xl">
        <MetadataInjector title={course.title} description={course.description} url={`/courses/${slug}`} />
        <Breadcrumbs items={[{ label: 'Courses', href: '/courses' }, { label: course.title }]} />
        <CourseJsonLd name={course.title} description={course.description} provider="Hamed Hussein" url={typeof window !== 'undefined' ? window.location.href : `/courses/${slug}`} />
        {course.coverImage && <img src={course.coverImage} alt={`${course.title} course cover`} loading="lazy" className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">{course.category}</Badge>
          <Badge variant="outline">{course.level}</Badge>
          {course.type === 'premium' && <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Premium</Badge>}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
        <p className="text-lg text-text-secondary mb-6">{course.description}</p>
        <div className="flex flex-wrap gap-4 mb-8 text-sm text-text-muted">
          {course.duration > 0 && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}h</span>}
          {course.rating > 0 && <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {course.rating}</span>}
        </div>
        {course.longDescription && <p className="text-text-secondary leading-relaxed mb-8 whitespace-pre-wrap">{course.longDescription}</p>}
        {course.outcomes?.length > 0 && (
          <Card className="mb-8"><CardContent className="p-6">
            <h3 className="font-semibold mb-3">What you&apos;ll learn</h3>
            <ul className="space-y-2">{course.outcomes.map((o: string, i: number) => <li key={i} className="flex items-start gap-2 text-sm text-text-secondary"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /> {o}</li>)}</ul>
          </CardContent></Card>
        )}
        {course.prerequisites?.length > 0 && (
          <Card className="mb-8"><CardContent className="p-6">
            <h3 className="font-semibold mb-3">Prerequisites</h3>
            <ul className="space-y-2">{course.prerequisites.map((p: string, i: number) => <li key={i} className="text-sm text-text-secondary">• {p}</li>)}</ul>
          </CardContent></Card>
        )}
        {lessons.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-1">Course Content</h3>
              <p className="text-sm text-text-muted mb-4">{lessons.length} lessons</p>
              <div className="space-y-1">
                {lessons.map((l, i) => {
                  const TypeIcon = lessonTypeIcons[l.type] || BookOpen
                  return (
                    <Link key={l._id} href={`/courses/${slug}/lessons/${l._id}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors group">
                      <span className="text-xs text-text-muted w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <TypeIcon className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      <span className="text-sm flex-1 group-hover:text-brand-primary transition-colors">{l.title}</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 capitalize">{l.type}</Badge>
                      <ChevronRight className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {course.type === 'premium' ? (
          <Button asChild className="gradient-bg text-white"><Link href={`/contact?subject=I%20want%20to%20enroll%20in%20${encodeURIComponent(course.title)}&message=I%27m%20interested%20in%20the%20premium%20course%3A%20${encodeURIComponent(course.title)}.%20Please%20send%20me%20details%20about%20pricing%20and%20enrollment.`}>Contact for Enrollment</Link></Button>
        ) : (
          <Button asChild className="gradient-bg text-white"><Link href="/contact">Enroll Now</Link></Button>
        )}
      </div>
    </main>
  )
}
