import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border bg-[var(--input-bg)] border-[var(--input-border)] px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors hover:border-[var(--input-border-hover)] focus-visible:outline-none focus-visible:border-brand-primary/70 focus-visible:ring-2 focus-visible:ring-brand-primary/25 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
