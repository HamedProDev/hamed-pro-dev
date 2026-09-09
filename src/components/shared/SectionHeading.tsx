import { cn } from '@/lib/utils/cn'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, highlight, description, align = 'center', className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-12', align === 'center' ? 'text-center' : 'text-left', className)}>
      {eyebrow && <span className="eyebrow mb-5">{eyebrow}</span>}
      <h2 className="display text-3xl sm:text-4xl md:text-5xl text-text-primary">
        {title}{' '}
        {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {description && (
        <p className={cn('text-text-secondary mt-4 text-base sm:text-lg max-w-2xl', align === 'center' ? 'mx-auto' : '')}>
          {description}
        </p>
      )}
    </div>
  )
}
