import { describe, it, expect } from 'vitest';
import { optimizeItinerary } from '@/utils/itinerary';
import {
  generateNugawelaAttractions,
  getDestinationById,
  mockDestinations,
} from '@/services/mock-data/destinations';
import { mockExperiences } from '@/services/mock-data/experiences';
import type { ItineraryItem } from '@/types';

describe('itinerary optimizer', () => {
  const closest = mockDestinations[0];
  const valleySample = generateNugawelaAttractions(2000);
  const challenging =
    valleySample.find((d) => d.difficulty === 'challenging') ??
    getDestinationById('gem-nugawela-1800')!;

  const items: ItineraryItem[] = [
    {
      id: '1',
      type: 'destination',
      itemId: closest.id,
      addedAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'experience',
      itemId: 'exp-tea-tasting',
      addedAt: new Date().toISOString(),
    },
  ];

  it('creates a timed plan', () => {
    const plan = optimizeItinerary(items, mockDestinations, mockExperiences);
    expect(plan.items.length).toBe(2);
    expect(plan.totalDurationMinutes).toBeGreaterThan(0);
    expect(plan.items[0].startTime).toBeDefined();
    expect(plan.items[0].endTime).toBeDefined();
  });

  it('orders by distance from resort', () => {
    const plan = optimizeItinerary(items, mockDestinations, mockExperiences);
    expect(plan.items[0].name).toBe(closest.name);
  });

  it('warns about challenging destinations', () => {
    const challengingItems: ItineraryItem[] = [
      {
        id: '3',
        type: 'destination',
        itemId: challenging.id,
        addedAt: new Date().toISOString(),
      },
    ];
    const plan = optimizeItinerary(challengingItems, valleySample, mockExperiences, '16:00');
    expect(plan.warnings.length).toBeGreaterThan(0);
  });
});
