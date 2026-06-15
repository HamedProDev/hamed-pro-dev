export function WebSiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hamedprodev.onrender.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HamedProDev',
    url: baseUrl,
    description: 'Personal developer ecosystem of Hamed Hussein — Fullstack & AI/ML Engineer',
    author: { '@type': 'Person', name: 'Hamed Hussein' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function PersonJsonLd({ name, jobTitle, url, image, sameAs }: {
  name: string; jobTitle: string; url: string; image?: string; sameAs?: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url,
    image,
    sameAs,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BlogPostingJsonLd({ headline, description, author, datePublished, image, url }: {
  headline: string; description: string; author: string; datePublished: string; image?: string; url?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    author: { '@type': 'Person', name: author },
    datePublished,
    image,
    url,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function CourseJsonLd({ name, description, provider, url }: {
  name: string; description: string; provider: string; url: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: { '@type': 'Person', name: provider },
    url,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function JobPostingJsonLd({ title, description, datePosted, jobLocation, employmentType, salaryMin, salaryMax, currency }: {
  title: string; description: string; datePosted: string; jobLocation: string; employmentType?: string; salaryMin?: number; salaryMax?: number; currency?: string
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted,
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: jobLocation } },
  }
  if (employmentType) schema.employmentType = employmentType
  if (salaryMin || salaryMax) schema.baseSalary = {
    '@type': 'MonetaryAmount',
    currency: currency || 'USD',
    value: {
      '@type': 'QuantitativeValue',
      ...(salaryMin ? { minValue: salaryMin } : {}),
      ...(salaryMax ? { maxValue: salaryMax } : {}),
      unitText: 'YEAR',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
