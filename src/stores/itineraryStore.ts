import { create } from 'zustand';
import type { ItineraryItem } from '@/types';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';

interface ItineraryState {
  items: ItineraryItem[];
  addItem: (type: 'destination' | 'experience', itemId: string) => boolean;
  removeItem: (id: string) => void;
  hasItem: (type: 'destination' | 'experience', itemId: string) => boolean;
  clear: () => void;
  initialize: () => void;
}

export const useItineraryStore = create<ItineraryState>((set, get) => ({
  items: [],

  addItem: (type, itemId) => {
    if (get().hasItem(type, itemId)) return false;
    const newItem: ItineraryItem = {
      id: crypto.randomUUID(),
      type,
      itemId,
      addedAt: new Date().toISOString(),
    };
    const items = [...get().items, newItem];
    setStorageItem(STORAGE_KEYS.ITINERARY, items);
    set({ items });
    return true;
  },

  removeItem: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    setStorageItem(STORAGE_KEYS.ITINERARY, items);
    set({ items });
  },

  hasItem: (type, itemId) => {
    return get().items.some((i) => i.type === type && i.itemId === itemId);
  },

  clear: () => {
    setStorageItem(STORAGE_KEYS.ITINERARY, []);
    set({ items: [] });
  },

  initialize: () => {
    const items = getStorageItem<ItineraryItem[]>(STORAGE_KEYS.ITINERARY, []);
    set({ items });
  },
}));
