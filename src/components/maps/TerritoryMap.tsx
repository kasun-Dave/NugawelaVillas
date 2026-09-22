import type { Destination } from '@/types';
import type { RouteProfile } from '@/types/routing';
import { OpenStreetMapDestinationsMap } from './OpenStreetMapDestinationsMap';

interface TerritoryMapProps {
  destinations?: Destination[];
  highlightedId?: string;
  showCenter?: boolean;
  className?: string;
  onPinClick?: (dest: Destination) => void;
  routeGeometry?: [number, number][] | null;
  routeProfile?: RouteProfile;
}

/** OpenStreetMap map with OSRM road routing — no API key required. */
export function TerritoryMap(props: TerritoryMapProps) {
  return <OpenStreetMapDestinationsMap {...props} />;
}
