import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/utils/storage';

export interface ContentOverrides {
  destinations: Record<string, { featured?: boolean }>;
  experiences: Record<string, { featured?: boolean }>;
}

const empty: ContentOverrides = { destinations: {}, experiences: {} };

export function getContentOverrides(): ContentOverrides {
  return getStorageItem<ContentOverrides>(STORAGE_KEYS.CONTENT_OVERRIDES, empty);
}

export function saveContentOverrides(overrides: ContentOverrides) {
  setStorageItem(STORAGE_KEYS.CONTENT_OVERRIDES, overrides);
}

export function applyDestinationOverrides<T extends { id: string; featured: boolean }>(
  items: T[],
): T[] {
  const overrides = getContentOverrides().destinations;
  return items.map((item) => {
    const o = overrides[item.id];
    if (o?.featured !== undefined) return { ...item, featured: o.featured };
    return item;
  });
}

export function applyExperienceOverrides<T extends { id: string; featured: boolean }>(
  items: T[],
): T[] {
  const overrides = getContentOverrides().experiences;
  return items.map((item) => {
    const o = overrides[item.id];
    if (o?.featured !== undefined) return { ...item, featured: o.featured };
    return item;
  });
}
