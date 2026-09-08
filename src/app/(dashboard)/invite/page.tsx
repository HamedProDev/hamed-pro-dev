'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { Gift, Loader2, Check, Copy, Users, Twitter, MessageCircle, Send, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MetadataInjector } from '@/components/shared/MetadataInjector'

export default function InvitePage() {
  const { user, isLoading } = useAuth()
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState<{ count: number; referrals: { name: string; created_at: string }[] }>({ count: 0, referrals: [] })

  const inviteUrl = typeof window !== 'undefined' && user
    ? `${window.location.origin}/register?ref=${user.uid}`
    : ''

  useEffect(() => {
    if (!user) return
    fetch('/api/invites').then(r => r.json()).then(d => {
      if (d.success) setStats({ count: d.data.count || 0, referrals: d.data.referrals || [] })
    }).catch(() => {})
  }, [user])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const shareText = encodeURIComponent('Learn to code for free and earn certificates with Hamed Hussein! 🚀')

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Gift className="h-12 w-12 text-text-muted mb-4" />
        <h1 className="text-3xl font-bold mb-2">Invite Friends</h1>
        <p className="text-text-muted mb-6">Sign in to get your personal invite link.</p>
        <Button asChild className="gradient-bg text-white"><Link href="/login">Sign In</Link></Button>
      </div>
    )
  }

  return (
    <div>
      <MetadataInjector title="Invite" description="Invite friends to learn for free and earn certificates." url="/invite" />
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Invite your friends</h1>
          <p className="text-text-secondary">Share the learning journey. Every friend you invite joins free courses and earns verifiable certificates.</p>
        </div>

        <Card className="card-hover glow-border">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-400 flex items-center justify-center text-white shadow-sm">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Your invite link</h2>
                <p className="text-sm text-text-secondary">Anyone who signs up with this link joins the community.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-full glass mb-6">
              <span className="flex-1 truncate px-3 text-sm font-mono text-text-secondary">{inviteUrl || '...'}</span>
              <Button size="sm" className="gradient-bg shrink-0" onClick={copy}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button asChild variant="outline" className="w-full">
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(inviteUrl)}`} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-1.5" /> X
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(inviteUrl)}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <a href={`https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${shareText}`} target="_blank" rel="noopener noreferrer">
                  <Send className="h-4 w-4 mr-1.5" /> Telegram
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover mt-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Your referrals</h3>
                <p className="text-sm text-text-secondary">{stats.count} friend{stats.count === 1 ? '' : 's'} joined with your link</p>
              </div>
            </div>
            {stats.referrals.length === 0 ? (
              <p className="text-sm text-text-muted">No one has joined with your link yet — share it to grow the community.</p>
            ) : (
              <ul className="space-y-2">
                {stats.referrals.map((r, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{r.name}</span>
                    <span className="text-xs text-text-muted">{new Date(r.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: Users, title: 'Grow the community', desc: 'Help more students learn to build.' },
            { icon: Award, title: 'Free certificates', desc: 'Your friends earn verified certificates too.' },
            { icon: Gift, title: 'Zero cost', desc: 'Courses stay free for everyone.' },
          ].map(f => (
            <Card key={f.title} className="card-hover">
              <CardContent className="p-5">
                <f.icon className="h-6 w-6 text-brand-primary mb-3" />
                <h3 className="font-medium mb-1">{f.title}</h3>
                <p className="text-xs text-text-secondary">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
