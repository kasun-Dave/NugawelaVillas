const STORAGE_PREFIX = 'lanka_horizons_';

const memoryStore = new Map<string, string>();

function getStore(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      // Probe — Node's experimental localStorage can exist but throw/be incomplete
      localStorage.getItem('__probe__');
      return localStorage;
    }
  } catch {
    /* fall through */
  }
  return null;
}

export function getStorageItem<T>(key: string, fallback: T): T {
  const fullKey = STORAGE_PREFIX + key;
  try {
    const store = getStore();
    const raw = store ? store.getItem(fullKey) : (memoryStore.get(fullKey) ?? null);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  const fullKey = STORAGE_PREFIX + key;
  const serialized = JSON.stringify(value);
  try {
    const store = getStore();
    if (store) {
      store.setItem(fullKey, serialized);
    } else {
      memoryStore.set(fullKey, serialized);
    }
  } catch (error) {
    memoryStore.set(fullKey, serialized);
    console.error(`Failed to persist ${key}:`, error);
  }
}

export function removeStorageItem(key: string): void {
  const fullKey = STORAGE_PREFIX + key;
  try {
    const store = getStore();
    if (store) {
      store.removeItem(fullKey);
    }
  } catch {
    /* ignore */
  }
  memoryStore.delete(fullKey);
}

export function clearAllStorage(): void {
  try {
    const store = getStore();
    if (store) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => store.removeItem(key));
    }
  } catch {
    /* ignore */
  }
  for (const key of [...memoryStore.keys()]) {
    if (key.startsWith(STORAGE_PREFIX)) memoryStore.delete(key);
  }
}

export const STORAGE_KEYS = {
  AUTH_SESSION: 'auth_session',
  BOOKINGS: 'bookings',
  NEWSLETTER: 'newsletter_subscriptions',
  ITINERARY: 'saved_itinerary',
  ADVENTURE_PROGRESS: 'adventure_progress',
  PREFERENCES: 'user_preferences',
  FEATURE_FLAGS: 'feature_flags',
  USERS: 'registered_users',
  GUEST_PROFILES: 'guest_profiles',
  NOTIFICATIONS: 'notifications',
  ADVENTURE_CODES: 'adventure_codes',
  AUDIT_LOGS: 'audit_logs',
  CONTENT_OVERRIDES: 'content_overrides',
} as const;
