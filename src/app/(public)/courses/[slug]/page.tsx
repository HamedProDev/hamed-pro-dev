'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Clock, Users, Star, BookOpen, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(d => {
      if (d.success) {
        const found = d.data.find((c: any) => c.slug === slug || c._id === slug)
        if (found) setCourse(found)
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
    <div className="section-padding pt-24">
      <div className="container-wide max-w-4xl">
        <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-6"><ArrowLeft className="h-4 w-4" /> Back to Courses</Link>
        {course.coverImage && <img src={course.coverImage} alt={course.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />}
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
        <Button asChild className="gradient-bg text-white"><Link href="/contact">Enroll Now</Link></Button>
      </div>
    </div>
  )
}
