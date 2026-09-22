import type { ReactNode } from 'react';
import { Car, Footprints, ExternalLink, Loader2, AlertCircle, List } from 'lucide-react';
import type { RouteDirections, RouteProfile } from '@/types/routing';
import { formatDuration, formatDistanceMeters } from '@/utils/format-duration';
import { buildGoogleMapsDirectionsUrl } from '@/services/routing/osrm';
import { MAP_DEFAULT_CENTER } from '@/config/maps';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface DirectionsPanelProps {
  destinationName: string;
  destinationCoords: { lat: number; lng: number };
  activeProfile: RouteProfile;
  onProfileChange: (profile: RouteProfile) => void;
  drivingRoute?: RouteDirections | null;
  walkingRoute?: RouteDirections | null;
  isLoading?: boolean;
  isError?: boolean;
  className?: string;
}

export function DirectionsPanel({
  destinationName,
  destinationCoords,
  activeProfile,
  onProfileChange,
  drivingRoute,
  walkingRoute,
  isLoading,
  isError,
  className,
}: DirectionsPanelProps) {
  const activeRoute = activeProfile === 'driving' ? drivingRoute : walkingRoute;
  const to = destinationCoords;

  return (
    <div className={cn('rounded-2xl border border-mist-200 bg-white', className)}>
      <div className="border-b border-mist-100 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-forest">Directions</p>
        <p className="mt-1 font-serif text-lg font-semibold text-charcoal line-clamp-2">
          {destinationName}
        </p>
        <p className="mt-0.5 text-xs text-charcoal-500">
          From Nugawela Central College via real roads (OpenStreetMap)
        </p>

        <div className="mt-3 flex gap-2">
          <ProfileTab
            active={activeProfile === 'driving'}
            onClick={() => onProfileChange('driving')}
            icon={<Car className="h-4 w-4" />}
            label="Drive"
            duration={drivingRoute?.durationSeconds}
            loading={isLoading && !drivingRoute}
          />
          <ProfileTab
            active={activeProfile === 'foot'}
            onClick={() => onProfileChange('foot')}
            icon={<Footprints className="h-4 w-4" />}
            label="Walk"
            duration={walkingRoute?.durationSeconds}
            loading={isLoading && !walkingRoute}
          />
        </div>
      </div>

      <div className="p-4">
        {isLoading && !activeRoute ? (
          <div className="flex items-center gap-2 text-sm text-charcoal-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Calculating route…
          </div>
        ) : isError && !activeRoute ? (
          <div className="flex items-start gap-2 text-sm text-terracotta">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            Could not load directions. Try again or open in Google Maps.
          </div>
        ) : activeRoute ? (
          <>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-xs text-charcoal-500">Est. time</p>
                <p className="text-lg font-semibold text-forest">
                  {formatDuration(activeRoute.durationSeconds)}
                </p>
              </div>
              <div>
                <p className="text-xs text-charcoal-500">Route distance</p>
                <p className="text-lg font-semibold text-charcoal">
                  {formatDistanceMeters(activeRoute.distanceMeters)}
                </p>
              </div>
            </div>

            {activeRoute.steps.length > 0 ? (
              <details className="mt-4 group">
                <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-charcoal hover:text-forest">
                  <List className="h-4 w-4" />
                  Turn-by-turn ({activeRoute.steps.length} steps)
                </summary>
                <ol className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1 text-sm">
                  {activeRoute.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 border-l-2 border-mist-200 pl-3">
                      <span className="shrink-0 text-xs text-charcoal-400 w-5">{i + 1}.</span>
                      <div>
                        <p className="text-charcoal">{step.instruction}</p>
                        <p className="text-xs text-charcoal-500">
                          {formatDistanceMeters(step.distanceMeters)} ·{' '}
                          {formatDuration(step.durationSeconds)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-charcoal-500">No route found for this destination.</p>
        )}

        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full"
          asChild
        >
          <a
            href={buildGoogleMapsDirectionsUrl(MAP_DEFAULT_CENTER, to, activeProfile)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Maps
          </a>
        </Button>
      </div>
    </div>
  );
}

function ProfileTab({
  active,
  onClick,
  icon,
  label,
  duration,
  loading,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  duration?: number;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-forest bg-forest text-ivory'
          : 'border-mist-200 bg-ivory text-charcoal hover:border-forest/40',
      )}
    >
      {icon}
      <span>{label}</span>
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : duration ? (
        <span className={cn('text-xs', active ? 'text-ivory/80' : 'text-charcoal-500')}>
          {formatDuration(duration)}
        </span>
      ) : null}
    </button>
  );
}
