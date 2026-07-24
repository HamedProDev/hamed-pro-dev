'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Send, Loader2 } from 'lucide-react'

export default function AdminEmailPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Broadcast</h1>
        <p className="text-text-muted text-sm mt-1">Send email to your subscribers.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Compose Email</CardTitle><CardDescription>Send a broadcast to all subscribers</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1 block">Subject</label><Input placeholder="Email subject..." /></div>
          <div>
            <label className="text-sm font-medium mb-1 block">Recipients</label>
            <select className="w-full rounded-lg border border-border-primary bg-surface-card px-3 py-2.5 text-sm text-text-primary"><option>All Subscribers</option></select>
          </div>
          <div><label className="text-sm font-medium mb-1 block">Content</label><Textarea rows={8} placeholder="Write your email content..." /></div>
          <div className="flex gap-3">
            <Button onClick={() => { setSending(true); setTimeout(() => { setSending(false); setSent(true); setTimeout(() => setSent(false), 2000) }, 1500) }} disabled={sending} className="gradient-bg text-white">
              {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {sent ? 'Sent!' : sending ? 'Sending...' : 'Send Email'}
            </Button>
            <Button variant="secondary">Send Test</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
