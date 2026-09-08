'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle, Users, Calendar, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MetadataInjector } from '@/components/shared/MetadataInjector'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'

export default function CommunityPage() {
  const [socials, setSocials] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.success && d.data?.social_links) setSocials(d.data.social_links)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const channels = [
    { key: 'discord', icon: MessageCircle, title: 'Discord', desc: 'Join the developer community server', fallback: null },
    { key: 'whatsapp', icon: Users, title: 'WhatsApp Group', desc: 'Rwanda developer community chat', fallback: null },
    { key: 'telegram', icon: Send, title: 'Telegram', desc: 'Announcements and quick updates', fallback: null },
    { key: 'youtube', icon: Calendar, title: 'YouTube', desc: 'Free tutorials and course previews', fallback: null },
  ]

  return (
    <main id="main-content" className="section-padding pt-24">
      <div className="container-wide">
        <MetadataInjector title="Community" description="Join the Hamed Hussein developer community — meetups, forums, and collaboration." url="/community" />
        <Breadcrumbs items={[{ label: 'Community' }]} />
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-4">Join the <span className="gradient-text">Community</span></h1>
          <p className="text-text-secondary">Learn together, share projects, and connect with developers in Rwanda and beyond.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {channels.map(ch => {
              const url = socials[ch.key]?.trim()
              return (
                <Card key={ch.key} className="card-hover">
                  <CardContent className="p-6 flex flex-col items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <ch.icon className="h-6 w-6 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{ch.title}</h3>
                      <p className="text-sm text-text-secondary">{ch.desc}</p>
                    </div>
                    {url ? (
                      <Button asChild className="gradient-bg text-white">
                        <a href={url} target="_blank" rel="noopener noreferrer">Join {ch.title}</a>
                      </Button>
                    ) : (
                      <Button variant="outline" asChild>
                        <Link href="/contact">Coming Soon</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-12 rounded-2xl glass-card p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Prefer email?</h3>
          <p className="text-text-secondary mb-4">Get weekly insights straight to your inbox.</p>
          <Button asChild className="gradient-bg text-white"><Link href="/newsletter">Subscribe to the Newsletter</Link></Button>
        </div>
      </div>
    </main>
  )
}
