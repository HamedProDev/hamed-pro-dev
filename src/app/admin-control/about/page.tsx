'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import { Save } from 'lucide-react'

export default function AdminAboutPage() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    fullName: 'Hamed Hussein',
    tagline: 'Fullstack & AI/ML Engineer',
    bio: '',
    avatar: '',
  })

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit About Page</h1>
          <p className="text-text-muted text-sm mt-1">Manage your about page content.</p>
        </div>
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} className="gradient-bg text-white">
          <Save className="h-4 w-4 mr-2" />{saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Personal Info</CardTitle><CardDescription>Your name and tagline</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1 block">Full Name</label><Input value={form.fullName} onChange={e => update('fullName', e.target.value)} /></div>
          <div><label className="text-sm font-medium mb-1 block">Tagline</label><Input value={form.tagline} onChange={e => update('tagline', e.target.value)} /></div>
          <div><label className="text-sm font-medium mb-1 block">Bio (Markdown)</label><Textarea rows={8} value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Write your story in Markdown..." /></div>
          <div><label className="text-sm font-medium mb-1 block">Avatar</label><ImageUpload value={form.avatar} onChange={v => update('avatar', v)} folder="hamedpro/about" /></div>
        </CardContent>
      </Card>
    </div>
  )
}
