'use client'
import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Zap, Flame, TrendingUp, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface GamificationData {
  xp_points: number
  current_streak: number
  longest_streak: number
  weekly: { day: string; xp: number }[]
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

  const d = data || { xp_points: 0, current_streak: 0, longest_streak: 0, weekly: [] }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4 text-amber-500" /> Learning Activity</CardTitle>
        <CardDescription>Your XP and daily streak.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
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
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={d.weekly} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f6ef7" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4f6ef7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid var(--border-primary)', background: 'var(--surface-card)', color: 'var(--text-primary)', fontSize: 12 }}
                labelStyle={{ color: 'var(--text-muted)' }}
              />
              <Area type="monotone" dataKey="xp" stroke="#4f6ef7" strokeWidth={2} fill="url(#xpGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-text-muted mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> XP earned in the last 7 days</p>
      </CardContent>
    </Card>
  )
}
