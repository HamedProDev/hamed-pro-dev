'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Save } from 'lucide-react'

export default function AdminSEOPage() {
  const [saved, setSaved] = useState(false)

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Settings</h1>
          <p className="text-text-muted text-sm mt-1">Configure search engine optimization defaults.</p>
        </div>
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} className="gradient-bg text-white">
          <Save className="h-4 w-4 mr-2" />{saved ? 'Saved!' : 'Save SEO Settings'}
        </Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Default Meta Tags</CardTitle><CardDescription>Applied across all pages unless overridden</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1 block">Default Meta Title Template</label><Input defaultValue="%s | HamedProDev" /></div>
          <div><label className="text-sm font-medium mb-1 block">Default Meta Description</label><Textarea rows={3} placeholder="Default description for search engines..." /></div>
          <div><label className="text-sm font-medium mb-1 block">Default OG Image URL</label><Input placeholder="https://..." /></div>
        </CardContent>
      </Card>
    </div>
  )
}
