import { CourseCard } from './CourseCard'

interface Course { _id: string; title: string; slug: string; description: string; level: string; type: string; duration: number; enrolled: number; rating: number }

export function CourseGrid({ courses }: { courses: Course[] }) {
  if (!courses.length) return <p className="text-text-muted text-center py-12">No courses found.</p>
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(c => <CourseCard key={c._id} {...c} />)}
    </div>
  )
}
