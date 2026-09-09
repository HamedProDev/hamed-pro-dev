'use client'
import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { Upload, X, Loader2, Link as LinkIcon, Crop as CropIcon, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  className?: string
  folder?: string
  square?: boolean
}

async function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new window.Image()
    i.onload = () => resolve(i)
    i.onerror = () => reject(new Error('Could not load image'))
    i.src = imageSrc
  })
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(crop.width)
  canvas.height = Math.round(crop.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Crop failed'))), 'image/jpeg', 0.92)
  )
}

export function ImageUpload({ value, onChange, className, folder, square }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const inputRef = useRef<HTMLInputElement>(null)

  // Crop state (square/avatars only): pick → crop with grid → upload.
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null)
  const [cropping, setCropping] = useState(false)

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedPixels(pixels)
  }, [])

  const upload = async (file: File | Blob) => {
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (folder) formData.append('folder', folder)

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.data?.url) {
        onChange(data.data.url)
      } else {
        setError(data.error || 'Upload failed.')
      }
    } catch {
      setError('Upload failed. Try URL mode instead.')
    }
    setUploading(false)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only images allowed'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Max 5MB'); return }
    setError('')
    if (square) {
      // Avatars go through the crop grid first.
      const reader = new FileReader()
      reader.onload = () => {
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedPixels(null)
        setCropSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
      return
    }
    upload(file)
  }

  const handleCropUpload = async () => {
    if (!cropSrc || !croppedPixels) return
    setCropping(true)
    try {
      const blob = await getCroppedBlob(cropSrc, croppedPixels)
      setCropSrc(null)
      await upload(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }))
    } catch {
      setError('Could not crop this image. Try another file.')
    }
    setCropping(false)
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
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode('upload')} className={`text-xs px-3 py-1 rounded-lg transition-colors ${mode === 'upload' ? 'bg-violet-500/10 text-violet-500' : 'text-text-muted hover:text-text-primary'}`}>
          <Upload className="h-3 w-3 inline mr-1" /> Upload
        </button>
        <button type="button" onClick={() => setMode('url')} className={`text-xs px-3 py-1 rounded-lg transition-colors ${mode === 'url' ? 'bg-violet-500/10 text-violet-500' : 'text-text-muted hover:text-text-primary'}`}>
          <LinkIcon className="h-3 w-3 inline mr-1" /> URL
        </button>
      </div>

      {value && (
        <div className={cn('relative group overflow-hidden border border-border-primary', square ? 'aspect-square rounded-full' : 'rounded-xl')}>
          <Image src={value} alt="Uploaded" width={800} height={400} className={cn('object-cover', square ? 'w-full h-full' : 'w-full h-48')} unoptimized />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {mode === 'upload' && <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>Replace</Button>}
            <Button size="sm" variant="destructive" onClick={() => onChange('')}><X className="h-4 w-4" /></Button>
          </div>
          {error && <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs p-2 text-center">{error}</div>}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = '' }} />
        </div>
      )}

      {!value && mode === 'upload' && (
        <div
          className={cn('relative border-2 border-dashed p-8 text-center cursor-pointer transition-all', square ? 'aspect-square rounded-full flex flex-col items-center justify-center' : 'rounded-xl', dragOver ? 'border-violet-500 bg-violet-500/10' : 'border-border-primary hover:border-violet-500/50 bg-surface-secondary')}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /><p className="text-sm text-text-muted">Uploading...</p></div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center"><Upload className="h-5 w-5 text-violet-400" /></div>
              <p className="text-sm text-text-secondary">Click or drag to upload image</p>
              <p className="text-xs text-text-muted">PNG, JPG up to 5MB{square ? ' · you’ll crop it next' : ''}</p>
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = '' }} />
        </div>
      )}

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

      {/* Crop dialog (avatars): position the photo inside the grid, zoom, then upload. */}
      {cropSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !cropping && setCropSrc(null)} />
          <Card className="relative w-full max-w-lg glow-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CropIcon className="h-5 w-5 text-violet-500" /> Crop your photo
              </CardTitle>
              <p className="text-sm text-text-muted">Drag to position · scroll or slide to zoom · the grid helps you center faces</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-72 w-full bg-black rounded-xl overflow-hidden">
                <Cropper
                  image={cropSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex items-center gap-3">
                <ZoomIn className="h-4 w-4 text-text-muted shrink-0" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="w-full accent-violet-500"
                  aria-label="Zoom"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setCropSrc(null)} disabled={cropping}>
                  Cancel
                </Button>
                <Button type="button" className="gradient-bg text-white" onClick={handleCropUpload} disabled={cropping || !croppedPixels}>
                  {cropping ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Crop & Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
