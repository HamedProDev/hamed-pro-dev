import type { Metadata } from 'next'

const SITE_NAME = 'Hamed Hussein'
const FALLBACK_URL = 'https://hamedhussein.is-a.dev'
const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || FALLBACK_URL

// Prefer the configured URL, but never use a localhost URL as the public base
// (so invite links, canonical URLs and schema data always point at the real site).
export const SITE_URL = /localhost|127\.0\.0\.1/.test(rawAppUrl)
  ? FALLBACK_URL
  : rawAppUrl.replace(/\/+$/, '')

/** Stable absolute URL — identical on server and client (avoids hydration mismatch). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

interface SeoParams {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  keywords?: string[]
  noindex?: boolean
}

export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords,
  noindex = false,
}: SeoParams): Metadata {
  const metaTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const ogImage = image || `${SITE_URL}/og/default.png`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL

  return {
    title: metaTitle,
    description,
    keywords,
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: metaTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: 'en_US',
      type: type as any,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [ogImage],
      creator: '@hamedProDev',
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}
