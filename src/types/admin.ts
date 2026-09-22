import type { BookingStatus } from '@/types';

export interface AdventureAnalytics {
  activeAdventures: number;
  completedAdventures: number;
  pausedAdventures: number;
  totalGuestsWithProgress: number;
  averageStagesCompleted: number;
  totalStages: number;
  activeCodes: number;
  totalCodes: number;
}

export interface GuestProgressSummary {
  userId: string;
  guestName: string;
  email: string;
  code: string;
  completedStages: number;
  totalStages: number;
  artifactCount: number;
  paused: boolean;
  currentStageId: string | null;
  currentStageTitle: string | null;
  startedAt: string;
  updatedAt: string;
  isComplete: boolean;
}

export interface AdminBookingSummary {
  totalBookings: number;
  confirmedBookings: number;
  upcomingBookings: number;
}

export interface AdminBookingRow {
  id: string;
  referenceCode: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: BookingStatus;
  totalPrice: number;
  currency: string;
  createdAt: string;
}
