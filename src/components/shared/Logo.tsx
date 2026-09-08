import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string
}

/** Hamed Hussein monogram mark (violet → fuchsia gradient). */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn('h-8 w-8', className)}
    >
      <defs>
        <linearGradient id="hhg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#hhg)" />
      <g stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round">
        <path d="M14 13.5v21" />
        <path d="M14 24h7.6" />
        <path d="M21.6 13.5v21" />
        <path d="M26.4 13.5v21" />
        <path d="M26.4 24h7.6" />
        <path d="M34 13.5v21" />
      </g>
    </svg>
  )
}
