import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin, apiSuccess, apiError } from '@/lib/supabase/helpers'

const BUCKET = 'uploads'

interface MediaItem {
  name: string
  path: string
  url: string
  folder: string
  size: number
  updatedAt: string
}

// Recursively list files in the uploads bucket (bounded depth).
async function listFolder(supabase: any, folder: string, depth: number, out: MediaItem[] = []): Promise<MediaItem[]> {
  if (depth > 4) return out
  const { data, error } = await supabase.storage.from(BUCKET).list(folder, { limit: 500, sortBy: { column: 'updated_at', order: 'desc' } })
  if (error || !data) return out

  for (const item of data) {
    const fullPath = folder ? `${folder}/${item.name}` : item.name
    if (item.id === null) {
      // Folder marker
      await listFolder(supabase, fullPath, depth + 1, out)
    } else {
      const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(fullPath)
      out.push({
        name: item.name,
        path: fullPath,
        url: publicUrl.publicUrl,
        folder: folder || '/',
        size: item.metadata?.size || 0,
        updatedAt: item.updated_at || item.created_at || '',
      })
    }
  }
  return out
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)
    const supabase = createServiceClient()
    const items = await listFolder(supabase, '', 0)
    // newest first
    items.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    return apiSuccess(items)
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin(req)
    const { paths } = await req.json().catch(() => ({}))
    if (!Array.isArray(paths) || paths.length === 0) return apiError('No files specified', 400)

    const supabase = createServiceClient()
    const { error } = await supabase.storage.from(BUCKET).remove(paths)
    if (error) return apiError(error.message, 500)
    return apiSuccess({ removed: paths.length }, 'Files deleted')
  } catch (error: any) {
    return apiError(error.message, error.message === 'Unauthorized' ? 401 : 500)
  }
}
