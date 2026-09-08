'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import { GamificationCard } from '@/components/dashboard/GamificationCard'
import { Save, Loader2, ArrowLeft, X, Plus, Github, Linkedin, Twitter, Globe, Heart } from 'lucide-react'

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [interestInput, setInterestInput] = useState('')
  const [form, setForm] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    website: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    interests: [] as string[],
  })

  useEffect(() => {
    if (!user) return
    setForm(f => ({
      ...f,
      name: user.name || '',
      avatar_url: user.image || '',
    }))
    fetch('/api/users/me').then(r => r.json()).then(d => {
      if (d.data) {
        const p = d.data
        setForm(f => ({
          name: p.name || f.name,
          bio: p.bio || '',
          avatar_url: p.avatar_url || p.image || '',
          website: p.website || '',
          github_url: p.github_url || '',
          linkedin_url: p.linkedin_url || '',
          twitter_url: p.twitter_url || '',
          interests: p.interests || [],
        }))
      }
    }).catch(() => {})
  }, [user])

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /></div>

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-3xl font-bold mb-4">My Profile</h1>
        <p className="text-text-muted mb-6">Please sign in to view your profile.</p>
        <Button asChild className="gradient-bg text-white"><Link href="/login">Sign In</Link></Button>
      </div>
    )
  }

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const addInterest = () => {
    const v = interestInput.trim()
    if (v && !form.interests.includes(v)) {
      setForm(f => ({ ...f, interests: [...f.interests, v] }))
    }
    setInterestInput('')
  }

  const removeInterest = (v: string) => setForm(f => ({ ...f, interests: f.interests.filter(i => i !== v) }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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

      <div className="space-y-6">
        <GamificationCard />

        <Card>
          <CardHeader><CardTitle>Profile Picture</CardTitle><CardDescription>Upload a profile photo.</CardDescription></CardHeader>
          <CardContent>
            <ImageUpload value={form.avatar_url} onChange={v => update('avatar_url', v)} folder="avatars" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Your name and bio.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Bio</label>
              <Textarea rows={4} value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Tell us about yourself..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social Links</CardTitle><CardDescription>Connect your profiles.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1.5"><Github className="h-3.5 w-3.5" /> GitHub</label>
              <Input value={form.github_url} onChange={e => update('github_url', e.target.value)} placeholder="https://github.com/username" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1.5"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</label>
              <Input value={form.linkedin_url} onChange={e => update('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1.5"><Twitter className="h-3.5 w-3.5" /> Twitter / X</label>
              <Input value={form.twitter_url} onChange={e => update('twitter_url', e.target.value)} placeholder="https://twitter.com/username" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Website</label>
              <Input value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://your-site.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Interests</CardTitle><CardDescription>What you want to learn or build.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={interestInput}
                onChange={e => setInterestInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest() } }}
                placeholder="e.g. AI, React, Mobile"
              />
              <Button type="button" variant="outline" onClick={addInterest} className="shrink-0"><Plus className="h-4 w-4" /></Button>
            </div>
            {form.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {form.interests.map(i => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-sm text-brand-primary">
                    <Heart className="h-3 w-3" /> {i}
                    <button onClick={() => removeInterest(i)} className="text-text-muted hover:text-red-400" aria-label={`Remove ${i}`}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted">No interests yet — add a few to personalize your dashboard.</p>
            )}
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="gradient-bg text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
