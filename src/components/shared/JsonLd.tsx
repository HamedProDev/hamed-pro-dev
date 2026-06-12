interface JsonLdProps {
  data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function PersonJsonLd({ profile }: { profile: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.tagline,
    url: 'https://hamedpro.rw',
    image: profile.avatar,
    email: profile.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Kigali', addressCountry: 'RW' },
    sameAs: [profile.github, profile.linkedin, profile.twitter].filter(Boolean),
    knowsAbout: profile.skills?.flatMap((s: any) => s.items?.map((i: any) => i.name) || []) || [],
  }
  return <JsonLd data={schema} />
}

export function ArticleJsonLd({ post }: { post: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: 'Hamed Hussein', url: 'https://hamedpro.rw' },
    publisher: {
      '@type': 'Organization',
      name: 'HamedProDev',
      logo: { '@type': 'ImageObject', url: 'https://hamedpro.rw/logo.png' },
    },
  }
  return <JsonLd data={schema} />
}

export function CourseJsonLd({ course }: { course: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    image: course.coverImage,
    provider: { '@type': 'Organization', name: 'HamedProDev' },
    offers: {
      '@type': 'Offer',
      price: course.price || 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/OnlineOnly',
    },
  }
  return <JsonLd data={schema} />
}

export function JobPostingJsonLd({ job }: { job: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    validThrough: job.expiresAt,
    employmentType: job.type?.toUpperCase().replace('-', '_'),
    hiringOrganization: { '@type': 'Organization', name: job.company },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location } },
  }
  return <JsonLd data={schema} />
}
