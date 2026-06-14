'use client'
import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  className?: string
}

export function ImageUpload({ value, onChange, folder = 'hamedpro', className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [mode, setMode] = useState<'upload' | 'url'>(value?.startsWith('http') ? 'upload' : 'upload')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const timestamp = Math.round(Date.now() / 1000)
      const sigRes = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, timestamp }),
      })
      const sigData = await sigRes.json()
      if (!sigData.success) {
        setError('Upload config error: ' + (sigData.error || 'unknown'))
        setUploading(false)
        return
      }
      const { signature, api_key, cloud_name } = sigData.data

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      formData.append('timestamp', String(timestamp))
      formData.append('api_key', api_key)
      formData.append('signature', signature)
      formData.append('cloud_name', cloud_name)

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const uploaded = await uploadRes.json()
      if (uploaded.secure_url) {
        onChange(uploaded.secure_url)
      } else {
        setError(uploaded.error?.message || 'Upload failed. Try URL mode instead.')
      }
    } catch (err) {
      setError('Upload failed. Try URL mode instead.')
      console.error('Upload failed:', err)
    }
    setUploading(false)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only images allowed'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB'); return }
    setError('')
    upload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode('upload')} className={`text-xs px-3 py-1 rounded-lg transition-colors ${mode === 'upload' ? 'bg-blue-500/10 text-blue-500' : 'text-text-muted hover:text-text-primary'}`}>
          <Upload className="h-3 w-3 inline mr-1" /> Upload
        </button>
        <button type="button" onClick={() => setMode('url')} className={`text-xs px-3 py-1 rounded-lg transition-colors ${mode === 'url' ? 'bg-blue-500/10 text-blue-500' : 'text-text-muted hover:text-text-primary'}`}>
          <LinkIcon className="h-3 w-3 inline mr-1" /> URL
        </button>
      </div>

      {/* Current image preview */}
      {value && (
        <div className="relative group rounded-xl overflow-hidden border border-border-primary">
          <img src={value} alt="Uploaded" className="w-full h-48 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {mode === 'upload' && <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>Replace</Button>}
            <Button size="sm" variant="destructive" onClick={() => onChange('')}><X className="h-4 w-4" /></Button>
          </div>
          {error && <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs p-2 text-center">{error}</div>}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
        </div>
      )}

      {/* Upload mode */}
      {!value && mode === 'upload' && (
        <div
          className={cn('relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all', dragOver ? 'border-blue-500 bg-blue-500/5' : 'border-border-primary hover:border-blue-500/30')}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /><p className="text-sm text-text-muted">Uploading...</p></div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-xl bg-surface-tertiary flex items-center justify-center"><Upload className="h-5 w-5 text-text-muted" /></div>
              <p className="text-sm text-text-secondary">Click or drag to upload image</p>
              <p className="text-xs text-text-muted">PNG, JPG up to 5MB</p>
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
        </div>
      )}

      {/* URL mode */}
      {!value && mode === 'url' && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
          />
          <Button type="button" onClick={handleUrlSubmit} variant="outline" disabled={!urlInput.trim()}>Set</Button>
        </div>
      )}
    </div>
  )
}
