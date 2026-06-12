'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ tags, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
      setInput('')
    }
  }

  const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag))

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} placeholder={placeholder || 'Add tag...'} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} />
        <Button type="button" variant="outline" onClick={addTag}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1">{tag}<button onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button></Badge>
        ))}
      </div>
    </div>
  )
}
