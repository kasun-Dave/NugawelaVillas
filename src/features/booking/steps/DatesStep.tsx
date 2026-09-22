import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookingStore } from '@/stores/bookingStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isValidDateRange } from '@/utils/date';

const schema = z
  .object({
    checkIn: z.string().min(1, 'Check-in date is required'),
    checkOut: z.string().min(1, 'Check-out date is required'),
    guestCount: z.coerce.number().min(1).max(6),
  })
  .refine((d) => isValidDateRange(d.checkIn, d.checkOut), {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  });

type FormData = z.infer<typeof schema>;

export function DatesStep() {
  const navigate = useNavigate();
  const { draft, setDates } = useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      checkIn: draft.checkIn,
      checkOut: draft.checkOut,
      guestCount: draft.guestCount,
    },
  });

  const onSubmit = (data: FormData) => {
    setDates(data.checkIn, data.checkOut, data.guestCount);
    navigate('/booking/room');
  };

  return (
    <div>
      <h2 className="mb-2 font-serif text-2xl font-semibold text-charcoal">Select your dates</h2>
      <p className="text-body mb-6">Choose check-in and check-out dates for your stay.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <Input
          label="Check-in"
          type="date"
          error={errors.checkIn?.message}
          {...register('checkIn')}
        />
        <Input
          label="Check-out"
          type="date"
          error={errors.checkOut?.message}
          {...register('checkOut')}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Guests</label>
          <select
            className="w-full rounded-xl border border-mist-200 px-4 py-2.5 text-sm"
            {...register('guestCount')}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
          Continue to Room Selection
        </Button>
      </form>
    </div>
  );
}
