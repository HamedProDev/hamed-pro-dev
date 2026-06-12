import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: string, folder: string = 'hamedpro'): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: 'auto',
    format: 'auto',
    quality: 'auto',
  })
  return result.secure_url
}

export async function deleteImage(url: string): Promise<void> {
  const parts = url.split('/')
  const publicIdWithExt = parts[parts.length - 1]
  const publicId = publicIdWithExt.split('.')[0]
  const folder = parts[parts.length - 2]
  await cloudinary.uploader.destroy(`${folder}/${publicId}`)
}

export function getOptimizedUrl(url: string, options?: { width?: number; height?: number; quality?: number }): string {
  if (!url.includes('cloudinary.com')) return url
  const transformations: string[] = ['f_auto', 'q_auto']
  if (options?.width) transformations.push(`w_${options.width}`)
  if (options?.height) transformations.push(`h_${options.height}`)
  if (options?.quality) transformations.push(`q_${options.quality}`)
  return url.replace('/upload/', `/upload/${transformations.join(',')}/`)
}
