import type { LatLng, RouteDirections, RouteProfile, RouteStep } from '@/types/routing';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1';

interface OsrmManeuver {
  type: string;
  modifier?: string;
}

interface OsrmStep {
  distance: number;
  duration: number;
  name: string;
  maneuver: OsrmManeuver;
}

interface OsrmRouteResponse {
  code: string;
  routes?: Array<{
    distance: number;
    duration: number;
    geometry: { type: string; coordinates: [number, number][] };
    legs: OsrmLeg[];
  }>;
}

function maneuverInstruction(maneuver: OsrmManeuver, roadName: string): string {
  const road = roadName ? ` onto ${roadName}` : '';
  const mod = maneuver.modifier?.replace(/ /g, ' ') ?? '';

  switch (maneuver.type) {
    case 'depart':
      return mod ? `Head ${mod}${road}` : `Start${road}`;
    case 'arrive':
      return 'Arrive at destination';
    case 'turn':
      return `Turn ${mod}${road}`;
    case 'new name':
      return `Continue${road}`;
    case 'merge':
      return `Merge ${mod}${road}`;
    case 'fork':
      return `Take the ${mod} fork${road}`;
    case 'roundabout':
      return `Take the roundabout${road}`;
    case 'rotary':
      return `Enter the rotary${road}`;
    case 'end of road':
      return `At road end, turn ${mod}${road}`;
    default:
      return `Continue${road}`;
  }
}

interface OsrmLeg {
  steps: OsrmStep[];
}

function parseSteps(legs: OsrmLeg[]): RouteStep[] {
  const steps: RouteStep[] = [];
  for (const leg of legs) {
    for (const step of leg.steps) {
      steps.push({
        instruction: maneuverInstruction(step.maneuver, step.name),
        distanceMeters: step.distance,
        durationSeconds: step.duration,
      });
    }
  }
  return steps;
}

export async function fetchOsrmRoute(
  from: LatLng,
  to: LatLng,
  profile: RouteProfile,
): Promise<RouteDirections | null> {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const params = new URLSearchParams({
    overview: 'full',
    geometries: 'geojson',
    steps: 'true',
  });

  const url = `${OSRM_BASE}/${profile}/${coords}?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Routing failed (${response.status})`);
  }

  const data = (await response.json()) as OsrmRouteResponse;
  if (data.code !== 'Ok' || !data.routes?.length) {
    return null;
  }

  const route = data.routes[0];
  const geometry: [number, number][] = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

  return {
    profile,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
    geometry,
    steps: parseSteps(route.legs),
  };
}

export function buildGoogleMapsDirectionsUrl(
  from: LatLng,
  to: LatLng,
  profile: RouteProfile,
): string {
  const travelmode = profile === 'foot' ? 'walking' : 'driving';
  const params = new URLSearchParams({
    api: '1',
    origin: `${from.lat},${from.lng}`,
    destination: `${to.lat},${to.lng}`,
    travelmode,
  });
  return `https://www.google.com/maps/dir/?${params}`;
}

export function buildOsrmDeepLink(from: LatLng, to: LatLng, profile: RouteProfile): string {
  return `https://map.project-osrm.org/?z=14&center=${from.lat},${from.lng}&loc=${from.lat},${from.lng}&loc=${to.lat},${to.lng}&hl=en&alt=0&srv=0&profile=${profile}`;
}
