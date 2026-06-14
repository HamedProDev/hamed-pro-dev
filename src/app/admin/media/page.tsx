'use client'
import { useState, useEffect } from 'react'
import { Upload, Trash2, Image, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'

interface MediaItem {
  url: string
  folder: string
  createdAt: string
}

export default function AdminMediaPage() {
  const [uploaded, setUploaded] = useState<string[]>([])
  const [copied, setCopied] = useState('')

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-text-muted text-sm mt-1">Upload and manage images. All uploads go to Cloudinary.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Upload Image</CardTitle><CardDescription>Drag and drop or click to upload</CardDescription></CardHeader>
        <CardContent>
          <ImageUpload value="" onChange={url => { if (url) setUploaded(prev => [url, ...prev]) }} folder="hamedpro/media" />
        </CardContent>
      </Card>
      {uploaded.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Uploads</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploaded.map((url, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-border-primary">
                  <img src={url} alt="Uploaded" className="w-full h-32 object-cover" />
                  <button onClick={() => handleCopy(url)} className="absolute top-2 right-2 p-1.5 rounded bg-surface-card/80 hover:bg-surface-card transition-colors opacity-0 group-hover:opacity-100">
                    {copied === url ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
