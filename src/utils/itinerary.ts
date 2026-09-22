import type { Destination, Experience, ItineraryItem } from '@/types';

export interface ItineraryPlanItem {
  item: ItineraryItem;
  name: string;
  durationMinutes: number;
  distanceKm?: number;
  startTime?: string;
  endTime?: string;
}

export interface OptimizedItinerary {
  items: ItineraryPlanItem[];
  totalDurationMinutes: number;
  totalDistanceKm: number;
  warnings: string[];
}

function parseDurationHours(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) * 60 : 90;
}

export function optimizeItinerary(
  itineraryItems: ItineraryItem[],
  destinations: Destination[],
  experiences: Experience[],
  startTime = '08:00',
): OptimizedItinerary {
  const warnings: string[] = [];
  const planItems: ItineraryPlanItem[] = [];

  let [hours, minutes] = startTime.split(':').map(Number);
  let totalDuration = 0;
  let totalDistance = 0;

  const sorted = [...itineraryItems].sort((a, b) => {
    const getDist = (item: ItineraryItem) => {
      if (item.type === 'destination') {
        return destinations.find((d) => d.id === item.itemId)?.distanceKm ?? 99;
      }
      return 50;
    };
    return getDist(a) - getDist(b);
  });

  for (const item of sorted) {
    let name = '';
    let durationMinutes = 90;
    let distanceKm = 0;

    if (item.type === 'destination') {
      const dest = destinations.find((d) => d.id === item.itemId);
      if (!dest) continue;
      name = dest.name;
      durationMinutes = parseDurationHours(dest.suggestedVisitDuration);
      distanceKm = dest.distanceKm;
      if (dest.difficulty === 'challenging') {
        warnings.push(`${dest.name} is challenging — plan extra time and a guide.`);
      }
    } else {
      const exp = experiences.find((e) => e.id === item.itemId);
      if (!exp) continue;
      name = exp.name;
      durationMinutes = exp.durationMinutes;
    }

    const startH = String(hours).padStart(2, '0');
    const startM = String(minutes).padStart(2, '0');
    const startTimeStr = `${startH}:${startM}`;

    minutes += durationMinutes + 30;
    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    const endH = String(hours).padStart(2, '0');
    const endM = String(minutes).padStart(2, '0');

    if (hours >= 18) {
      warnings.push(`${name} may extend past daylight — consider rescheduling outdoor activities.`);
    }

    planItems.push({
      item,
      name,
      durationMinutes,
      distanceKm,
      startTime: startTimeStr,
      endTime: `${endH}:${endM}`,
    });

    totalDuration += durationMinutes + 30;
    totalDistance += distanceKm;
  }

  return {
    items: planItems,
    totalDurationMinutes: totalDuration,
    totalDistanceKm: totalDistance,
    warnings,
  };
}
