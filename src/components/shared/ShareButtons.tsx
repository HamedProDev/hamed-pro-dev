'use client'

import { Twitter, Linkedin, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CopyButton } from './CopyButton'

interface ShareButtonsProps {
  title: string
  url: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </a>
      </Button>
      <CopyButton text={url} />
    </div>
  )
}
