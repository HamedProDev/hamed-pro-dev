import { cn } from '@/lib/utils/cn'

interface MarqueeProps {
  items: string[]
  className?: string
  itemClassName?: string
}

export function Marquee({ items, className, itemClassName }: MarqueeProps) {
  const doubled = [...items, ...items]
  return (
    <div className={cn('relative overflow-hidden select-none', className)} aria-hidden="true">
      <div className="flex w-max animate-marquee gap-4">
        {doubled.map((item, i) => (
          <span
            key={i}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-border-primary bg-surface-card px-5 py-2.5 text-sm font-medium text-text-secondary whitespace-nowrap',
              itemClassName
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-tertiary" />
            {item}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-primary to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-primary to-transparent" />
    </div>
  )
}
