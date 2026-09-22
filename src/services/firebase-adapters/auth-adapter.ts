import type { User, Role, GuestProfile, GuestPreferences } from '@/types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useAuthStore } from '@/stores/authStore';
import type { AuthRepository } from '../repositories/auth-repository';
import { getFirebaseAuth } from '../firebase/config';
import { COLLECTIONS } from '../firebase/collections';
import { fetchDocument, upsertDocument } from '../firebase/firestore-helpers';

const defaultPreferences: GuestPreferences = {
  accessibilityMode: false,
  newsletterOptIn: false,
  adventureHintsEnabled: true,
  notificationEmail: true,
  notificationPush: false,
  interests: [],
};

async function loadUser(uid: string): Promise<User | null> {
  const doc = await fetchDocument<User>(COLLECTIONS.USERS, uid);
  return doc ?? null;
}

async function saveUser(user: User) {
  await upsertDocument(COLLECTIONS.USERS, user.id, user);
}

async function loadProfile(userId: string): Promise<GuestProfile | null> {
  return fetchDocument<GuestProfile>(COLLECTIONS.GUEST_PROFILES, userId);
}

async function saveProfile(profile: GuestProfile) {
  await upsertDocument(COLLECTIONS.GUEST_PROFILES, profile.userId, profile);
}

export function createFirebaseAuthRepository(): AuthRepository {
  return {
    async login(email, password) {
      try {
        const auth = getFirebaseAuth();
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = await loadUser(credential.user.uid);
        if (!user) {
          return { data: null as never, error: 'User profile not found. Contact resort staff.' };
        }
        useAuthStore.getState().login(user);
        return { data: user };
      } catch {
        return { data: null as never, error: 'Invalid email or password' };
      }
    },

    async register(input) {
      const auth = getFirebaseAuth();
      const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
      const now = new Date().toISOString();
      const user: User = {
        id: credential.user.uid,
        email: input.email.toLowerCase(),
        displayName: `${input.firstName} ${input.lastName}`,
        role: 'guest',
        createdAt: now,
        updatedAt: now,
      };
      const profile: GuestProfile = {
        userId: user.id,
        firstName: input.firstName,
        lastName: input.lastName,
        preferences: { ...defaultPreferences },
      };
      await saveUser(user);
      await saveProfile(profile);
      useAuthStore.getState().login(user);
      return { data: user };
    },

    async getProfile(userId) {
      const profile = await loadProfile(userId);
      return { data: profile };
    },

    async updateProfile(userId, updates) {
      const existing = await loadProfile(userId);
      if (!existing) return { data: null as never, error: 'Profile not found' };

      const updated: GuestProfile = { ...existing, ...updates };
      await saveProfile(updated);

      if (updates.firstName || updates.lastName) {
        const user = await loadUser(userId);
        if (user) {
          const nextUser: User = {
            ...user,
            displayName: `${updated.firstName} ${updated.lastName}`,
            updatedAt: new Date().toISOString(),
          };
          await saveUser(nextUser);
          useAuthStore.getState().login(nextUser);
        }
      }
      return { data: updated };
    },

    async requestPasswordReset(email) {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
      return { data: { success: true } };
    },

    async logout() {
      await signOut(getFirebaseAuth());
      useAuthStore.getState().logout();
    },
  };
}

export async function seedDemoAuthUsers() {
  const demos: Array<{ email: string; password: string; displayName: string; role: Role }> = [
    {
      email: 'guest@nugawela.com',
      password: 'guest123',
      displayName: 'Elena Marchetti',
      role: 'guest',
    },
    {
      email: 'admin@nugawela.com',
      password: 'admin123',
      displayName: 'Resort Admin',
      role: 'resort_admin',
    },
  ];

  const auth = getFirebaseAuth();

  for (const demo of demos) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, demo.email, demo.password);
      const now = new Date().toISOString();
      const user: User = {
        id: credential.user.uid,
        email: demo.email,
        displayName: demo.displayName,
        role: demo.role,
        createdAt: now,
        updatedAt: now,
      };
      await saveUser(user);
      const [firstName, ...rest] = demo.displayName.split(' ');
      await saveProfile({
        userId: user.id,
        firstName,
        lastName: rest.join(' '),
        preferences: { ...defaultPreferences },
      });
      await signOut(auth);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      if (code !== 'auth/email-already-in-use') {
        console.warn(`Demo user seed skipped for ${demo.email}:`, error);
      }
    }
  }
}
