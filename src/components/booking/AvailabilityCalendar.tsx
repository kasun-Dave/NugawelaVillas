import { cn } from '@/utils/cn';
import { formatDate, getMonthDays, todayString } from '@/utils/date';

interface AvailabilityCalendarProps {
  unavailableDates: string[];
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  onSelectDate: (date: string) => void;
  month: number;
  year: number;
  onMonthChange: (month: number, year: number) => void;
}

export function AvailabilityCalendar({
  unavailableDates,
  selectedCheckIn,
  selectedCheckOut,
  onSelectDate,
  month,
  year,
  onMonthChange,
}: AvailabilityCalendarProps) {
  const today = todayString();
  const days = getMonthDays(year, month);
  const firstDayOfWeek = days[0].getDay();
  const monthLabel = days[0].toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (month === 0) onMonthChange(11, year - 1);
    else onMonthChange(month - 1, year);
  };

  const nextMonth = () => {
    if (month === 11) onMonthChange(0, year + 1);
    else onMonthChange(month + 1, year);
  };

  const isInRange = (dateStr: string) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return dateStr > selectedCheckIn && dateStr < selectedCheckOut;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg px-3 py-1.5 text-sm text-charcoal transition-colors hover:bg-mist"
          aria-label="Previous month"
        >
          ←
        </button>
        <h3 className="font-serif text-lg font-semibold text-charcoal">{monthLabel}</h3>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg px-3 py-1.5 text-sm text-charcoal transition-colors hover:bg-mist"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-medium text-charcoal-400">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Availability calendar">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dateStr = formatDate(day);
          const isPast = dateStr < today;
          const isUnavailable = unavailableDates.includes(dateStr);
          const isDisabled = isPast || isUnavailable;
          const isCheckIn = dateStr === selectedCheckIn;
          const isCheckOut = dateStr === selectedCheckOut;
          const inRange = isInRange(dateStr);

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                'h-9 w-full rounded-lg text-sm font-medium transition-colors',
                isDisabled && 'cursor-not-allowed text-charcoal-300',
                !isDisabled && 'text-charcoal hover:bg-forest-50',
                inRange && 'bg-forest-50',
                isCheckIn && 'bg-forest text-ivory hover:bg-forest-600',
                isCheckOut && 'bg-forest text-ivory hover:bg-forest-600',
                isUnavailable && !isPast && 'bg-terracotta/10 text-terracotta line-through',
              )}
              aria-label={`${dateStr}${isUnavailable ? ' unavailable' : ''}${isCheckIn ? ' check-in' : ''}${isCheckOut ? ' check-out' : ''}`}
              aria-selected={isCheckIn || isCheckOut}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-charcoal-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-forest" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-terracotta/20" /> Unavailable
        </span>
      </div>
    </div>
  );
}
