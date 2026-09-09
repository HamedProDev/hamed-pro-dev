'use client'
import { useState, useEffect, useCallback } from 'react'
import NextImage from 'next/image'
import { Upload, Trash2, Loader2, Copy, Check, RefreshCw, FileText, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'

interface MediaItem {
  name: string
  path: string
  url: string
  folder: string
  size: number
  updatedAt: string
}

function formatBytes(bytes: number): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const fetchItems = useCallback(() => {
    setLoading(true)
    fetch('/api/media')
      .then(r => r.json())
      .then(d => { if (d.success) setItems(d.data || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(''), 2000)
  }

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete ${item.name}? This cannot be undone.`)) return
    setBusy(item.path)
    const res = await fetch('/api/media', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: [item.path] }),
    })
    const d = await res.json()
    setBusy(null)
    if (!d.success) alert(d.error || 'Could not delete file')
    else fetchItems()
  }

  const isImage = (name: string) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-text-muted text-sm mt-1">Browse and manage uploaded files (Supabase Storage).</p>
        </div>
        <button onClick={fetchItems} className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary" aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <Card>
        <CardHeader><CardTitle>Upload File</CardTitle><CardDescription>Drag and drop or click to upload an image</CardDescription></CardHeader>
        <CardContent>
          <ImageUpload value="" onChange={url => { if (url) fetchItems() }} folder="general" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Files ({items.length})</CardTitle><CardDescription>Click the copy icon to get the URL, or delete files you no longer need.</CardDescription></CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-10 w-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">No files yet. Upload one above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {items.map(item => (
                <div key={item.path} className="relative group rounded-xl overflow-hidden border border-border-primary bg-surface-secondary/40">
                  <div className="aspect-[4/3] flex items-center justify-center overflow-hidden">
                    {isImage(item.name) ? (
                      <NextImage src={item.url} alt={item.name} width={320} height={240} className="w-full h-full object-cover" unoptimized />
                    ) : (
                      <FileText className="h-8 w-8 text-text-muted" />
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] text-text-secondary truncate" title={item.name}>{item.name}</p>
                    <p className="text-[10px] text-text-muted truncate">{item.folder} · {formatBytes(item.size)}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleCopy(item.url)} className="p-1.5 rounded bg-surface-card/90 hover:bg-surface-card text-text-muted hover:text-text-primary" title="Copy URL" aria-label="Copy URL">
                      {copied === item.url ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </button>
                    <button onClick={() => handleDelete(item)} disabled={busy === item.path} className="p-1.5 rounded bg-surface-card/90 hover:bg-red-500/10 text-text-muted hover:text-red-400" title="Delete" aria-label="Delete">
                      {busy === item.path ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
