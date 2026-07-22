import { getFirebaseAdmin } from './config'

export async function uploadFile(file: Buffer, filename: string, folder: string = 'hamedpro') {
  const { storage } = getFirebaseAdmin()
  const bucket = storage.bucket()
  const path = `${folder}/${Date.now()}-${filename}`
  const fileRef = bucket.file(path)

  await fileRef.save(file, {
    metadata: { contentType: 'auto' },
  })

  await fileRef.makePublic()
  return `https://storage.googleapis.com/${bucket.name}/${path}`
}

export async function deleteFile(url: string) {
  const { storage } = getFirebaseAdmin()
  const bucket = storage.bucket()
  const path = url.replace(`https://storage.googleapis.com/${bucket.name}/`, '')
  await bucket.file(path).delete()
}
