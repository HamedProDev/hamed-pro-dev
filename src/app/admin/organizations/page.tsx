'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react'

interface Organization {
  _id: string
  name: string
  type: string
  description: string
  location: string
  team: string
  roles: number
  hiring: boolean
}

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch('/api/organizations').then(r => r.json()).then(d => {
      if (d.success) setOrgs(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this organization?')) return
    await fetch(`/api/organizations/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Organizations</h1>
        <Button asChild className="gradient-bg text-white"><Link href="/admin/organizations/new"><Plus className="h-4 w-4 mr-2" /> New Organization</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-xl border border-border-primary bg-surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="px-4 py-3 text-left text-text-muted">Name</th>
                <th className="px-4 py-3 text-left text-text-muted">Type</th>
                <th className="px-4 py-3 text-left text-text-muted">Location</th>
                <th className="px-4 py-3 text-left text-text-muted">Team</th>
                <th className="px-4 py-3 text-left text-text-muted">Hiring</th>
                <th className="px-4 py-3 text-left text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map(o => (
                <tr key={o._id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{o.name}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">{o.type}</span></td>
                  <td className="px-4 py-3 text-text-secondary">{o.location}</td>
                  <td className="px-4 py-3 text-text-muted">{o.team}</td>
                  <td className="px-4 py-3">{o.hiring ? <span className="text-green-500 text-xs">Yes ({o.roles})</span> : <span className="text-text-muted text-xs">No</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/organizations/${o._id}`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => handleDelete(o._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {orgs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No organizations yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
