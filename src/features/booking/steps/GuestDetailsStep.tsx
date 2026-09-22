import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookingStore } from '@/stores/bookingStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(8, 'Phone number is required'),
  specialRequests: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function GuestDetailsStep() {
  const navigate = useNavigate();
  const { draft, setGuestDetails } = useBookingStore();

  useEffect(() => {
    if (!draft.roomId) navigate('/booking/room');
  }, [draft.roomId, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: draft.guestDetails.firstName ?? '',
      lastName: draft.guestDetails.lastName ?? '',
      email: draft.guestDetails.email ?? '',
      phone: draft.guestDetails.phone ?? '',
      specialRequests: draft.guestDetails.specialRequests ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    setGuestDetails(data);
    navigate('/booking/payment');
  };

  return (
    <div>
      <h2 className="mb-2 font-serif text-2xl font-semibold text-charcoal">Guest details</h2>
      <p className="text-body mb-6">Who will be staying with us?</p>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone" type="tel" error={errors.phone?.message} {...register('phone')} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">
            Special requests (optional)
          </label>
          <textarea
            className="min-h-[100px] w-full rounded-xl border border-mist-200 px-4 py-2.5 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            placeholder="Early check-in, dietary needs, accessibility requirements..."
            {...register('specialRequests')}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => navigate('/booking/add-ons')}>
            Back
          </Button>
          <Button type="submit" variant="primary">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
}
