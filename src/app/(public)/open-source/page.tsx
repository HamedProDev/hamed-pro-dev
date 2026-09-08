'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, GitFork, Github, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

interface Repo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
}

export default function OpenSourcePage() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('https://api.github.com/users/hamedProDev/repos?sort=stars&per_page=8')
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((data: Repo[]) => { setRepos(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide">
        <MetadataInjector title="Open Source" description="Open source projects and contributions by Hamed Hussein." url="/open-source" />
        <Breadcrumbs items={[{ label: 'Open Source' }]} />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Open Source</h1>
            <p className="text-text-secondary">Projects I build and maintain in the open — contributions welcome.</p>
          </div>
          <Button asChild className="gradient-bg text-white">
            <a href="https://github.com/HamedProDev" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" /> GitHub Profile
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
        ) : error || repos.length === 0 ? (
          <Card className="card-hover">
            <CardContent className="p-12 text-center">
              <Github className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Repositories unavailable</h3>
              <p className="text-sm text-text-secondary mb-4">Couldn't load GitHub repositories right now.</p>
              <Button variant="outline" asChild>
                <a href="https://github.com/HamedProDev?tab=repositories" target="_blank" rel="noopener noreferrer">
                  View on GitHub <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {repos.map(repo => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <Card className="card-hover h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">{repo.name} <ExternalLink className="h-3.5 w-3.5 text-text-muted" /></h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2 flex-1">{repo.description || 'No description provided.'}</p>
                    <div className="flex gap-4 text-xs text-text-muted">
                      {repo.language && <span>{repo.language}</span>}
                      <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {repo.stargazers_count}</span>
                      <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" /> {repo.forks_count}</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl glass-card p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Want to contribute?</h3>
          <p className="text-text-secondary mb-4">Open an issue or submit a pull request on any repository.</p>
          <Button asChild variant="outline"><Link href="/contact">Get in Touch</Link></Button>
        </div>
      </div>
    </main>
  )
}
