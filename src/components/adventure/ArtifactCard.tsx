import type { Artifact } from '@/types/adventure';
import { cn } from '@/utils/cn';

interface ArtifactCardProps {
  artifact: Artifact;
  collected?: boolean;
  compact?: boolean;
}

export function ArtifactCard({ artifact, collected = true, compact }: ArtifactCardProps) {
  return (
    <div
      className={cn(
        'adventure-artifact-card rounded-xl p-4 transition-all',
        !collected && 'adventure-artifact-card--locked',
        collected && 'border-[#8b6914]/40',
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg',
            collected ? 'bg-[#5c3a21] text-[#f5e8c8]' : 'bg-[#a89888] text-[#f5e8c8]',
          )}
        >
          {collected ? '✦' : '?'}
        </div>
        <div>
          <h4 className={cn('adventure-heading font-medium', compact && 'text-sm')}>
            {artifact.name}
          </h4>
          {!compact ? (
            <>
              <p className="adventure-text mt-1 text-sm">{artifact.description}</p>
              <p className="adventure-subheading mt-2 text-xs italic opacity-80">
                {artifact.flavorText}
              </p>
            </>
          ) : (
            <p className="adventure-text mt-0.5 text-xs opacity-90">{artifact.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
