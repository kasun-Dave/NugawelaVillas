import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Destination } from '@/types';
import type { RouteProfile } from '@/types/routing';
import { cn } from '@/utils/cn';
import { formatDistanceKm } from '@/utils/geo';
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  NUGAWELA_CENTRAL_COLLEGE,
} from '@/config/maps';
import 'leaflet/dist/leaflet.css';

interface OpenStreetMapDestinationsMapProps {
  destinations?: Destination[];
  highlightedId?: string;
  showCenter?: boolean;
  className?: string;
  onPinClick?: (dest: Destination) => void;
  /** Road-following route geometry [lat, lng] from OSRM */
  routeGeometry?: [number, number][] | null;
  routeProfile?: RouteProfile;
}

function makePinIcon(color: string, size = 14) {
  return L.divIcon({
    className: 'nugawela-map-pin',
    html: `<span style="
      display:block;width:${size}px;height:${size}px;
      background:${color};border:2px solid #F7F3ED;
      border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const centerIcon = L.divIcon({
  className: 'nugawela-map-pin',
  html: `<span style="
    display:flex;align-items:center;justify-content:center;
    width:32px;height:32px;background:#1B2F27;color:#C4A265;
    border:3px solid #C4A265;border-radius:50%;
    font-size:10px;font-weight:800;box-shadow:0 2px 8px rgba(0,0,0,.4);
  ">NCC</span>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const ROUTE_STYLES: Record<RouteProfile, L.PolylineOptions> = {
  driving: { color: '#1B2F27', weight: 5, opacity: 0.9, lineCap: 'round', lineJoin: 'round' },
  foot: { color: '#B85C38', weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round' },
};

export function OpenStreetMapDestinationsMap({
  destinations = [],
  highlightedId,
  showCenter = true,
  className,
  onPinClick,
  routeGeometry,
  routeProfile = 'driving',
}: OpenStreetMapDestinationsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  const markerByIdRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView(MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
      routeRef.current = null;
      markerByIdRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!map || !group) return;

    group.clearLayers();
    markerByIdRef.current.clear();

    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    if (showCenter) {
      const centerMarker = L.marker(MAP_DEFAULT_CENTER, { icon: centerIcon, zIndexOffset: 1000 })
        .bindPopup(
          `<strong>${NUGAWELA_CENTRAL_COLLEGE.name}</strong><br/>Start · Werallagama, Kandy`,
        );
      group.addLayer(centerMarker);
    }

    destinations.forEach((dest) => {
      if (!dest.coordinates?.lat || !dest.coordinates?.lng) return;

      const isHighlighted = dest.id === highlightedId;
      const position: L.LatLngExpression = [dest.coordinates.lat, dest.coordinates.lng];
      const marker = L.marker(position, {
        icon: makePinIcon(isHighlighted ? '#B85C38' : '#C4A265', isHighlighted ? 18 : 10),
        zIndexOffset: isHighlighted ? 500 : 0,
      }).bindPopup(
        `<strong>${dest.name}</strong><br/>${formatDistanceKm(dest.distanceKm)} from NCC · ${dest.difficulty}`,
      );

      if (onPinClick) {
        marker.on('click', () => onPinClick(dest));
      }

      group.addLayer(marker);
      markerByIdRef.current.set(dest.id, marker);
    });

    const selected = highlightedId
      ? destinations.find((d) => d.id === highlightedId)
      : undefined;
    const marker = highlightedId ? markerByIdRef.current.get(highlightedId) : undefined;

    if (routeGeometry && routeGeometry.length >= 2) {
      routeRef.current = L.polyline(routeGeometry, ROUTE_STYLES[routeProfile]).addTo(map);

      const routeBounds = L.latLngBounds(routeGeometry);
      map.fitBounds(routeBounds.pad(0.12), { maxZoom: 15, animate: true });

      if (marker) {
        window.setTimeout(() => marker.openPopup(), 500);
      }
    } else if (selected?.coordinates) {
      const destLatLng: L.LatLngExpression = [selected.coordinates.lat, selected.coordinates.lng];
      map.flyTo(destLatLng, 15, { duration: 0.7 });
      if (marker) {
        window.setTimeout(() => marker.openPopup(), 400);
      }
    } else if (!highlightedId) {
      map.setView(MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM);
    }

    requestAnimationFrame(() => map.invalidateSize());
  }, [
    destinations,
    highlightedId,
    showCenter,
    onPinClick,
    routeGeometry,
    routeProfile,
  ]);

  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl border border-mist-200', className)}
      aria-label="Map of attractions around Nugawela Central College"
    >
      <span
        className="pointer-events-none absolute left-2 top-2 z-[500] rounded-full bg-forest px-2.5 py-1 text-[10px] font-semibold text-ivory shadow-sm"
      >
        Hub · Nugawela Central College
      </span>
      {routeGeometry && routeGeometry.length > 1 ? (
        <span
          className="pointer-events-none absolute right-2 top-2 z-[500] rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-semibold text-ivory shadow-sm"
        >
          {routeProfile === 'driving' ? 'Driving route' : 'Walking route'}
        </span>
      ) : null}
      <span
        className="pointer-events-none absolute bottom-2 right-2 z-[500] rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-charcoal-500 shadow-sm"
      >
        {destinations.length} attractions · OSM routing
      </span>
      <div ref={containerRef} className="h-full min-h-[12rem] w-full z-0" />
    </div>
  );
}
