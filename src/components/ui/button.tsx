import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 text-white hover:brightness-110 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:shadow-glow-sm',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-brand-primary/40 bg-brand-primary/5 backdrop-blur-md text-brand-primary hover:bg-brand-primary/10 hover:shadow-glow-sm',
        secondary: 'bg-surface-tertiary/70 backdrop-blur-md text-text-primary hover:bg-surface-secondary border border-border-primary',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-tertiary',
        link: 'text-brand-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 rounded-full px-4 text-xs',
        lg: 'h-12 rounded-full px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
