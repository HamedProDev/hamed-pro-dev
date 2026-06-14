'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Trophy, Award, Star, Milestone, BookOpen } from 'lucide-react'

interface Achievement {
  _id: string
  title: string
  description: string
  year: string
  type: string
  link?: string
  order: number
  featured: boolean
}

const typeIcons: Record<string, any> = {
  award: Trophy, certification: Award, milestone: Milestone, project: Star, publication: BookOpen,
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAchievements = () => {
    fetch('/api/achievements')
      .then(r => r.json())
      .then(d => {
        if (d.success) setAchievements(d.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchAchievements() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this achievement?')) return
    await fetch(`/api/achievements/${id}`, { method: 'DELETE' })
    fetchAchievements()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Achievements</h1>
        <Button asChild className="gradient-bg text-white"><Link href="/admin/achievements/new"><Plus className="h-4 w-4 mr-2" /> New Achievement</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-xl border border-border-primary bg-surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="px-4 py-3 text-left text-text-muted">Title</th>
                <th className="px-4 py-3 text-left text-text-muted">Type</th>
                <th className="px-4 py-3 text-left text-text-muted">Year</th>
                <th className="px-4 py-3 text-left text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map(a => {
                const Icon = typeIcons[a.type] || Star
                return (
                  <tr key={a._id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{a.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                        <Icon className="h-3 w-3" />{a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{a.year}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/achievements/${a._id}`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => handleDelete(a._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {achievements.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-text-muted">No achievements yet. Create your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
