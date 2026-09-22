import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, Lock } from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { PriceBreakdownCard } from '@/components/booking/PriceBreakdown';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/toast-utils';

export function PaymentStep() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { draft, setCompletedReference } = useBookingStore();
  const user = useAuthStore((s) => s.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

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

  const { data: roomData } = useQuery({
    queryKey: ['room', draft.roomId],
    queryFn: () => repositories.rooms.getById(draft.roomId!),
    enabled: !!draft.roomId,
  });

  const handlePayment = async () => {
    if (!draft.roomId || !draft.guestDetails.email) {
      showToast('Please complete guest details first.', 'error');
      navigate('/booking/guest');
      return;
    }

    if (!cardNumber || !expiry || !cvc) {
      showToast('Please fill in payment details.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await repositories.bookings.create({
        roomId: draft.roomId,
        checkIn: draft.checkIn,
        checkOut: draft.checkOut,
        guestCount: draft.guestCount,
        addOnIds: draft.addOnIds,
        guestDetails: {
          firstName: draft.guestDetails.firstName!,
          lastName: draft.guestDetails.lastName!,
          email: draft.guestDetails.email!,
          phone: draft.guestDetails.phone!,
          specialRequests: draft.guestDetails.specialRequests,
        },
        userId: user?.id,
      });

      if (result.error) {
        showToast(result.error, 'error');
        return;
      }

      setCompletedReference(result.data.referenceCode);
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      showToast('Booking confirmed!', 'success');
      navigate(`/booking/confirmation/${result.data.referenceCode}`);
    } catch {
      showToast('Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="mb-2 font-serif text-2xl font-semibold text-charcoal">Payment</h2>
      <p className="text-body mb-2">
        This is a mock payment screen — no real charges will be made.
      </p>
      <p className="mb-6 flex items-center gap-1 text-sm text-charcoal-400">
        <Lock className="h-3.5 w-3.5" /> Secure mock payment for demonstration
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-mist-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-forest" />
            <h3 className="font-medium text-charcoal">Card Details</h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Card number"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <Input
                label="CVC"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
            <Input label="Name on card" placeholder="As shown on card" />
          </div>

          <div className="mt-6 rounded-xl bg-mist/50 p-4 text-sm text-charcoal-500">
            <p className="mb-1 font-medium text-charcoal">Cancellation Policy</p>
            <p>
              Free cancellation up to 48 hours before check-in. Cancellations within 48 hours incur
              a 50% charge.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {roomData?.data ? (
            <div className="rounded-2xl border border-mist-200 bg-white p-6">
              <h3 className="mb-2 font-serif text-lg font-semibold">{roomData.data.name}</h3>
              <p className="text-sm text-charcoal-500">
                {draft.checkIn} → {draft.checkOut} · {draft.guestCount} guests
              </p>
            </div>
          ) : null}
          {priceData?.data ? <PriceBreakdownCard breakdown={priceData.data} /> : null}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={() => navigate('/booking/guest')}>
          Back
        </Button>
        <Button variant="primary" size="lg" isLoading={isProcessing} onClick={handlePayment}>
          Confirm & Pay {priceData?.data ? `$${priceData.data.total.toFixed(2)}` : ''}
        </Button>
      </div>
    </div>
  );
}
