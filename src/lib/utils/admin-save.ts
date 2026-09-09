'use client'

/**
 * Shared fetch helper for admin forms — parses the API response and returns a
 * normalized { ok, error } result so pages never show a fake success state.
 */
export async function saveJson(
  url: string,
  body: any,
  options: { method?: string } = {}
): Promise<{ ok: boolean; data: any; error: string | null }> {
  try {
    const res = await fetch(url, {
      method: options.method || 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    let data: any = null
    try {
      data = await res.json()
    } catch {
      // non-JSON response (proxy error page etc.)
    }
    if (res.ok && data?.success) {
      return { ok: true, data, error: null }
    }
    return { ok: false, data, error: data?.error || `Request failed (HTTP ${res.status})` }
  } catch {
    return { ok: false, data: null, error: 'Network error — check your connection and try again.' }
  }
}
