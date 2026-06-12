'use client'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface ApplyButtonProps {
  applicationUrl?: string
  applicationEmail?: string
}

export function ApplyButton({ applicationUrl, applicationEmail }: ApplyButtonProps) {
  if (applicationUrl) {
    return <Button asChild><a href={applicationUrl} target="_blank"><ExternalLink className="h-4 w-4 mr-2" />Apply Now</a></Button>
  }
  if (applicationEmail) {
    return <Button asChild><a href={`mailto:${applicationEmail}`}><ExternalLink className="h-4 w-4 mr-2" />Apply via Email</a></Button>
  }
  return <Button disabled>No Application Link</Button>
}
