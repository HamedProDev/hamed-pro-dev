import slugifyLib from 'slugify'

export function generateSlug(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, trim: true })
}
