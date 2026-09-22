import type { AdventureCode } from '@/types/adventure';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';
import { mockAdventureCodes } from './adventure-meta';

export function getPersistedAdventureCodes(): AdventureCode[] {
  const stored = getStorageItem<AdventureCode[] | null>(STORAGE_KEYS.ADVENTURE_CODES, null);
  if (!stored) {
    setStorageItem(STORAGE_KEYS.ADVENTURE_CODES, mockAdventureCodes);
    return mockAdventureCodes;
  }
  return stored;
}
