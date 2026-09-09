'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon, Loader2, FolderGit2, GraduationCap, BookOpen, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { MetadataInjector } from '@/components/shared/MetadataInjector'

interface Results {
  projects: { slug: string; title: string; description: string }[]
  courses: { slug: string; title: string; description: string }[]
  lessons: { id: string; title: string; type: string; courseTitle: string; courseSlug: string }[]
}

const empty: Results = { projects: [], courses: [], lessons: [] }

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initial = searchParams.get('q') || ''
  const [query, setQuery] = useState(initial)
  const [results, setResults] = useState<Results>(empty)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) { setResults(empty); setSearched(false); return }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      const d = await res.json()
      if (d.success) setResults(d.data)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    if (initial) runSearch(initial)
  }, [initial, runSearch])

  const total = results.projects.length + results.courses.length + results.lessons.length

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide max-w-3xl">
        <MetadataInjector title="Search" description="Search projects, courses, and lessons by Hamed Hussein." />

        <h1 className="text-3xl font-bold mb-2">Search</h1>
        <p className="text-text-muted mb-6">Find projects, courses, and lessons.</p>

        <form
          onSubmit={e => { e.preventDefault(); runSearch(query); const u = new URL(window.location.href); u.searchParams.set('q', query); window.history.replaceState({}, '', u.toString()) }}
          className="flex gap-2 mb-8"
        >
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              className="pl-9"
              placeholder="Search e.g. React, machine learning, FarmConnect…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search"
            />
          </div>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
        ) : searched && total === 0 ? (
          <Card><CardContent className="p-10 text-center"><p className="text-text-muted">No results for &ldquo;{query}&rdquo;. Try a different keyword.</p></CardContent></Card>
        ) : (
          <div className="space-y-8">
            {results.courses.length > 0 && (
              <Section icon={GraduationCap} title="Courses">
                {results.courses.map(c => (
                  <ResultLink key={c.slug} href={`/courses/${c.slug}`} title={c.title} desc={c.description} />
                ))}
              </Section>
            )}
            {results.lessons.length > 0 && (
              <Section icon={BookOpen} title="Lessons">
                {results.lessons.map(l => (
                  <ResultLink key={l.id} href={`/courses/${l.courseSlug}/lessons/${l.id}`} title={l.title} desc={`Lesson in ${l.courseTitle}`} />
                ))}
              </Section>
            )}
            {results.projects.length > 0 && (
              <Section icon={FolderGit2} title="Projects">
                {results.projects.map(p => (
                  <ResultLink key={p.slug} href={`/projects/${p.slug}`} title={p.title} desc={p.description} />
                ))}
              </Section>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="flex items-center gap-2 text-lg font-semibold mb-3"><Icon className="h-4 w-4 text-brand-primary" /> {title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function ResultLink({ href, title, desc }: { href: string; title: string; desc?: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-border-primary bg-surface-secondary/40 hover:bg-surface-secondary p-4 group transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-text-primary group-hover:text-brand-primary">{title}</h3>
        <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-brand-primary shrink-0" />
      </div>
      {desc && <p className="text-sm text-text-muted line-clamp-2 mt-1">{desc}</p>}
    </Link>
  )
}
