export function useCalendarDateSelection(
  onDatesChange: (checkIn: string, checkOut: string) => void,
) {
  return (dateStr: string, currentCheckIn?: string, currentCheckOut?: string) => {
    if (!currentCheckIn || (currentCheckIn && currentCheckOut)) {
      onDatesChange(dateStr, '');
    } else if (dateStr <= currentCheckIn) {
      onDatesChange(dateStr, '');
    } else {
      onDatesChange(currentCheckIn, dateStr);
    }
  };
}
