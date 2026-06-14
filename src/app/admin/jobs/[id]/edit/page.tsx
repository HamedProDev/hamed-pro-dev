'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', company: '', description: '', location: '', type: 'full-time',
    locationType: 'remote', category: 'fullstack', salary: '', requirements: '', benefits: '',
  })

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  useEffect(() => {
    fetch(`/api/jobs/${id}`).then(r => r.json()).then(d => {
      if (d.success && d.data) {
        const j = d.data
        setForm({
          title: j.title || '', company: j.company || '', description: j.description || '',
          location: j.location || '', type: j.type || 'full-time', locationType: j.locationType || 'remote',
          category: j.category || 'fullstack', salary: j.salary || '', requirements: (j.requirements || []).join(', '),
          benefits: (j.benefits || []).join(', '),
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
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements.split(',').map(t => t.trim()).filter(Boolean),
          benefits: form.benefits.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/admin/jobs')
      else setError(data.error || 'Failed to update')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  return (
    <div className="max-w-2xl">
      <Link href="/admin/jobs" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Jobs</Link>
      <h1 className="text-3xl font-bold mb-6">Edit Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Title *</label><Input required value={form.title} onChange={e => update('title', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Company *</label><Input required value={form.company} onChange={e => update('company', e.target.value)} /></div>
            <div><label className="text-sm font-medium mb-1 block">Description *</label><Textarea rows={5} required value={form.description} onChange={e => update('description', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Location</label><Input value={form.location} onChange={e => update('location', e.target.value)} placeholder="Kigali, Rwanda" /></div>
              <div><label className="text-sm font-medium mb-1 block">Salary</label><Input value={form.salary} onChange={e => update('salary', e.target.value)} placeholder="$500 - $1000" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Type</label><select value={form.type} onChange={e => update('type', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Location Type</label><select value={form.locationType} onChange={e => update('locationType', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="remote">Remote</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Category</label><select value={form.category} onChange={e => update('category', e.target.value)} className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm"><option value="frontend">Frontend</option><option value="backend">Backend</option><option value="fullstack">Fullstack</option><option value="mobile">Mobile</option><option value="ai-ml">AI/ML</option><option value="devops">DevOps</option></select></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Requirements (comma separated)</label><Input value={form.requirements} onChange={e => update('requirements', e.target.value)} placeholder="React, Node.js, 3+ years" /></div>
            <div><label className="text-sm font-medium mb-1 block">Benefits (comma separated)</label><Input value={form.benefits} onChange={e => update('benefits', e.target.value)} placeholder="Health insurance, Remote work" /></div>
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
