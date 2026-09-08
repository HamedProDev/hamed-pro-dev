'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectFormFields, emptyProjectForm, type ProjectFormState } from '@/components/admin/ProjectFormFields'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<ProjectFormState>(emptyProjectForm)

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  useEffect(() => {
    fetch(`/api/projects/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const p = d.data
        setForm({
          title: p.title || '',
          description: p.description || '',
          longDescription: p.content || '',
          coverImage: p.image_url || '',
          category: p.category || 'large',
          status: p.status || 'Completed',
          client: p.client || '',
          year: p.year || '',
          role: p.role || '',
          techStack: Array.isArray(p.tech_stack) ? p.tech_stack : (p.tech_stack || '').split(',').map((t: string) => t.trim()).filter(Boolean),
          tags: Array.isArray(p.tags) ? p.tags : [],
          demoUrl: p.demo_url || '',
          sourceUrl: p.github_url || '',
          screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
          featured: p.featured || false,
          isPublished: p.is_published !== false,
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/projects/${id}`, {
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
      else setError(data.error || 'Failed to update')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div className="max-w-2xl">
      <Link href="/admin-control/projects" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Projects</Link>
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
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
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
