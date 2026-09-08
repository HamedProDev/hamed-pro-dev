export function WebSiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hamedprodev.vercel.app'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hamed Hussein',
    url: baseUrl,
    description: 'Personal developer ecosystem of Hamed Hussein — Fullstack & AI/ML Engineer',
    author: { '@type': 'Person', name: 'Hamed Hussein' },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${baseUrl}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ProfilePageJsonLd({ name, jobTitle, url, image, sameAs }: {
  name: string; jobTitle: string; url: string; image?: string; sameAs?: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `About ${name}`,
    mainEntity: {
      '@type': 'Person',
      name,
      jobTitle,
      url,
      image,
      sameAs,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FAQJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(i => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ItemListJsonLd({ items, type, name }: {
  items: { name: string; url: string; description?: string }[]
  type: string
  name: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((i, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: { '@type': type, name: i.name, url: i.url, description: i.description },
    })),
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
