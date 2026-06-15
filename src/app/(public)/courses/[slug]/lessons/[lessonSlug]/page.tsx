import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

export default function LessonPage({ params }: { params: { slug: string; lessonSlug: string } }) {
  const lessonTitle = params.lessonSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return (
    <main id="main-content" className="flex min-h-screen">
      <MetadataInjector title={lessonTitle} description={`Course lesson: ${lessonTitle}`} url={`/courses/${params.slug}/lessons/${params.lessonSlug}`} />
      <Breadcrumbs items={[{ label: 'Courses', href: '/courses' }, { label: params.slug.replace(/-/g, ' '), href: `/courses/${params.slug}` }, { label: lessonTitle }]} />
      <aside className="hidden lg:block w-72 border-r border-dark-500 bg-dark-800 p-4 pt-20">
        <h2 className="text-sm font-semibold text-text-muted mb-4">Course Lessons</h2>
        <p className="text-xs text-text-muted">Lesson list loaded from DB</p>
      </aside>
      <article className="flex-1 section-padding pt-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4 capitalize">{lessonTitle}</h1>
          <p className="text-text-secondary">Lesson content will be loaded from MongoDB.</p>
        </div>
      </article>
    </main>
  )
}
