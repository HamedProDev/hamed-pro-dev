'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'

interface Job {
  _id: string; title: string; company: string; location: string; type: string; status: string; views: number; applications: number
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch('/api/jobs').then(r => r.json()).then(d => {
      if (d.success) setJobs(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job?')) return
    await fetch(`/api/jobs/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _method: 'DELETE' }) })
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Jobs</h1>
        <Button asChild className="gradient-bg text-white"><Link href="/admin/jobs/new"><Plus className="h-4 w-4 mr-2" /> New Job</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-primary"><th className="px-4 py-3 text-left text-text-muted">Title</th><th className="px-4 py-3 text-left text-text-muted">Company</th><th className="px-4 py-3 text-left text-text-muted">Location</th><th className="px-4 py-3 text-left text-text-muted">Type</th><th className="px-4 py-3 text-left text-text-muted">Status</th><th className="px-4 py-3 text-left text-text-muted">Actions</th></tr></thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j._id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{j.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{j.company}</td>
                  <td className="px-4 py-3 text-text-muted text-xs">{j.location}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500">{j.type}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${j.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>{j.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/jobs/${j._id}/edit`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => handleDelete(j._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No jobs yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
