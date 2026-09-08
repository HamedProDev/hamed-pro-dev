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

  const inviteUrl = typeof window !== 'undefined' && user
    ? `${window.location.origin}/register?ref=${user.uid}`
    : ''

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
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
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
