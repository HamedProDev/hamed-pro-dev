'use client'
import { useState, useRef } from 'react'
import { Upload, X, Loader2, Link as LinkIcon, FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: string
  label?: string
  folder?: string
}

/** Small file (e.g. PDF resume) uploader with upload + URL modes. */
export function FileUpload({ value, onChange, accept = 'application/pdf', label = 'PDF', folder }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (folder) fd.append('folder', folder)
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success && data.data?.url) onChange(data.data.url)
      else setError(data.error || 'Upload failed.')
    } catch {
      setError('Upload failed. Try URL mode instead.')
    }
    setUploading(false)
  }

  const handleFile = (file: File) => {
    const allowedTypes = accept.split(',').map(a => a.trim())
    if (!allowedTypes.includes(file.type)) {
      setError('File type not allowed')
      return
    }
    if (file.size > 10 * 1024 * 1024) { setError('Max 10MB'); return }
    setError('')
    upload(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode('upload')} className={`text-xs px-3 py-1 rounded-lg transition-colors ${mode === 'upload' ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}>
          <Upload className="h-3 w-3 inline mr-1" /> Upload
        </button>
        <button type="button" onClick={() => setMode('url')} className={`text-xs px-3 py-1 rounded-lg transition-colors ${mode === 'url' ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-muted hover:text-text-primary'}`}>
          <LinkIcon className="h-3 w-3 inline mr-1" /> URL
        </button>
      </div>

      {value ? (
        <div className="flex items-center gap-2 rounded-xl border border-border-primary bg-surface-tertiary/50 px-3 py-2">
          <FileText className="h-4 w-4 text-brand-primary shrink-0" />
          <span className="text-xs text-text-secondary truncate flex-1">{value.split('/').pop() || value}</span>
          <a href={value} target="_blank" rel="noopener noreferrer" className="p-1 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-text-primary">
            <ExternalLink className="h-4 w-4" />
          </a>
          <button type="button" onClick={() => onChange('')} className="p-1 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : mode === 'upload' ? (
        <div
          className="rounded-xl border-2 border-dashed border-border-primary hover:border-brand-primary/50 bg-surface-secondary p-4 text-center cursor-pointer transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-text-muted"><Loader2 className="h-4 w-4 animate-spin text-brand-primary" /> Uploading…</div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="h-5 w-5 text-brand-primary" />
              <p className="text-sm text-text-secondary">Click to upload {label}</p>
              <p className="text-xs text-text-muted">Up to 10MB</p>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
          )}
          <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }} />
        </div>
      ) : (
        <div className="flex gap-2">
          <Input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://…/resume.pdf" onKeyDown={e => e.key === 'Enter' && urlInput.trim() && onChange(urlInput.trim())} />
          <Button type="button" onClick={() => urlInput.trim() && onChange(urlInput.trim())} variant="outline" disabled={!urlInput.trim()}>Set</Button>
        </div>
      )}
    </div>
  )
}
