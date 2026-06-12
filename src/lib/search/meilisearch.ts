export interface SearchIndex {
  uid: string
  primaryKey: string
}

export async function searchIndex(indexName: string, query: string, limit: number = 10) {
  const host = process.env.MEILISEARCH_HOST
  const apiKey = process.env.MEILISEARCH_API_KEY
  if (!host) return []

  const res = await fetch(`${host}/indexes/${indexName}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({ q: query, limit }),
  })

  if (!res.ok) return []
  const data = await res.json()
  return data.hits || []
}

export async function globalSearch(query: string) {
  const [projects, posts, courses, jobs] = await Promise.all([
    searchIndex('projects', query),
    searchIndex('blogposts', query),
    searchIndex('courses', query),
    searchIndex('jobs', query),
  ])
  return { projects, posts, courses, jobs }
}
