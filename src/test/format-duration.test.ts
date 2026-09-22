import { describe, it, expect } from 'vitest';
import { formatDuration, formatDistanceMeters } from '@/utils/format-duration';

describe('formatDuration', () => {
  it('formats minutes under an hour', () => {
    expect(formatDuration(720)).toBe('12 min');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(3900)).toBe('1 hr 5 min');
  });
});

describe('formatDistanceMeters', () => {
  it('formats metres and kilometres', () => {
    expect(formatDistanceMeters(450)).toBe('450 m');
    expect(formatDistanceMeters(2500)).toBe('2.5 km');
  });
});
