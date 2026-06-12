import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
export const metadata: Metadata = { title: 'My Courses' }

export default function MyCoursesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="rounded-xl border border-dark-500 bg-dark-700 p-12 text-center">
        <BookOpen className="h-12 w-12 text-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
        <p className="text-sm text-text-secondary">Browse our courses and start learning.</p>
      </div>
    </div>
  )
}
