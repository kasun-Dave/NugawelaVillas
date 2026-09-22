import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './config';
import { COLLECTIONS } from './collections';
import { fetchDocument } from './firestore-helpers';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

let unsubscribe: (() => void) | null = null;

export function startFirebaseAuthListener(): void {
  if (unsubscribe) return;

  const auth = getFirebaseAuth();
  unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      useAuthStore.getState().logout();
      return;
    }

    const user = await fetchDocument<User>(COLLECTIONS.USERS, firebaseUser.uid);
    if (user) {
      useAuthStore.getState().login(user);
    }
  });
}

export function stopFirebaseAuthListener(): void {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
}
