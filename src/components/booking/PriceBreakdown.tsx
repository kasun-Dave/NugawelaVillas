import type { PriceBreakdown } from '@/utils/pricing';

interface PriceBreakdownCardProps {
  breakdown: PriceBreakdown;
  compact?: boolean;
}

export function PriceBreakdownCard({ breakdown, compact }: PriceBreakdownCardProps) {
  const displayLines = compact
    ? breakdown.lines.filter((l) => l.type !== 'nightly')
    : breakdown.lines.filter((l) => l.type !== 'total');

  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-6">
      <h3 className="mb-4 font-serif text-lg font-semibold text-charcoal">Price Breakdown</h3>

      {!compact && breakdown.nights > 0 ? (
        <p className="mb-4 text-sm text-charcoal-500">
          {breakdown.nights} night{breakdown.nights !== 1 ? 's' : ''}
        </p>
      ) : null}

      <dl className="space-y-2">
        {displayLines.map((line, i) => (
          <div key={i} className="flex justify-between text-sm">
            <dt className="truncate pr-4 text-charcoal-600">{line.label}</dt>
            <dd className="shrink-0 font-medium text-charcoal">${line.amount.toFixed(2)}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-mist-200 pt-4">
        <span className="font-serif text-lg font-semibold text-charcoal">Total</span>
        <span className="font-serif text-xl font-semibold text-forest">
          ${breakdown.total.toFixed(2)} {breakdown.currency}
        </span>
      </div>
    </div>
  );
}
