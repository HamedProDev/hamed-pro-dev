'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ExternalLink, Eye } from 'lucide-react'

interface Project {
  _id: string; title: string; category: string; status: string; featured: boolean; views: number; likes: number; techStack: string[]
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch('/api/projects').then(r => r.json()).then(d => {
      if (d.success) setProjects(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Projects</h1>
        <Button asChild className="gradient-bg text-white"><Link href="/admin/projects/new"><Plus className="h-4 w-4 mr-2" /> New Project</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-primary"><th className="px-4 py-3 text-left text-text-muted">Title</th><th className="px-4 py-3 text-left text-text-muted">Category</th><th className="px-4 py-3 text-left text-text-muted">Status</th><th className="px-4 py-3 text-left text-text-muted">Views</th><th className="px-4 py-3 text-left text-text-muted">Actions</th></tr></thead>
            <tbody>
              {projects.map(p => (
                <tr key={p._id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{p.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{p.category}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'live' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>{p.status}</span></td>
                  <td className="px-4 py-3 text-text-muted flex items-center gap-1"><Eye className="h-3 w-3" /> {p.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/projects/${p._id}`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">No projects yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
