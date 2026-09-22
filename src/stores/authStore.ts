import type { User, Role } from '@/types';
import { getStorageItem, setStorageItem, removeStorageItem, STORAGE_KEYS } from '@/utils/storage';
import { create } from 'zustand';

function readStoredUser(): User | null {
  return getStorageItem<User | null>(STORAGE_KEYS.AUTH_SESSION, null);
}

const storedUser = readStoredUser();

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser,
  isAuthenticated: storedUser !== null,

  login: (user) => {
    setStorageItem(STORAGE_KEYS.AUTH_SESSION, user);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    removeStorageItem(STORAGE_KEYS.AUTH_SESSION);
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const user = readStoredUser();
    if (user) {
      set({ user, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export function hasRole(user: User | null, roles: Role[]): boolean {
  return user !== null && roles.includes(user.role);
}
