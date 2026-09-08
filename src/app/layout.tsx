import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Providers } from '@/components/providers'
import { Toaster } from 'sonner'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { WebSiteJsonLd } from '@/components/shared/JsonLd'
import { getDocuments } from '@/lib/supabase/db'
import './globals.css'

export const dynamic = 'force-dynamic'

const inter = localFont({
  src: [
    { path: '../../public/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Inter-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
})

const defaultMetadata: Metadata = {
  title: { default: 'Hamed Hussein (AKA hamedprodev) — Full Stack Developer & AI/ML Engineer', template: '%s | Hamed Hussein' },
  description: 'Hamed Hussein, AKA hamedprodev, is a full stack developer and AI/ML engineer based in Kigali, Rwanda — building modern web apps, AI-powered solutions, free courses, and verifiable certificates.',
  keywords: ['Hamed Hussein', 'hamedprodev', 'Full Stack Developer', 'AI/ML Engineer', 'Rwanda', 'Kigali', 'React', 'Next.js', 'Python', 'Machine Learning'],
  authors: [{ name: 'Hamed Hussein' }],
  creator: 'Hamed Hussein',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hamedhussein.is-a.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Hamed Hussein',
    title: 'Hamed Hussein (AKA hamedprodev) — Full Stack Developer & AI/ML Engineer',
    description: 'Full stack developer & AI/ML engineer from Kigali, Rwanda. Free courses, verifiable certificates, and innovative products.',
    images: [{ url: '/og/default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hamed Hussein (AKA hamedprodev) — Full Stack Developer & AI/ML Engineer',
    description: 'Full stack developer & AI/ML engineer from Kigali, Rwanda. Free courses and verifiable certificates.',
    creator: '@hamedProDev',
    images: ['/og/default.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/logo.svg', shortcut: '/logo.svg', apple: '/logo.svg' },
}

// Override the static defaults with the admin's SEO settings when present
// (safe: falls back to the defaults if Supabase or settings aren't available).
export async function generateMetadata(): Promise<Metadata> {
  try {
    const docs = await getDocuments('settings', { limit: 1 })
    const seo = docs[0]?.seo_defaults
    if (!seo) return defaultMetadata

    const title = seo.metaTitle || (defaultMetadata.title as any)?.default
    const description = seo.metaDescription || defaultMetadata.description
    const keywords = Array.isArray(seo.keywords) && seo.keywords.length > 0 ? seo.keywords : defaultMetadata.keywords
    const ogImage = seo.ogImage || '/og/default.png'

    return {
      ...defaultMetadata,
      title: { default: title, template: '%s | Hamed Hussein' },
      description,
      keywords,
      openGraph: {
        ...defaultMetadata.openGraph,
        title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
      twitter: {
        ...defaultMetadata.twitter,
        title,
        description,
        images: [ogImage],
      },
    }
  } catch {
    return defaultMetadata
  }
}

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          <WebSiteJsonLd />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-lg">Skip to main content</a>
          {children}
          <Toaster position="bottom-right" theme="dark" richColors />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
