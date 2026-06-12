'use client'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface TocItem { id: string; text: string; level: number }

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const regex = /^(#{1,3})\s+(.+)$/gm
    const items: TocItem[] = []
    let match
    while ((match = regex.exec(content)) !== null) {
      items.push({ id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-'), text: match[2], level: match[1].length })
    }
    setHeadings(items)
  }, [content])

  if (!headings.length) return null

  return (
    <nav className="sticky top-24 space-y-1">
      <h4 className="text-sm font-semibold text-text-primary mb-3">Table of Contents</h4>
      {headings.map(h => (
        <a key={h.id} href={`#${h.id}`} className={cn('block text-sm py-1 hover:text-brand-primary transition-colors', activeId === h.id ? 'text-brand-primary' : 'text-text-secondary')} style={{ paddingLeft: (h.level - 1) * 12 }}>
          {h.text}
        </a>
      ))}
    </nav>
  )
}
