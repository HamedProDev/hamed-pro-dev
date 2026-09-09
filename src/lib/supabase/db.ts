import { createServiceClient } from './server'

type Filter = { field: string; operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in'; value: any }
type OrderBy = { field: string; direction: 'asc' | 'desc' }
type QueryOptions = {
  filters?: Filter[]
  orderBy?: OrderBy | OrderBy[]
  limit?: number
  offset?: number
  select?: string
}

function applyFilters(query: any, filters?: Filter[]) {
  if (!filters) return query
  for (const f of filters) {
    query = query[f.operator](f.field, f.value)
  }
  return query
}

function applyOrderBy(query: any, orderBy?: OrderBy | OrderBy[]) {
  if (!orderBy) return query
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy]
  for (const o of orders) {
    query = query.order(o.field, { ascending: o.direction === 'asc' })
  }
  return query
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * PostgREST rejects a write when the payload contains a column the live table
 * doesn't have (PGRST204, e.g. an unapplied migration). One stale column used
 * to fail the whole admin save; instead, drop the offending key and retry so
 * the rest of the payload persists. The dropped keys are reported on console.
 */
function unknownColumn(error: any): string | null {
  if (!error) return null
  const msg: string = error.message || error.msg || ''
  const match = msg.match(/Could not find the '([^']+)' column/i)
  if (match) return match[1]
  if (error.code === 'PGRST204' && /column/i.test(msg)) {
    const quoted = msg.match(/'([^']+)'/)
    if (quoted) return quoted[1]
  }
  return null
}

export async function uniqueSlug(table: string, base: string, options: { scopeField?: string; scopeValue?: any } = {}): Promise<string> {
  const clean = base || 'item'
  const filters: Filter[] = [{ field: 'slug', operator: 'like', value: `${clean}%` }]
  if (options.scopeField) filters.push({ field: options.scopeField, operator: 'eq', value: options.scopeValue })
  let taken: string[] = []
  try {
    const rows = await getDocuments(table, { filters, select: 'slug' })
    taken = rows.map((r: any) => r.slug)
  } catch {
    return clean // table unreadable — let the write surface the real error
  }
  if (!taken.includes(clean)) return clean
  for (let i = 2; i < 1000; i++) {
    const candidate = `${clean}-${i}`
    if (!taken.includes(candidate)) return candidate
  }
  return `${clean}-${Date.now()}`
}

async function writeWithColumnFallback(
  attempt: (data: Record<string, any>) => Promise<any>,
  data: Record<string, any>
): Promise<{ result: any; data: Record<string, any> }> {
  let payload = data
  // Only unknown columns are dropped, never values: each retry removes the
  // single column PostgREST complained about.
  for (let guard = 0; guard < 50; guard++) {
    try {
      const result = await attempt(payload)
      return { result, data: payload }
    } catch (error: any) {
      const column = unknownColumn(error)
      if (!column || !(column in payload)) throw error
      console.warn(`[db] column "${column}" does not exist on the live table — saving without it. Run the latest supabase/*.sql migrations to restore it.`)
      const { [column]: _dropped, ...rest } = payload
      payload = rest
    }
  }
  throw new Error('Too many unknown columns in payload')
}

export async function getDocument(table: string, id: string): Promise<any> {
  // Fake fallback IDs (skill-0, test-0, slugs…) are never valid UUIDs —
  // treat them as "not found" instead of letting Postgres throw a 500.
  if (!UUID_RE.test(id)) return null
  const supabase = createServiceClient()
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
  if (error) throw error
  return data as any
}

export async function getDocuments(table: string, options: QueryOptions = {}): Promise<any[]> {
  const supabase = createServiceClient()
  let query = supabase.from(table).select(options.select || '*')
  query = applyFilters(query, options.filters)
  query = applyOrderBy(query, options.orderBy)

  if (options.limit) {
    const from = options.offset || 0
    const to = from + options.limit - 1
    query = query.range(from, to)
  }

  const { data, error } = await query
  if (error) throw error
  return (data || []) as any[]
}

export async function createDocument(table: string, data: Record<string, any>): Promise<any> {
  const supabase = createServiceClient()
  const { result } = await writeWithColumnFallback(
    async (payload) => {
      const { data: inserted, error } = await supabase.from(table).insert(payload).select().single()
      if (error) throw error
      return inserted
    },
    data
  )
  return result as any
}

export async function createDocumentWithId(table: string, id: string, data: Record<string, any>): Promise<any> {
  const supabase = createServiceClient()
  const { data: result, error } = await supabase.from(table).insert({ id, ...data }).select().single()
  if (error) throw error
  return result as any
}

export async function updateDocument(table: string, id: string, data: Record<string, any>): Promise<any> {
  const supabase = createServiceClient()
  const { result } = await writeWithColumnFallback(
    async (payload) => {
      const { data: updated, error } = await supabase.from(table).update(payload).eq('id', id).select().single()
      if (error) throw error
      return updated
    },
    data
  )
  return result as any
}

export async function deleteDocument(table: string, id: string): Promise<boolean> {
  const supabase = createServiceClient()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
  return true
}

export async function countDocuments(table: string, filters?: Filter[]): Promise<number> {
  const supabase = createServiceClient()
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  query = applyFilters(query, filters)
  const { count, error } = await query
  if (error) throw error
  return count || 0
}
