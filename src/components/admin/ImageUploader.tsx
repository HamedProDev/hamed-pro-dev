'use client'
import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Uploaded" className="h-40 rounded-lg object-cover" />
          <button onClick={() => onChange('')} className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="h-3 w-3" /></button>
        </div>
      )}
      <div className="flex gap-2">
        <Input placeholder="Image URL (Cloudinary)" value={value} onChange={e => onChange(e.target.value)} />
        <Button type="button" variant="outline" size="icon"><Upload className="h-4 w-4" /></Button>
      </div>
    </div>
  )
}
