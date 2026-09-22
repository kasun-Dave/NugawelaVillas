import { describe, it, expect } from 'vitest';
import { calculatePriceBreakdown, calculateAddOnTotal } from '@/utils/pricing';
import { mockRooms } from '@/services/mock-data/rooms';
import { mockAddOns } from '@/services/mock-data/add-ons';
import { generateMockAvailability } from '@/services/mock-data/availability';

describe('pricing utilities', () => {
  const room = mockRooms[0];
  const availability = generateMockAvailability();

  it('calculates nightly total for date range', () => {
    const breakdown = calculatePriceBreakdown(
      room,
      '2026-07-01',
      '2026-07-04',
      availability,
      mockAddOns,
      [],
    );
    expect(breakdown.nights).toBe(3);
    expect(breakdown.nightlyTotal).toBe(room.basePricePerNight * 3);
    expect(breakdown.addOnTotal).toBe(0);
    expect(breakdown.total).toBeGreaterThan(breakdown.nightlyTotal);
  });

  it('includes add-on pricing', () => {
    const { addOnTotal, lines } = calculateAddOnTotal(mockAddOns, ['addon-breakfast'], 3);
    expect(addOnTotal).toBe(54); // 18 * 3 nights
    expect(lines.length).toBe(1);
  });

  it('calculates one-time add-ons', () => {
    const { addOnTotal } = calculateAddOnTotal(mockAddOns, ['addon-transport'], 3);
    expect(addOnTotal).toBe(85);
  });
});
