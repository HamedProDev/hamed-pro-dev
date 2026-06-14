'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save, Loader2, ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', bio: '' })

  useEffect(() => {
    if (session?.user) {
      setForm({
        name: (session.user as any).name || '',
        email: (session.user as any).email || '',
        bio: '',
      })
      fetch('/api/users/me').then(r => r.json()).then(d => {
        if (d.data) {
          setForm(f => ({ ...f, bio: d.data.bio || '' }))
        }
      }).catch(() => {})
    }
  }, [session])

  if (status === 'loading') return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <p className="text-text-muted mb-6">Please sign in to view your profile.</p>
        <Button asChild className="gradient-bg text-white"><Link href="/login">Sign In</Link></Button>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, bio: form.bio }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {}
    setSaving(false)
  }

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-4"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your profile details</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1 block">Name</label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="text-sm font-medium mb-1 block">Email</label><Input value={form.email} disabled /></div>
          <div><label className="text-sm font-medium mb-1 block">Bio</label><Textarea rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us about yourself..." /></div>
          <Button onClick={handleSave} disabled={saving} className="gradient-bg text-white">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
