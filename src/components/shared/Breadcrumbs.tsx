import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { BreadcrumbJsonLd } from '@/components/shared/JsonLd'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLdItems = [{ name: 'Home', url: '/' }, ...items.map(i => ({ name: i.label, url: i.href || '#' }))]
  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-1.5 text-sm text-text-muted flex-wrap">
          <li>
            <Link href="/" className="hover:text-text-primary transition-colors" aria-label="Home">
              <Home className="h-4 w-4" />
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              {item.href && i < items.length - 1 ? (
                <Link href={item.href} className="hover:text-text-primary transition-colors truncate max-w-[200px]">{item.label}</Link>
              ) : (
                <span className="text-text-primary font-medium truncate max-w-[200px]" aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
