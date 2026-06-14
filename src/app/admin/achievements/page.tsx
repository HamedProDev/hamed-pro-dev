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
        <h1 className="text-3xl font-bold">Achievements</h1>
        <Button asChild><Link href="/admin/achievements/new"><Plus className="h-4 w-4 mr-2" /> New Achievement</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-xl border border-dark-500 bg-dark-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500">
                <th className="px-4 py-3 text-left text-text-secondary">Title</th>
                <th className="px-4 py-3 text-left text-text-secondary">Type</th>
                <th className="px-4 py-3 text-left text-text-secondary">Year</th>
                <th className="px-4 py-3 text-left text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map(a => {
                const Icon = typeIcons[a.type] || Star
                return (
                  <tr key={a._id} className="border-b border-dark-500/50 hover:bg-dark-600/50">
                    <td className="px-4 py-3 font-medium">{a.title}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                        <Icon className="h-3 w-3" />{a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{a.year}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/achievements/${a._id}`} className="p-1.5 rounded-lg hover:bg-dark-500 text-text-muted hover:text-text-primary transition-colors">
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
