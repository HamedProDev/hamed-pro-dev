import { createClient, createServiceClient } from './server'

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

export async function getDocument(table: string, id: string): Promise<any> {
  const supabase = createClient()
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
  if (error) throw error
  return data as any
}

export async function getDocuments(table: string, options: QueryOptions = {}): Promise<any[]> {
  const supabase = createClient()
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

export async function createDocument(table: string, data: Record<string, any>, useServiceRole?: boolean): Promise<any> {
  const supabase = useServiceRole ? createServiceClient() : createClient()
  const { data: result, error } = await supabase.from(table).insert(data).select().single()
  if (error) throw error
  return result as any
}

export async function createDocumentWithId(table: string, id: string, data: Record<string, any>): Promise<any> {
  const supabase = createClient()
  const { data: result, error } = await supabase.from(table).insert({ id, ...data }).select().single()
  if (error) throw error
  return result as any
}

export async function updateDocument(table: string, id: string, data: Record<string, any>): Promise<any> {
  const supabase = createClient()
  const { data: result, error } = await supabase.from(table).update(data).eq('id', id).select().single()
  if (error) throw error
  return result as any
}

export async function deleteDocument(table: string, id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
  return true
}

export async function countDocuments(table: string, filters?: Filter[]): Promise<number> {
  const supabase = createClient()
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  query = applyFilters(query, filters)
  const { count, error } = await query
  if (error) throw error
  return count || 0
}
