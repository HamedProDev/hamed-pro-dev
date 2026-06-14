'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Users as UsersIcon } from 'lucide-react'

interface User {
  _id: string; name: string; email: string; role: string; createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    fetch('/api/users').then(r => r.json()).then(d => {
      if (d.success) setUsers(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Users</h1>
      </div>
      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border-primary"><th className="px-4 py-3 text-left text-text-muted">Name</th><th className="px-4 py-3 text-left text-text-muted">Email</th><th className="px-4 py-3 text-left text-text-muted">Role</th><th className="px-4 py-3 text-left text-text-muted">Joined</th><th className="px-4 py-3 text-left text-text-muted">Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{u.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'}`}>{u.role}</span></td>
                  <td className="px-4 py-3 text-text-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/users/${u._id}`} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary transition-colors"><Pencil className="h-4 w-4" /></Link>
                      {u.role !== 'admin' && <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-text-muted">No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
