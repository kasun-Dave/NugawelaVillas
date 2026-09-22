import type { Destination } from '@/types';
import { generateNugawelaAttractions as generateFromCatalog } from './sri-lanka-place-catalog';

export function generateNugawelaAttractions(count = 108): Destination[] {
  return generateFromCatalog(count);
}

export const mockDestinations: Destination[] = generateNugawelaAttractions(108);
