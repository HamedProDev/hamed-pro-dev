import { getFirebaseAdmin } from './config'

export function getCollection(name: string) {
  const { db } = getFirebaseAdmin()
  return db.collection(name)
}

export async function getDocument(collection: string, id: string) {
  const snap = await getCollection(collection).doc(id).get()
  if (!snap.exists) return null
  return { id: snap.id, ...snap.data() }
}

export async function getDocuments(
  collection: string,
  options?: {
    filters?: { field: string; operator: FirebaseFirestore.WhereFilterOp; value: any }[]
    orderBy?: { field: string; direction?: 'asc' | 'desc' }
    limit?: number
    offset?: number
  }
) {
  let query: FirebaseFirestore.Query = getCollection(collection)

  if (options?.filters) {
    for (const filter of options.filters) {
      query = query.where(filter.field, filter.operator, filter.value)
    }
  }

  if (options?.orderBy) {
    query = query.orderBy(options.orderBy.field, options.orderBy.direction || 'asc')
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.offset(options.offset)
  }

  const snap = await query.get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function createDocument(collection: string, data: any) {
  const docRef = await getCollection(collection).add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  const doc = await docRef.get()
  return { id: doc.id, ...doc.data() }
}

export async function createDocumentWithId(collection: string, id: string, data: any) {
  await getCollection(collection).doc(id).set({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  const doc = await getCollection(collection).doc(id).get()
  return { id: doc.id, ...doc.data() }
}

export async function updateDocument(collection: string, id: string, data: any) {
  await getCollection(collection).doc(id).update({
    ...data,
    updatedAt: new Date(),
  })
  const doc = await getCollection(collection).doc(id).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() }
}

export async function deleteDocument(collection: string, id: string) {
  await getCollection(collection).doc(id).delete()
  return true
}

export async function countDocuments(
  collection: string,
  filters?: { field: string; operator: FirebaseFirestore.WhereFilterOp; value: any }[]
) {
  const { db } = getFirebaseAdmin()
  let query: FirebaseFirestore.Query = db.collection(collection)
  if (filters) {
    for (const f of filters) {
      query = query.where(f.field, f.operator, f.value)
    }
  }
  const snap = await query.count().get()
  return snap.data().count
}
