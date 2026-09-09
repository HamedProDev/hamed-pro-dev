'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectFormFields, emptyProjectForm } from '@/components/admin/ProjectFormFields'

export default function NewProjectPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyProjectForm)

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          longDescription: form.longDescription,
          coverImage: form.coverImage,
          category: form.category,
          status: form.status,
          client: form.client,
          year: form.year,
          role: form.role,
          techStack: form.techStack,
          tags: form.tags,
          demoUrl: form.demoUrl,
          sourceUrl: form.sourceUrl,
          screenshots: form.screenshots.filter(Boolean),
          featured: form.featured,
          isPublished: form.isPublished,
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/admin-control/projects')
      else setError(data.error || 'Failed to create project')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin-control/projects" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Projects</Link>
      <h1 className="text-3xl font-bold mb-6">Create Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ProjectFormFields form={form} update={update} />
          </CardContent>
        </Card>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {saving ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </div>
  )
}
