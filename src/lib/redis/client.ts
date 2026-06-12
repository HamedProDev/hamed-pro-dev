import { Redis } from '@upstash/redis'

let redis: Redis | null = null

export function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL) return null
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const r = getRedis()
  if (!r) return null
  const data = await r.get(key)
  return data as T
}

export async function cacheSet(key: string, value: any, ttl: number = 300): Promise<void> {
  const r = getRedis()
  if (!r) return
  await r.set(key, value, { ex: ttl })
}

export async function cacheDelete(key: string): Promise<void> {
  const r = getRedis()
  if (!r) return
  await r.del(key)
}
