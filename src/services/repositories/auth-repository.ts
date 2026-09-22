import type {
  User,
  GuestProfile,
  GuestPreferences,
  RegisterInput,
  RepositoryResult,
} from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';
import { useAuthStore } from '@/stores/authStore';

interface StoredUser extends User {
  passwordHash: string;
}

const defaultPreferences: GuestPreferences = {
  accessibilityMode: false,
  newsletterOptIn: false,
  adventureHintsEnabled: true,
  notificationEmail: true,
  notificationPush: false,
  interests: [],
};

function simpleHash(str: string): string {
  return btoa(str + '_nugawela_salt');
}

function seedUsers(): StoredUser[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'user-demo-guest',
      email: 'guest@nugawela.com',
      displayName: 'Elena Marchetti',
      role: 'guest',
      passwordHash: simpleHash('guest123'),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'user-demo-admin',
      email: 'admin@nugawela.com',
      displayName: 'Resort Admin',
      role: 'resort_admin',
      passwordHash: simpleHash('admin123'),
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function getUsers(): StoredUser[] {
  const stored = getStorageItem<StoredUser[]>(STORAGE_KEYS.USERS, []);
  if (stored.length === 0) {
    const seeded = seedUsers();
    setStorageItem(STORAGE_KEYS.USERS, seeded);
    return seeded;
  }
  return stored;
}

function saveUsers(users: StoredUser[]) {
  setStorageItem(STORAGE_KEYS.USERS, users);
}

function getProfiles(): GuestProfile[] {
  return getStorageItem<GuestProfile[]>(STORAGE_KEYS.GUEST_PROFILES, []);
}

function saveProfiles(profiles: GuestProfile[]) {
  setStorageItem(STORAGE_KEYS.GUEST_PROFILES, profiles);
}

export interface AuthRepository {
  login(email: string, password: string): Promise<RepositoryResult<User>>;
  register(input: RegisterInput): Promise<RepositoryResult<User>>;
  getProfile(userId: string): Promise<RepositoryResult<GuestProfile | null>>;
  updateProfile(
    userId: string,
    updates: Partial<GuestProfile>,
  ): Promise<RepositoryResult<GuestProfile>>;
  requestPasswordReset(email: string): Promise<RepositoryResult<{ success: boolean }>>;
  logout(): Promise<void>;
}

class LocalAuthRepository implements AuthRepository {
  async login(email: string, password: string) {
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.passwordHash !== simpleHash(password)) {
      return { data: null as never, error: 'Invalid email or password' };
    }
    const { passwordHash: _, ...safeUser } = user;
    useAuthStore.getState().login(safeUser);
    return { data: safeUser };
  }

  async register(input: RegisterInput) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return { data: null as never, error: 'An account with this email already exists' };
    }

    const now = new Date().toISOString();
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email: input.email.toLowerCase(),
      displayName: `${input.firstName} ${input.lastName}`,
      role: 'guest',
      passwordHash: simpleHash(input.password),
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);
    saveUsers(users);

    const profile: GuestProfile = {
      userId: newUser.id,
      firstName: input.firstName,
      lastName: input.lastName,
      preferences: { ...defaultPreferences },
    };
    const profiles = getProfiles();
    profiles.push(profile);
    saveProfiles(profiles);

    const { passwordHash: _, ...safeUser } = newUser;
    useAuthStore.getState().login(safeUser);
    return { data: safeUser };
  }

  async getProfile(userId: string) {
    const profiles = getProfiles();
    let profile = profiles.find((p) => p.userId === userId);
    if (!profile) {
      const users = getUsers();
      const user = users.find((u) => u.id === userId);
      if (!user) return { data: null };
      const [firstName, ...rest] = user.displayName.split(' ');
      profile = {
        userId,
        firstName: firstName ?? '',
        lastName: rest.join(' ') ?? '',
        preferences: { ...defaultPreferences },
      };
      profiles.push(profile);
      saveProfiles(profiles);
    }
    return { data: profile };
  }

  async updateProfile(userId: string, updates: Partial<GuestProfile>) {
    const profileResult = await this.getProfile(userId);
    if (!profileResult.data) return { data: null as never, error: 'Profile not found' };

    const profiles = getProfiles();
    const index = profiles.findIndex((p) => p.userId === userId);

    profiles[index] = { ...profiles[index], ...updates };
    if (updates.firstName || updates.lastName) {
      const users = getUsers();
      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].displayName = `${profiles[index].firstName} ${profiles[index].lastName}`;
        users[userIndex].updatedAt = new Date().toISOString();
        saveUsers(users);
        const { passwordHash: _, ...safeUser } = users[userIndex];
        useAuthStore.getState().login(safeUser);
      }
    }
    saveProfiles(profiles);
    return { data: profiles[index] };
  }

  async requestPasswordReset(email: string) {
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      return { data: { success: true } };
    }
    return { data: { success: true } };
  }

  async logout() {
    useAuthStore.getState().logout();
  }
}

export function createLocalAuthRepository(): AuthRepository {
  return new LocalAuthRepository();
}

export const authRepository: AuthRepository = createLocalAuthRepository();
