'use client'
import Link from 'next/link'
import { Lock, CheckCircle, PlayCircle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface Lesson { _id: string; title: string; slug: string; type: string; isFree: boolean; order: number }

interface LessonSidebarProps {
  courseSlug: string
  lessons: Lesson[]
  currentLessonId?: string
  completedLessons?: string[]
}

const typeIcon: Record<string, any> = { video: PlayCircle, text: FileText, quiz: FileText, mixed: PlayCircle }

export function LessonSidebar({ courseSlug, lessons, currentLessonId, completedLessons = [] }: LessonSidebarProps) {
  return (
    <nav className="space-y-1">
      {lessons.map((lesson, i) => {
        const completed = completedLessons.includes(lesson._id)
        const current = lesson._id === currentLessonId
        const Icon = typeIcon[lesson.type] || FileText
        return (
          <Link
            key={lesson._id}
            href={lesson.isFree ? `/courses/${courseSlug}/lessons/${lesson.slug}` : '#'}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              current ? 'bg-brand-primary/10 text-brand-primary' : completed ? 'text-green-400' : 'text-text-secondary hover:bg-dark-600 hover:text-text-primary'
            )}
          >
            <span className="w-6 text-center text-xs text-text-muted">{i + 1}</span>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{lesson.title}</span>
            {completed ? <CheckCircle className="h-4 w-4 text-green-400" /> : !lesson.isFree && <Lock className="h-3 w-3 text-text-muted" />}
          </Link>
        )
      })}
    </nav>
  )
}
