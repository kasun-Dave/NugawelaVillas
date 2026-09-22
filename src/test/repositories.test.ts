import { describe, it, expect } from 'vitest';
import { roomRepository } from '@/services/repositories/content-repositories';

describe('RoomRepository', () => {
  it('returns all rooms', async () => {
    const result = await roomRepository.getAll();
    expect(result.data.length).toBeGreaterThan(0);
  });

  it('returns featured rooms only', async () => {
    const result = await roomRepository.getFeatured();
    expect(result.data.every((r) => r.featured)).toBe(true);
  });

  it('finds room by slug', async () => {
    const result = await roomRepository.getBySlug('mountain-view-suite');
    expect(result.data?.name).toBe('Mountain View Suite');
  });
});
