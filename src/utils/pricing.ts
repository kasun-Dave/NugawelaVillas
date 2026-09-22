import type { AddOn, Room, RoomAvailability } from '@/types';
import { eachNight } from './date';

export interface PriceBreakdownLine {
  label: string;
  amount: number;
  type: 'nightly' | 'addon' | 'tax' | 'total';
}

export interface PriceBreakdown {
  nights: number;
  nightlyTotal: number;
  addOnTotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  lines: PriceBreakdownLine[];
}

const TAX_RATE = 0.12;

export function getNightlyRate(room: Room, date: string, availability: RoomAvailability[]): number {
  const entry = availability.find((a) => a.roomId === room.id && a.date === date);
  if (entry?.priceOverride) return entry.priceOverride;
  return room.basePricePerNight;
}

export function calculateRoomTotal(
  room: Room,
  checkIn: string,
  checkOut: string,
  availability: RoomAvailability[],
): { nightlyTotal: number; nights: number; nightlyBreakdown: PriceBreakdownLine[] } {
  const nights = eachNight(checkIn, checkOut);
  const nightlyBreakdown: PriceBreakdownLine[] = nights.map((date) => {
    const rate = getNightlyRate(room, date, availability);
    return {
      label: `${date} — ${room.name}`,
      amount: rate,
      type: 'nightly' as const,
    };
  });
  const nightlyTotal = nightlyBreakdown.reduce((sum, l) => sum + l.amount, 0);
  return { nightlyTotal, nights: nights.length, nightlyBreakdown };
}

export function calculateAddOnTotal(
  addOns: AddOn[],
  selectedIds: string[],
  nights: number,
): { addOnTotal: number; lines: PriceBreakdownLine[] } {
  const lines: PriceBreakdownLine[] = [];
  let addOnTotal = 0;

  for (const id of selectedIds) {
    const addon = addOns.find((a) => a.id === id);
    if (!addon) continue;
    const amount = addon.perNight ? addon.price * nights : addon.price;
    lines.push({ label: addon.name, amount, type: 'addon' });
    addOnTotal += amount;
  }

  return { addOnTotal, lines };
}

export function calculatePriceBreakdown(
  room: Room,
  checkIn: string,
  checkOut: string,
  availability: RoomAvailability[],
  addOns: AddOn[],
  selectedAddOnIds: string[],
): PriceBreakdown {
  const { nightlyTotal, nights, nightlyBreakdown } = calculateRoomTotal(
    room,
    checkIn,
    checkOut,
    availability,
  );
  const { addOnTotal, lines: addOnLines } = calculateAddOnTotal(addOns, selectedAddOnIds, nights);
  const subtotal = nightlyTotal + addOnTotal;
  const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + taxAmount) * 100) / 100;

  const lines: PriceBreakdownLine[] = [
    ...nightlyBreakdown,
    ...addOnLines,
    { label: 'Taxes & fees (12%)', amount: taxAmount, type: 'tax' },
    { label: 'Total', amount: total, type: 'total' },
  ];

  return {
    nights,
    nightlyTotal,
    addOnTotal,
    taxAmount,
    total,
    currency: room.currency,
    lines,
  };
}
