import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  progress: number
  className?: string
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn('h-2 rounded-full bg-dark-600 overflow-hidden', className)}>
      <div className="h-full rounded-full bg-brand-primary transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
    </div>
  )
}
