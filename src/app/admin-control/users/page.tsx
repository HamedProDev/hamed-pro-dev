'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Ban, CircleCheck, Trash2, UserPlus, Eye, X, Award, Clock, Zap, BookOpen } from 'lucide-react'
import { saveJson } from '@/lib/utils/admin-save'

interface User {
  id: string; name: string; email: string; role: string; disabled: boolean; xp_points: number; current_streak: number; created_at: string
}

interface UserDetail {
  id: string; name: string; email: string; role: string; bio?: string; xp_points?: number
  enrollments: { id: string; course_id: string; status: string; progress: number; enrolled_at: string; completed_at?: string; courses?: { title?: string } | null }[]
  certificates: { id: string; certificate_number: string; course_title: string; score?: number; issue_date?: string; is_verified: boolean }[]
  total_xp: number
  time_spent_seconds: number
  completed_lessons: number
  total_lessons_tracked: number
}

const roleStyles: Record<string, string> = {
  admin: 'bg-violet-500/10 text-violet-500',
  editor: 'bg-violet-500/10 text-violet-500',
  visitor: 'bg-gray-500/10 text-gray-400',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inviting, setInviting] = useState(false)
  const [invite, setInvite] = useState({ email: '', name: '', password: '' })
  const [inviteMsg, setInviteMsg] = useState('')
  const [detail, setDetail] = useState<UserDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchData = useCallback(() => {
    fetch('/api/users').then(r => r.json()).then(d => {
      if (d.success) setUsers(d.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAction = async (id: string, action: string, role?: string) => {
    setBusyId(id)
    setError(null)
    const result = await saveJson(`/api/users/${id}`, role ? { action, role } : { action })
    if (!result.ok) setError(result.error || `Failed to ${action.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
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

  const openDetail = async (id: string) => {
    setDetailLoading(true)
    setDetail(null)
    const res = await fetch(`/api/users/${id}`)
    const d = await res.json()
    if (d.success) setDetail(d.data)
    setDetailLoading(false)
  }

  const formatTime = (s: number) => {
    if (!s) return '0m'
    const h = Math.floor(s / 3600)
    const m = Math.round((s % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Users</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 mb-4" role="alert">
          ❌ {error}
        </div>
      )}

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
                      <button onClick={() => openDetail(u.id)} disabled={detailLoading} className="p-1.5 rounded-lg hover:bg-brand-primary/10 text-text-muted hover:text-brand-primary" title="View details" aria-label="View details"><Eye className="h-4 w-4" /></button>
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

      {/* User detail drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDetail(null)} aria-hidden="true" />
          <aside className="relative h-full w-full max-w-md bg-surface-card border-l border-border-primary shadow-2xl overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-primary">{detail.name || 'Unknown user'}</h2>
                <p className="text-sm text-text-muted">{detail.email}</p>
                <p className="text-xs text-text-muted mt-1 capitalize">{detail.role}</p>
              </div>
              <button onClick={() => setDetail(null)} className="p-1.5 rounded-lg hover:bg-surface-tertiary text-text-muted" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl bg-surface-secondary/60 p-3 text-center">
                <Zap className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-text-primary">{detail.total_xp}</p>
                <p className="text-[11px] text-text-muted">XP</p>
              </div>
              <div className="rounded-xl bg-surface-secondary/60 p-3 text-center">
                <Clock className="h-4 w-4 text-brand-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-text-primary">{formatTime(detail.time_spent_seconds)}</p>
                <p className="text-[11px] text-text-muted">Time</p>
              </div>
              <div className="rounded-xl bg-surface-secondary/60 p-3 text-center">
                <BookOpen className="h-4 w-4 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-text-primary">{detail.completed_lessons}</p>
                <p className="text-[11px] text-text-muted">Lessons</p>
              </div>
            </div>

            {detail.bio && <p className="text-sm text-text-secondary mb-6">{detail.bio}</p>}

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Enrollments ({detail.enrollments.length})</h3>
              {detail.enrollments.length === 0 ? (
                <p className="text-sm text-text-muted">No enrollments yet.</p>
              ) : (
                <div className="space-y-2">
                  {detail.enrollments.map(e => (
                    <div key={e.id} className="rounded-xl bg-surface-secondary/60 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-text-primary truncate">{e.courses?.title || 'Course'}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${e.status === 'completed' ? 'bg-green-500/10 text-green-500' : e.status === 'dropped' ? 'bg-red-500/10 text-red-500' : 'bg-brand-primary/10 text-brand-primary'}`}>{e.status}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
                        <div className="h-full bg-brand-primary" style={{ width: `${Math.min(100, e.progress || 0)}%` }} />
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">{e.progress || 0}% complete</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1.5"><Award className="h-4 w-4 text-brand-primary" /> Certificates ({detail.certificates.length})</h3>
              {detail.certificates.length === 0 ? (
                <p className="text-sm text-text-muted">No certificates yet.</p>
              ) : (
                <div className="space-y-2">
                  {detail.certificates.map(c => (
                    <div key={c.id} className="rounded-xl bg-surface-secondary/60 p-3">
                      <p className="text-sm font-medium text-text-primary">{c.course_title}</p>
                      <p className="text-[11px] text-text-muted">#{c.certificate_number}{c.score != null ? ` · Score ${c.score}` : ''}{c.issue_date ? ` · ${c.issue_date}` : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
