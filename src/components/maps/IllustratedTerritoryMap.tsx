import type { Destination } from '@/types';
import { cn } from '@/utils/cn';

interface IllustratedTerritoryMapProps {
  destinations?: Destination[];
  highlightedId?: string;
  showResort?: boolean;
  className?: string;
  onPinClick?: (dest: Destination) => void;
}

export function IllustratedTerritoryMap({
  destinations = [],
  highlightedId,
  showResort = true,
  className,
  onPinClick,
}: IllustratedTerritoryMapProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-2xl bg-forest-700', className)}
      role="img"
      aria-label="Illustrated map of the Nugawela valley territory"
    >
      <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B2F27" />
            <stop offset="100%" stopColor="#2D4A3E" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="400" height="300" fill="url(#mapBg)" />

        {/* Terrain contours */}
        <path d="M0,200 Q100,150 200,180 T400,160 L400,300 L0,300 Z" fill="#243D33" opacity="0.6" />
        <path d="M0,220 Q150,190 300,210 T400,200 L400,300 L0,300 Z" fill="#1B2F27" opacity="0.4" />
        <path d="M50,0 Q200,80 350,40" fill="none" stroke="#3D6B56" strokeWidth="1" opacity="0.3" />
        <path
          d="M0,100 Q200,60 400,90"
          fill="none"
          stroke="#3D6B56"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Forest areas */}
        <circle cx="80" cy="220" r="40" fill="#2D4A3E" opacity="0.5" />
        <circle cx="320" cy="200" r="50" fill="#2D4A3E" opacity="0.4" />

        {/* Trail path */}
        <path
          d="M200,150 Q160,180 120,200 Q100,220 80,240"
          fill="none"
          stroke="#C4A265"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          opacity="0.5"
        />

        {/* Resort marker */}
        {showResort ? (
          <g transform="translate(200, 150)">
            <circle r="12" fill="#C4A265" opacity="0.3" />
            <circle r="6" fill="#C4A265" />
            <circle r="2.5" fill="#F7F3ED" />
            <text y="-18" textAnchor="middle" fill="#F7F3ED" fontSize="9" fontWeight="600">
              Resort
            </text>
          </g>
        ) : null}

        {/* Destination pins */}
        {destinations.map((dest) => {
          const x = dest.coordinates.x * 4;
          const y = dest.coordinates.y * 3;
          const isHighlighted = dest.id === highlightedId;

          return (
            <g
              key={dest.id}
              transform={`translate(${x}, ${y})`}
              className={onPinClick ? 'cursor-pointer' : ''}
              onClick={() => onPinClick?.(dest)}
              role={onPinClick ? 'button' : undefined}
              aria-label={dest.name}
            >
              {isHighlighted ? (
                <circle r="14" fill="#B85C38" opacity="0.3" filter="url(#glow)" />
              ) : null}
              <circle
                r={isHighlighted ? 7 : 5}
                fill={isHighlighted ? '#B85C38' : '#C4A265'}
                stroke="#F7F3ED"
                strokeWidth="1.5"
              />
              {isHighlighted ? (
                <text y="-14" textAnchor="middle" fill="#F7F3ED" fontSize="8" fontWeight="500">
                  {dest.name.split(' ').slice(0, 2).join(' ')}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-3 left-3 flex gap-3 text-xs text-ivory/60">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gold" /> Destination
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-terracotta" /> Selected
        </span>
      </div>
    </div>
  );
}
