import type { GuestPreferences } from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';
import { create } from 'zustand';

const defaultPreferences: GuestPreferences = {
  accessibilityMode: false,
  newsletterOptIn: false,
  adventureHintsEnabled: true,
  notificationEmail: true,
  notificationPush: false,
  interests: [],
};

interface PreferencesState {
  preferences: GuestPreferences;
  updatePreferences: (updates: Partial<GuestPreferences>) => void;
  initialize: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  preferences: defaultPreferences,

  updatePreferences: (updates) => {
    const newPrefs = { ...get().preferences, ...updates };
    setStorageItem(STORAGE_KEYS.PREFERENCES, newPrefs);
    set({ preferences: newPrefs });
  },

  initialize: () => {
    const prefs = getStorageItem<GuestPreferences>(STORAGE_KEYS.PREFERENCES, defaultPreferences);
    set({ preferences: prefs });
  },
}));
