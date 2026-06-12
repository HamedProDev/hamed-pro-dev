'use client'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <Textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || 'Write in Markdown...'} className="min-h-[300px] font-mono text-sm" />
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-[300px] rounded-lg border border-dark-500 bg-dark-800 p-4 prose prose-invert max-w-none">
          {value ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown> : <p className="text-text-muted">Nothing to preview.</p>}
        </div>
      </TabsContent>
    </Tabs>
  )
}
