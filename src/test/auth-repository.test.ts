import { describe, it, expect, beforeEach } from 'vitest';
import { authRepository } from '@/services/repositories/auth-repository';
import { removeStorageItem, STORAGE_KEYS } from '@/utils/storage';

describe('AuthRepository', () => {
  beforeEach(() => {
    removeStorageItem(STORAGE_KEYS.USERS);
    removeStorageItem(STORAGE_KEYS.GUEST_PROFILES);
    removeStorageItem(STORAGE_KEYS.AUTH_SESSION);
  });

  it('logs in demo guest', async () => {
    const result = await authRepository.login('guest@nugawela.com', 'guest123');
    expect(result.data.email).toBe('guest@nugawela.com');
    expect(result.data.role).toBe('guest');
  });

  it('rejects invalid credentials', async () => {
    const result = await authRepository.login('guest@nugawela.com', 'wrong');
    expect(result.error).toBeDefined();
  });

  it('registers a new user', async () => {
    const result = await authRepository.register({
      email: 'newguest@test.com',
      password: 'password123',
      firstName: 'New',
      lastName: 'Guest',
    });
    expect(result.data.email).toBe('newguest@test.com');
    expect(result.data.role).toBe('guest');
  });

  it('updates profile', async () => {
    const login = await authRepository.login('guest@nugawela.com', 'guest123');
    const updated = await authRepository.updateProfile(login.data.id, {
      phone: '0771234567',
      country: 'Sri Lanka',
    });
    expect(updated.data.phone).toBe('0771234567');
  });
});
