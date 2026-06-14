import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary',
        secondary: 'border-[var(--border-color)] bg-surface-tertiary text-text-secondary',
        destructive: 'border-red-500/30 bg-red-500/10 text-red-400',
        outline: 'border-[var(--border-color)] text-text-secondary',
        success: 'border-green-500/30 bg-green-500/10 text-green-400',
        warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
