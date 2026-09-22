import type { AdventureStage, AdventureProgress } from '@/types/adventure';
import { getStageStatus } from '@/utils/adventure-unlock';

interface AdventureProgressMapProps {
  stages: AdventureStage[];
  progress: AdventureProgress | null;
  chapters: { id: string; title: string; order: number }[];
  onStageClick?: (stageId: string) => void;
}

function stageCoords(stage: AdventureStage) {
  return { x: stage.mapZone.x * 4, y: stage.mapZone.y * 3 };
}

export function AdventureProgressMap({
  stages,
  progress,
  chapters,
  onStageClick,
}: AdventureProgressMapProps) {
  const sorted = [...stages].sort((a, b) => a.order - b.order);
  const trailStages = sorted.filter((s) => {
    const status = getStageStatus(s, progress);
    return status === 'completed' || status === 'available';
  });

  const trailPoints = trailStages.map((s) => stageCoords(s));
  const trailPath =
    trailPoints.length > 1
      ? trailPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
      : '';

  const lastStage = sorted[sorted.length - 1];
  const treasure = lastStage ? stageCoords(lastStage) : { x: 260, y: 78 };

  return (
    <div className="adventure-map-frame relative overflow-hidden rounded-2xl p-4 sm:p-5">
      <svg
        viewBox="0 0 400 300"
        className="relative z-[1] h-72 w-full sm:h-80"
        aria-label="Adventure progress treasure map"
      >
        {/* Parchment base */}
        <rect width="400" height="300" fill="#f0e0c0" rx="8" />
        <rect width="400" height="300" fill="url(#parchmentGrain)" rx="8" />

        <defs>
          <pattern id="parchmentGrain" patternUnits="userSpaceOnUse" width="8" height="8">
            <rect width="8" height="8" fill="#f0e0c0" />
            <circle cx="2" cy="3" r="0.6" fill="rgba(120,85,45,0.06)" />
            <circle cx="6" cy="7" r="0.5" fill="rgba(120,85,45,0.05)" />
          </pattern>
        </defs>

        {/* Hand-drawn landmass */}
        <path
          d="M30,240 Q90,200 160,215 Q230,225 290,200 Q350,185 370,220 L370,300 L30,300 Z"
          fill="#d4b88a"
          stroke="#5c3a21"
          strokeWidth="1.8"
          opacity="0.85"
        />
        <path
          d="M50,90 Q110,50 200,65 Q290,55 340,85 Q370,110 380,140"
          fill="none"
          stroke="#5c3a21"
          strokeWidth="1.3"
          opacity="0.5"
        />
        {/* Hills */}
        <path
          d="M80,180 Q100,160 120,180 Q140,200 160,180"
          fill="none"
          stroke="#5c3a21"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M240,120 Q270,95 300,115 Q320,130 340,115"
          fill="none"
          stroke="#5c3a21"
          strokeWidth="1"
          opacity="0.4"
        />
        {/* Palm trees (simple) */}
        <g opacity="0.45" fill="#5c3a21">
          <path d="M70,200 l0,-12 l-4,6 l4,-2 l4,2 l-4,-6" />
          <path d="M310,210 l0,-10 l-3,5 l3,-2 l3,2 l-3,-5" />
        </g>

        {/* Compass rose */}
        <g transform="translate(335, 50)" opacity="0.75">
          <circle r="24" fill="none" stroke="#5c3a21" strokeWidth="1.2" />
          <circle r="18" fill="none" stroke="#5c3a21" strokeWidth="0.6" opacity="0.5" />
          <line x1="0" y1="-20" x2="0" y2="20" stroke="#5c3a21" strokeWidth="1" />
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#5c3a21" strokeWidth="1" />
          <polygon points="0,-16 -3,0 3,0" fill="#5c3a21" />
          <text y="34" textAnchor="middle" fill="#5c3a21" fontSize="8" fontFamily="Georgia, serif">
            N
          </text>
        </g>

        {/* Ship sketch */}
        <g
          transform="translate(45, 230)"
          opacity="0.5"
          stroke="#5c3a21"
          strokeWidth="1"
          fill="none"
        >
          <path d="M0,0 L20,0 L15,-8 L5,-8 Z" />
          <line x1="10" y1="-8" x2="10" y2="-16" />
          <path d="M10,-16 L18,-12 L10,-8" fill="#5c3a21" opacity="0.3" />
        </g>

        {/* Dashed treasure trail */}
        {trailPath ? (
          <path
            d={trailPath}
            fill="none"
            stroke="#b83232"
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
            opacity="0.95"
          />
        ) : null}

        <text
          x="200"
          y="138"
          textAnchor="middle"
          fill="#5c3a21"
          fontSize="10"
          fontFamily="Georgia, serif"
          fontStyle="italic"
        >
          Nugawela Valley
        </text>

        {sorted.map((stage) => {
          const status = getStageStatus(stage, progress);
          const { x, y } = stageCoords(stage);
          const isTreasure = stage.id === lastStage?.id;
          const interactive = onStageClick && status !== 'locked';

          if (isTreasure && status === 'completed') {
            return (
              <g key={stage.id}>
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  fill="#b83232"
                  fontSize="18"
                  fontWeight="bold"
                >
                  ✕
                </text>
                <text
                  x={x}
                  y={y + 20}
                  textAnchor="middle"
                  fill="#5c3a21"
                  fontSize="8"
                  fontFamily="Georgia, serif"
                >
                  Treasure
                </text>
              </g>
            );
          }

          const fill =
            status === 'completed' ? '#8b6914' : status === 'available' ? '#b83232' : '#a89888';

          return (
            <g
              key={stage.id}
              className={interactive ? 'cursor-pointer' : ''}
              onClick={() => interactive && onStageClick?.(stage.id)}
              role={interactive ? 'button' : undefined}
              aria-label={`${stage.title} - ${status}`}
            >
              <circle
                cx={x}
                cy={y}
                r={status === 'available' ? 10 : 7}
                fill={fill}
                stroke="#3d2914"
                strokeWidth="1.2"
                opacity={status === 'locked' ? 0.5 : 1}
              />
              {status === 'completed' ? (
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  fill="#f5e8c8"
                  fontSize="8"
                  fontWeight="bold"
                >
                  ✓
                </text>
              ) : null}
              {status === 'available' ? (
                <text
                  x={x}
                  y={y + 20}
                  textAnchor="middle"
                  fill="#5c3a21"
                  fontSize="7"
                  fontFamily="Georgia, serif"
                >
                  {stage.order}
                </text>
              ) : null}
            </g>
          );
        })}

        {lastStage && !progress?.completedStageIds.includes(lastStage.id) ? (
          <g opacity="0.6">
            <text
              x={treasure.x}
              y={treasure.y - 10}
              textAnchor="middle"
              fill="#b83232"
              fontSize="15"
              fontWeight="bold"
            >
              ✕
            </text>
            <text
              x={treasure.x}
              y={treasure.y + 18}
              textAnchor="middle"
              fill="#5c3a21"
              fontSize="7"
              fontFamily="Georgia, serif"
            >
              Treasure
            </text>
          </g>
        ) : null}
      </svg>

      <div className="relative z-[1] mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {chapters.map((ch) => {
          const chapterStages = stages.filter((s) => s.chapterId === ch.id);
          const done = chapterStages.filter((s) =>
            progress?.completedStageIds.includes(s.id),
          ).length;
          return (
            <div key={ch.id} className="adventure-text text-xs">
              <span className="adventure-heading font-medium">{ch.title}</span>
              <span className="ml-1">
                {done}/{chapterStages.length}
              </span>
            </div>
          );
        })}
      </div>

      <div className="adventure-subheading relative z-[1] mt-3 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#b83232]" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#8b6914]" /> Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#a89888]" /> Locked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-5 border-t-2 border-dashed border-[#b83232]" /> Your trail
        </span>
      </div>
    </div>
  );
}
