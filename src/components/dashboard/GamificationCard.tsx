'use client'
import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Zap, Flame, Trophy, Loader2, TrendingUp, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface BadgeItem {
  id: string
  label: string
  description: string
  icon: string
  earned: boolean
}

interface GamificationData {
  xp_points: number
  level: number
  level_progress: number
  level_need: number
  current_streak: number
  longest_streak: number
  weekly: { day: string; xp: number }[]
  badges: BadgeItem[]
}

export function GamificationCard() {
  const [data, setData] = useState<GamificationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/users/me/xp')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
        </CardContent>
      </Card>
    )
  }

  const d = data || { xp_points: 0, level: 1, level_progress: 0, level_need: 100, current_streak: 0, longest_streak: 0, weekly: [], badges: [] }
  const levelPct = Math.min(100, Math.round((d.level_progress / Math.max(1, d.level_need)) * 100))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4 text-amber-500" /> Learning Rewards</CardTitle>
        <CardDescription>Level up and unlock badges as you keep learning.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-amber-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-amber-500">{d.xp_points}</p>
            <p className="text-xs text-text-muted">Total XP</p>
          </div>
          <div className="rounded-xl bg-orange-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-orange-500">{d.current_streak}🔥</p>
            <p className="text-xs text-text-muted">Day streak</p>
          </div>
          <div className="rounded-xl bg-green-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-green-500">{d.longest_streak}🏆</p>
            <p className="text-xs text-text-muted">Best streak</p>
          </div>
        </div>

        {/* Level progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold text-text-primary flex items-center gap-1.5"><Trophy className="h-4 w-4 text-brand-primary" /> Level {d.level}</span>
            <span className="text-xs text-text-muted">{d.level_progress}/{d.level_need} XP to level {d.level + 1}</span>
          </div>
          <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500" style={{ width: `${levelPct}%` }} />
          </div>
        </div>

        {/* Badges */}
        <div className="grid grid-cols-3 gap-2">
          {d.badges.map(b => (
            <div
              key={b.id}
              title={b.description}
              className={`rounded-xl border p-2.5 text-center transition-colors ${b.earned ? 'border-brand-primary/30 bg-brand-primary/10' : 'border-border-primary bg-surface-secondary/40 opacity-60'}`}
            >
              <div className="text-xl">{b.earned ? b.icon : <Lock className="h-5 w-5 text-text-muted inline" />}</div>
              <p className="text-[11px] font-medium text-text-primary mt-1">{b.label}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.weekly} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid var(--border-primary)', background: 'var(--surface-card)', color: 'var(--text-primary)', fontSize: 12 }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#7c3aed" strokeWidth={2} fill="url(#xpGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-text-muted mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> XP earned in the last 7 days</p>
        </div>
      </CardContent>
    </Card>
  )
}
