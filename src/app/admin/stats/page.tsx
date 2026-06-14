'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'

interface Stat {
  _id: string
  label: string
  value: number
  suffix: string
  icon: string
  order: number
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStats = () => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchStats() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this stat?')) return
    await fetch(`/api/stats/${id}`, { method: 'DELETE' })
    fetchStats()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Stats</h1>
        <Button asChild className="gradient-bg text-white"><Link href="/admin/stats/new"><Plus className="h-4 w-4 mr-2" /> New Stat</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-xl border border-border-primary bg-surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="px-4 py-3 text-left text-text-muted">Order</th>
                <th className="px-4 py-3 text-left text-text-muted">Label</th>
                <th className="px-4 py-3 text-left text-text-muted">Value</th>
                <th className="px-4 py-3 text-left text-text-muted">Suffix</th>
                <th className="px-4 py-3 text-left text-text-muted">Icon</th>
                <th className="px-4 py-3 text-left text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.map(s => (
                <tr key={s._id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 text-text-muted"><GripVertical className="h-4 w-4" /></td>
                  <td className="px-4 py-3 font-medium text-text-primary">{s.label}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.value}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.suffix || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{s.icon}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/stats/${s._id}`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {stats.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No stats yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
