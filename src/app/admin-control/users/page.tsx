'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Ban, CircleCheck, Trash2, UserPlus } from 'lucide-react'

interface User {
  id: string; name: string; email: string; role: string; disabled: boolean; xp_points: number; current_streak: number; created_at: string
}

const roleStyles: Record<string, string> = {
  admin: 'bg-blue-500/10 text-blue-500',
  editor: 'bg-violet-500/10 text-violet-500',
  visitor: 'bg-gray-500/10 text-gray-400',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [inviting, setInviting] = useState(false)
  const [invite, setInvite] = useState({ email: '', name: '', password: '' })
  const [inviteMsg, setInviteMsg] = useState('')

  const fetchData = useCallback(() => {
    fetch('/api/users').then(r => r.json()).then(d => {
      if (d.success) setUsers(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAction = async (id: string, action: string, role?: string) => {
    setBusyId(id)
    await fetch(`/api/users/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role ? { action, role } : { action }),
    })
    setBusyId(null)
    fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this user? This cannot be undone.')) return
    await handleAction(id, 'deleteUser')
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviting(true)
    setInviteMsg('')
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: invite.email, name: invite.name, password: invite.password }),
    })
    const d = await res.json()
    setInviteMsg(d.success ? 'User created successfully.' : (d.error || 'Failed to create user'))
    if (d.success) { setInvite({ email: '', name: '', password: '' }); fetchData() }
    setInviting(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Users</h1>
      </div>

      {/* Invite / create user */}
      <form onSubmit={handleInvite} className="admin-card p-4 mb-6 flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1">
          <label htmlFor="invite-name" className="text-sm font-medium mb-1 block">Name</label>
          <Input id="invite-name" name="name" value={invite.name} onChange={e => setInvite({ ...invite, name: e.target.value })} placeholder="Full name" />
        </div>
        <div className="flex-1">
          <label htmlFor="invite-email" className="text-sm font-medium mb-1 block">Email *</label>
          <Input id="invite-email" name="email" type="email" required value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} placeholder="user@example.com" />
        </div>
        <div className="flex-1">
          <label htmlFor="invite-password" className="text-sm font-medium mb-1 block">Password *</label>
          <Input id="invite-password" name="password" type="password" required minLength={6} value={invite.password} onChange={e => setInvite({ ...invite, password: e.target.value })} placeholder="Min 6 characters" />
        </div>
        <Button type="submit" disabled={inviting} className="gradient-bg text-white">
          {inviting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />} Create User
        </Button>
      </form>
      {inviteMsg && <p className="text-sm text-text-muted mb-4">{inviteMsg}</p>}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-primary">
                <th className="px-4 py-3 text-left text-text-muted">Name</th>
                <th className="px-4 py-3 text-left text-text-muted">Email</th>
                <th className="px-4 py-3 text-left text-text-muted">Role</th>
                <th className="px-4 py-3 text-left text-text-muted">XP</th>
                <th className="px-4 py-3 text-left text-text-muted">Status</th>
                <th className="px-4 py-3 text-left text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border-primary/50 hover:bg-surface-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">{u.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={busyId === u.id}
                      onChange={e => handleAction(u.id, 'updateRole', e.target.value)}
                      aria-label={`Role for ${u.name}`}
                      className="rounded-lg border border-border-primary bg-surface-card px-2 py-1 text-xs text-text-primary"
                    >
                      <option value="visitor">visitor</option>
                      <option value="editor">editor</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    <span className="text-xs">{u.xp_points} XP · {u.current_streak}🔥</span>
                  </td>
                  <td className="px-4 py-3">
                    {u.disabled
                      ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">Suspended</span>
                      : <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">Active</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {u.disabled ? (
                        <button onClick={() => handleAction(u.id, 'unsuspend')} disabled={busyId === u.id} className="p-1.5 rounded-lg hover:bg-green-500/10 text-text-muted hover:text-green-500" title="Unsuspend" aria-label="Unsuspend"><CircleCheck className="h-4 w-4" /></button>
                      ) : (
                        <button onClick={() => handleAction(u.id, 'suspend')} disabled={busyId === u.id} className="p-1.5 rounded-lg hover:bg-amber-500/10 text-text-muted hover:text-amber-500" title="Suspend" aria-label="Suspend"><Ban className="h-4 w-4" /></button>
                      )}
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDelete(u.id)} disabled={busyId === u.id} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400" title="Delete" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted">No users yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
