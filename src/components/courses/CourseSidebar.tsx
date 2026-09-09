'use client'
import Link from 'next/link'
import { Check, Lock, PlayCircle, FileText, BookOpen, HelpCircle, ListOrdered, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface SidebarLesson {
  id: string
  title: string
  type?: string
}

interface CourseSidebarProps {
  courseSlug: string
  lessons: SidebarLesson[]
  completedLessonIds?: string[]
  currentLessonId?: string | null
  unlockedLessonId?: string | null
  enrolled?: boolean
  isCompleted?: boolean
}

const typeIcons: Record<string, any> = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
  mixed: BookOpen,
}

export function CourseSidebar({
  courseSlug,
  lessons,
  completedLessonIds = [],
  currentLessonId = null,
  unlockedLessonId = null,
  enrolled = false,
  isCompleted = false,
}: CourseSidebarProps) {
  const total = lessons.length
  const completed = lessons.filter((l) => completedLessonIds.includes(l.id)).length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const stateFor = (lesson: SidebarLesson): 'done' | 'current' | 'locked' | 'open' => {
    if (completedLessonIds.includes(lesson.id)) return 'done'
    if (currentLessonId === lesson.id) return 'current'
    if (enrolled && unlockedLessonId && unlockedLessonId !== lesson.id) return 'locked'
    return 'open'
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-primary" />
          Course Contents
        </CardTitle>
        {enrolled || completed > 0 ? (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>
                {completed} of {total} steps completed
              </span>
              <span className="font-semibold text-foreground">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full gradient-bg transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            {isCompleted && (
              <p className="mt-2 text-xs flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <Award className="h-3.5 w-3.5" /> All steps done — well done!
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground pt-1">
            {total} steps · work through them one by one
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">No lessons yet — check back soon.</p>
        ) : (
          <ol className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
            {lessons.map((lesson, i) => {
              const state = stateFor(lesson)
              const Icon = typeIcons[lesson.type || 'text'] || FileText
              const locked = state === 'locked'
              return (
                <li key={lesson.id}>
                  <Link
                    href={locked ? '#' : `/courses/${courseSlug}/lessons/${lesson.id}`}
                    onClick={locked ? (e) => e.preventDefault() : undefined}
                    aria-disabled={locked}
                    className={cn(
                      'flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                      state === 'current' && 'bg-primary/10 ring-1 ring-primary/30',
                      state === 'done' && 'text-muted-foreground',
                      locked && 'opacity-50 cursor-not-allowed',
                      !locked && state !== 'current' && 'hover:bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                        state === 'done' && 'bg-green-500 text-white',
                        state === 'current' && 'bg-primary text-white',
                        state === 'open' && 'bg-muted text-muted-foreground',
                        locked && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {state === 'done' ? (
                        <Check className="h-3 w-3" />
                      ) : locked ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block truncate font-medium',
                          state === 'done' && 'line-through decoration-muted-foreground/50'
                        )}
                      >
                        {lesson.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon className="h-3 w-3" />
                        Step {i + 1}
                        {state === 'current' && <span className="text-primary font-medium">· Up next</span>}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
