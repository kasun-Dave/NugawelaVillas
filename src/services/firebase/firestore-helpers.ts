import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { getFirestoreDb } from './config';

export async function fetchCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
) {
  const db = getFirestoreDb();
  const ref = collection(db, collectionName);
  const snapshot = constraints.length
    ? await getDocs(query(ref, ...constraints))
    : await getDocs(ref);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export async function fetchDocument<T>(collectionName: string, docId: string) {
  const db = getFirestoreDb();
  const snapshot = await getDoc(doc(db, collectionName, docId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as T;
}

export async function upsertDocument(
  collectionName: string,
  docId: string,
  data: DocumentData,
  merge = true,
) {
  const db = getFirestoreDb();
  await setDoc(doc(db, collectionName, docId), data, { merge });
}

export async function deleteDocument(collectionName: string, docId: string) {
  const db = getFirestoreDb();
  await deleteDoc(doc(db, collectionName, docId));
}

export async function fetchWhere<T>(collectionName: string, field: string, value: string) {
  return fetchCollection<T>(collectionName, [where(field, '==', value)]);
}
