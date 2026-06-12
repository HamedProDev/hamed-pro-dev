export default function LessonPage({ params }: { params: { slug: string; lessonSlug: string } }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden lg:block w-72 border-r border-dark-500 bg-dark-800 p-4 pt-20">
        <h3 className="text-sm font-semibold text-text-muted mb-4">Course Lessons</h3>
        <p className="text-xs text-text-muted">Lesson list loaded from DB</p>
      </aside>
      <main className="flex-1 section-padding pt-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4 capitalize">{params.lessonSlug.replace(/-/g, ' ')}</h1>
          <p className="text-text-secondary">Lesson content will be loaded from MongoDB.</p>
        </div>
      </main>
    </div>
  )
}
