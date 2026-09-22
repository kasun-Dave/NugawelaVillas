import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { BOOKING_STEPS, type BookingStep } from '@/stores/bookingStore';
import { Check } from 'lucide-react';

interface BookingStepperProps {
  currentStep: BookingStep;
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const currentIndex = BOOKING_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol className="flex items-center gap-1 overflow-x-auto pb-2 sm:gap-2">
        {BOOKING_STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.key === currentStep;
          const isFuture = index > currentIndex;

          return (
            <li key={step.key} className="flex shrink-0 items-center gap-1 sm:gap-2">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
                  isComplete && 'text-forest',
                  isCurrent && 'bg-forest text-ivory',
                  isFuture && 'text-charcoal-400',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs',
                    isComplete && 'bg-forest text-ivory',
                    isCurrent && 'bg-ivory text-forest',
                    isFuture && 'bg-mist text-charcoal-400',
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {index < BOOKING_STEPS.length - 1 ? (
                <span className="hidden text-charcoal-300 sm:inline" aria-hidden="true">
                  —
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface BookingSummarySidebarProps {
  roomName?: string;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  totalPrice?: number;
  currency?: string;
  editLink?: string;
}

export function BookingSummarySidebar({
  roomName,
  checkIn,
  checkOut,
  guestCount,
  totalPrice,
  currency = 'USD',
  editLink,
}: BookingSummarySidebarProps) {
  if (!checkIn && !roomName) return null;

  return (
    <div className="rounded-2xl border border-mist-200 bg-mist/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-charcoal">Your Stay</h3>
        {editLink ? (
          <Link to={editLink} className="text-sm text-forest hover:underline">
            Edit
          </Link>
        ) : null}
      </div>
      <dl className="space-y-2 text-sm">
        {roomName ? (
          <div>
            <dt className="text-charcoal-400">Room</dt>
            <dd className="font-medium text-charcoal">{roomName}</dd>
          </div>
        ) : null}
        {checkIn ? (
          <div>
            <dt className="text-charcoal-400">Check-in</dt>
            <dd className="font-medium text-charcoal">{checkIn}</dd>
          </div>
        ) : null}
        {checkOut ? (
          <div>
            <dt className="text-charcoal-400">Check-out</dt>
            <dd className="font-medium text-charcoal">{checkOut}</dd>
          </div>
        ) : null}
        {guestCount ? (
          <div>
            <dt className="text-charcoal-400">Guests</dt>
            <dd className="font-medium text-charcoal">{guestCount}</dd>
          </div>
        ) : null}
        {totalPrice ? (
          <div className="border-t border-mist-200 pt-2">
            <dt className="text-charcoal-400">Estimated total</dt>
            <dd className="font-serif text-xl font-semibold text-forest">
              ${totalPrice.toFixed(2)} {currency}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
