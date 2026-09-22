import { create } from 'zustand';
import type { BookingGuest } from '@/types';

export type BookingStep = 'dates' | 'room' | 'addons' | 'guest' | 'payment' | 'confirmation';

export interface BookingDraft {
  checkIn: string;
  checkOut: string;
  guestCount: number;
  roomId: string | null;
  addOnIds: string[];
  guestDetails: Partial<BookingGuest>;
}

const initialDraft: BookingDraft = {
  checkIn: '',
  checkOut: '',
  guestCount: 2,
  roomId: null,
  addOnIds: [],
  guestDetails: {},
};

interface BookingFlowState {
  draft: BookingDraft;
  currentStep: BookingStep;
  completedReference: string | null;
  setDates: (checkIn: string, checkOut: string, guestCount: number) => void;
  setRoom: (roomId: string) => void;
  toggleAddOn: (addOnId: string) => void;
  setGuestDetails: (details: Partial<BookingGuest>) => void;
  setStep: (step: BookingStep) => void;
  setCompletedReference: (ref: string) => void;
  initFromSearchParams: (params: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    roomId?: string;
  }) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingFlowState>((set) => ({
  draft: { ...initialDraft },
  currentStep: 'dates',
  completedReference: null,

  setDates: (checkIn, checkOut, guestCount) =>
    set((s) => ({ draft: { ...s.draft, checkIn, checkOut, guestCount } })),

  setRoom: (roomId) => set((s) => ({ draft: { ...s.draft, roomId } })),

  toggleAddOn: (addOnId) =>
    set((s) => {
      const ids = s.draft.addOnIds;
      const addOnIds = ids.includes(addOnId)
        ? ids.filter((id) => id !== addOnId)
        : [...ids, addOnId];
      return { draft: { ...s.draft, addOnIds } };
    }),

  setGuestDetails: (details) =>
    set((s) => ({ draft: { ...s.draft, guestDetails: { ...s.draft.guestDetails, ...details } } })),

  setStep: (step) => set({ currentStep: step }),

  setCompletedReference: (ref) => set({ completedReference: ref, currentStep: 'confirmation' }),

  initFromSearchParams: (params) =>
    set((s) => ({
      draft: {
        ...s.draft,
        checkIn: params.checkIn ?? s.draft.checkIn,
        checkOut: params.checkOut ?? s.draft.checkOut,
        guestCount: params.guests ? parseInt(params.guests, 10) : s.draft.guestCount,
        roomId: params.roomId ?? s.draft.roomId,
      },
    })),

  reset: () => set({ draft: { ...initialDraft }, currentStep: 'dates', completedReference: null }),
}));

export const BOOKING_STEPS: { key: BookingStep; label: string; path: string }[] = [
  { key: 'dates', label: 'Dates', path: '/booking/dates' },
  { key: 'room', label: 'Room', path: '/booking/room' },
  { key: 'addons', label: 'Add-ons', path: '/booking/add-ons' },
  { key: 'guest', label: 'Guest Details', path: '/booking/guest' },
  { key: 'payment', label: 'Payment', path: '/booking/payment' },
  { key: 'confirmation', label: 'Confirmation', path: '/booking/confirmation' },
];
