import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { imageGradients } from '@/config/images';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  gradient?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  gradient = imageGradients.forest,
}: ImageWithFallbackProps) {
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ background: gradient }}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-opacity duration-300"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.opacity = '0';
        }}
      />
    </div>
  );
}

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  className?: string;
  light?: boolean;
}

export function SectionHeading({ title, subtitle, action, className, light }: SectionHeadingProps) {
  return (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div>
        <h2 className={cn('heading-section', light ? 'text-ivory' : 'text-charcoal')}>{title}</h2>
        {subtitle ? (
          <p className={cn('text-body mt-2 max-w-2xl', light ? 'text-ivory/80' : '')}>{subtitle}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          to={action.href}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors',
            light
              ? 'bg-ivory/10 text-ivory hover:bg-ivory/20'
              : 'bg-forest text-ivory hover:bg-forest-600',
          )}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

interface WaveDividerProps {
  color?: string;
  flip?: boolean;
}

export function WaveDivider({ color = '#F7F3ED', flip = false }: WaveDividerProps) {
  return (
    <div className={cn('relative h-12 w-full', flip && 'rotate-180')} aria-hidden="true">
      <svg
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="absolute bottom-0 h-full w-full"
      >
        <path
          d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,12 1440,24 L1440,48 L0,48 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

interface QuickLinkIconProps {
  icon: ReactNode;
  label: string;
  href: string;
}

export function QuickLinkIcon({ icon, label, href }: QuickLinkIconProps) {
  return (
    <Link
      to={href}
      className="group flex flex-col items-center gap-3 text-center transition-transform hover:-translate-y-1"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-mist-200 bg-white shadow-md transition-shadow group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-forest">
        <span className="text-forest">{icon}</span>
      </div>
      <span className="text-sm font-medium text-charcoal transition-colors group-hover:text-forest">
        {label}
      </span>
    </Link>
  );
}
