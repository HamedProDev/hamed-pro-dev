'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'

export default function NewJobPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', company: '', location: '', locationType: 'remote', type: 'full-time', category: 'frontend',
    description: '', skills: '', salaryMin: '', salaryMax: '', applicationUrl: '', companyLogo: '',
  })

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const deadline = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
          salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
          deadline,
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/admin/jobs')
      else setError(data.error || 'Failed to create job')
    } catch { setError('Something went wrong') }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/jobs" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Jobs</Link>
      <h1 className="text-3xl font-bold mb-6">Post Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Job Title *</label><Input required value={form.title} onChange={e => update('title', e.target.value)} placeholder="Frontend Developer" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Company *</label><Input required value={form.company} onChange={e => update('company', e.target.value)} placeholder="Company Name" /></div>
              <div><label className="text-sm font-medium mb-1 block">Location *</label><Input required value={form.location} onChange={e => update('location', e.target.value)} placeholder="Kigali, Rwanda" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Type</label><select value={form.type} onChange={e => update('type', e.target.value)} className="w-full rounded-lg border border-white/10 bg-dark-700 px-3 py-2.5 text-sm"><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="internship">Internship</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Location Type</label><select value={form.locationType} onChange={e => update('locationType', e.target.value)} className="w-full rounded-lg border border-white/10 bg-dark-700 px-3 py-2.5 text-sm"><option value="remote">Remote</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option></select></div>
              <div><label className="text-sm font-medium mb-1 block">Category</label><select value={form.category} onChange={e => update('category', e.target.value)} className="w-full rounded-lg border border-white/10 bg-dark-700 px-3 py-2.5 text-sm"><option value="frontend">Frontend</option><option value="backend">Backend</option><option value="fullstack">Fullstack</option><option value="mobile">Mobile</option><option value="ai-ml">AI/ML</option><option value="devops">DevOps</option></select></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Description *</label><Textarea rows={4} required value={form.description} onChange={e => update('description', e.target.value)} placeholder="Job description..." /></div>
            <div><label className="text-sm font-medium mb-1 block">Skills (comma separated)</label><Input value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="React, TypeScript, Next.js" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-1 block">Salary Min ($)</label><Input type="number" min="0" value={form.salaryMin} onChange={e => update('salaryMin', e.target.value)} placeholder="800" /></div>
              <div><label className="text-sm font-medium mb-1 block">Salary Max ($)</label><Input type="number" min="0" value={form.salaryMax} onChange={e => update('salaryMax', e.target.value)} placeholder="1500" /></div>
            </div>
            <div><label className="text-sm font-medium mb-1 block">Application URL</label><Input value={form.applicationUrl} onChange={e => update('applicationUrl', e.target.value)} placeholder="https://..." /></div>
            <div><label className="text-sm font-medium mb-1 block">Company Logo</label><ImageUpload value={form.companyLogo} onChange={v => update('companyLogo', v)} folder="hamedpro/companies" /></div>
          </CardContent>
        </Card>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          {saving ? 'Posting...' : 'Post Job'}
        </Button>
      </form>
    </div>
  )
}
