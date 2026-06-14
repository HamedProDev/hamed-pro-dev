'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'

interface Skill {
  _id: string
  name: string
  category: string
  proficiency: number
  color: string
  order: number
  featured: boolean
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSkills = () => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(d => {
        if (d.success) setSkills(d.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchSkills() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    await fetch(`/api/skills/${id}`, { method: 'DELETE' })
    fetchSkills()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Skills</h1>
        <Button asChild><Link href="/admin/skills/new"><Plus className="h-4 w-4 mr-2" /> New Skill</Link></Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="rounded-xl border border-dark-500 bg-dark-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-500">
                <th className="px-4 py-3 text-left text-text-secondary">Order</th>
                <th className="px-4 py-3 text-left text-text-secondary">Name</th>
                <th className="px-4 py-3 text-left text-text-secondary">Category</th>
                <th className="px-4 py-3 text-left text-text-secondary">Proficiency</th>
                <th className="px-4 py-3 text-left text-text-secondary">Color</th>
                <th className="px-4 py-3 text-left text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(skill => (
                <tr key={skill._id} className="border-b border-dark-500/50 hover:bg-dark-600/50">
                  <td className="px-4 py-3 text-text-muted"><GripVertical className="h-4 w-4" /></td>
                  <td className="px-4 py-3 font-medium">{skill.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{skill.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-dark-500 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, backgroundColor: skill.color || '#3B82F6' }} />
                      </div>
                      <span className="text-text-muted text-xs">{skill.proficiency}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-5 rounded-full border border-border-primary" style={{ backgroundColor: skill.color }} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/skills/${skill._id}`} className="p-1.5 rounded-lg hover:bg-dark-500 text-text-muted hover:text-text-primary transition-colors">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(skill._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {skills.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No skills yet. Create your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
