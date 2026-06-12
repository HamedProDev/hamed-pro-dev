import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Users, Calendar } from 'lucide-react'
export const metadata: Metadata = generateSEOMetadata({ title: 'Community', description: 'Join the developer community — meetups, forums, and collaboration.', url: '/community' })

export default function CommunityPage() {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="text-4xl font-bold mb-4">Community</h1>
        <p className="text-text-secondary mb-8">Join fellow developers in Rwanda and beyond.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-hover"><CardContent className="p-6 text-center"><MessageCircle className="h-10 w-10 text-brand-primary mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">Discord</h3><p className="text-sm text-text-secondary mb-4">Join our Discord server</p><Button variant="outline" size="sm" asChild><a href="#" target="_blank">Join Server</a></Button></CardContent></Card>
          <Card className="card-hover"><CardContent className="p-6 text-center"><Users className="h-10 w-10 text-brand-primary mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">WhatsApp Group</h3><p className="text-sm text-text-secondary mb-4">Rwanda dev community</p><Button variant="outline" size="sm" asChild><a href="#" target="_blank">Join Group</a></Button></CardContent></Card>
          <Card className="card-hover"><CardContent className="p-6 text-center"><Calendar className="h-10 w-10 text-brand-primary mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">Meetups</h3><p className="text-sm text-text-secondary mb-4">Monthly developer meetups in Kigali</p><Button variant="outline" size="sm">View Events</Button></CardContent></Card>
        </div>
      </div>
    </div>
  )
}
