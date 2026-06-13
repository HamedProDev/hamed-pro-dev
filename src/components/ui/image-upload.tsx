'use client'
import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const timestamp = Math.round(Date.now() / 1000)
      const paramsToSign = { timestamp, folder }
      const sigRes = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paramsToSign),
      })
      const sigData = await sigRes.json()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      formData.append('timestamp', String(timestamp))
      formData.append('api_key', sigData.data.api_key)
      formData.append('signature', sigData.data.signature)
      formData.append('cloud_name', sigData.data.cloud_name)

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.data.cloud_name}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const uploaded = await uploadRes.json()
      if (uploaded.secure_url) {
        onChange(uploaded.secure_url)
      }
    } catch (err) {
      console.error('Upload failed:', err)
    }
    setUploading(false)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return
    upload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  if (value) {
    return (
      <div className={cn('relative group rounded-xl overflow-hidden border border-white/10', className)}>
        <img src={value} alt="Uploaded" className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>Replace</Button>
          <Button size="sm" variant="destructive" onClick={() => onChange('')}><X className="h-4 w-4" /></Button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
      </div>
    )
  }

  return (
    <div
      className={cn('relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all', dragOver ? 'border-brand-primary bg-brand-primary/5' : 'border-white/10 hover:border-white/20', className)}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      {uploading ? (
        <div className="flex flex-col items-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-brand-primary" /><p className="text-sm text-text-muted">Uploading...</p></div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-dark-600 flex items-center justify-center"><Upload className="h-5 w-5 text-text-muted" /></div>
          <p className="text-sm text-text-secondary">Click or drag to upload image</p>
          <p className="text-xs text-text-muted">PNG, JPG up to 5MB</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
    </div>
  )
}
