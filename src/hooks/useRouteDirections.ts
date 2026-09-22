import { useQuery } from '@tanstack/react-query';
import { MAP_DEFAULT_CENTER } from '@/config/maps';
import { fetchOsrmRoute } from '@/services/routing/osrm';
import type { LatLng, RouteProfile } from '@/types/routing';

export function useRouteDirections(to: LatLng | null | undefined, profile: RouteProfile) {
  const from = MAP_DEFAULT_CENTER;

  return useQuery({
    queryKey: ['route', profile, to?.lat, to?.lng],
    queryFn: () => fetchOsrmRoute(from, to!, profile),
    enabled: Boolean(to?.lat && to?.lng),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useRouteComparison(to: LatLng | null | undefined) {
  const driving = useRouteDirections(to, 'driving');
  const walking = useRouteDirections(to, 'foot');

  return {
    driving,
    walking,
    isLoading: driving.isLoading || walking.isLoading,
    isError: driving.isError || walking.isError,
  };
}
