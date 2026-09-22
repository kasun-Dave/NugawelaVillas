import { describe, it, expect } from 'vitest';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/storage';

describe('storage utilities', () => {
  it('stores and retrieves values', () => {
    setStorageItem('test_key', { name: 'Nugawela' });
    const result = getStorageItem('test_key', { name: '' });
    expect(result).toEqual({ name: 'Nugawela' });
    removeStorageItem('test_key');
  });

  it('returns fallback when key is missing', () => {
    const result = getStorageItem('missing_key', 'fallback');
    expect(result).toBe('fallback');
  });
});
