import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import { repositories } from '@/services/repository-registry';
import { PriceBreakdownCard } from '@/components/booking/PriceBreakdown';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export function AddOnsStep() {
  const navigate = useNavigate();
  const { draft, toggleAddOn } = useBookingStore();

  useEffect(() => {
    if (!draft.roomId) navigate('/booking/room');
  }, [draft.roomId, navigate]);

  const { data: addOnsData } = useQuery({
    queryKey: ['addons'],
    queryFn: () => repositories.bookings.getAddOns(),
  });

  const { data: priceData } = useQuery({
    queryKey: ['price', draft.roomId, draft.checkIn, draft.checkOut, draft.addOnIds],
    queryFn: () =>
      repositories.bookings.calculatePrice(
        draft.roomId!,
        draft.checkIn,
        draft.checkOut,
        draft.addOnIds,
      ),
    enabled: !!draft.roomId,
  });

  const addOns = addOnsData?.data ?? [];

  return (
    <div>
      <h2 className="mb-2 font-serif text-2xl font-semibold text-charcoal">Enhance your stay</h2>
      <p className="text-body mb-6">Optional add-ons to make your visit unforgettable.</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {addOns.map((addon) => {
            const selected = draft.addOnIds.includes(addon.id);
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddOn(addon.id)}
                className={cn(
                  'w-full rounded-2xl border p-4 text-left transition-all',
                  selected
                    ? 'border-forest bg-forest-50 ring-2 ring-forest/20'
                    : 'border-mist-200 bg-white hover:border-forest-200',
                )}
                aria-pressed={selected}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded border',
                          selected ? 'border-forest bg-forest text-ivory' : 'border-charcoal-300',
                        )}
                      >
                        {selected ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span className="font-medium text-charcoal">{addon.name}</span>
                    </div>
                    <p className="ml-7 mt-1 text-sm text-charcoal-500">{addon.description}</p>
                    <span className="ml-7 mt-2 text-xs capitalize text-charcoal-400">
                      {addon.category}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-forest">${addon.price}</p>
                    {addon.perNight ? (
                      <p className="text-xs text-charcoal-400">per night</p>
                    ) : (
                      <p className="text-xs text-charcoal-400">one-time</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {priceData?.data ? <PriceBreakdownCard breakdown={priceData.data} /> : null}
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={() => navigate('/booking/room')}>
          Back
        </Button>
        <Button variant="primary" onClick={() => navigate('/booking/guest')}>
          Continue to Guest Details
        </Button>
      </div>
    </div>
  );
}
