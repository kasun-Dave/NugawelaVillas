export type RouteProfile = 'driving' | 'foot';

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
}

export interface RouteDirections {
  profile: RouteProfile;
  distanceMeters: number;
  durationSeconds: number;
  /** Leaflet-ready [lat, lng] pairs along roads/trails */
  geometry: [number, number][];
  steps: RouteStep[];
}

export interface LatLng {
  lat: number;
  lng: number;
}
