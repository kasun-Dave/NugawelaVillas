import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { useItineraryStore } from '@/stores/itineraryStore';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/toast-utils';

interface SaveToItineraryButtonProps {
  type: 'destination' | 'experience';
  itemId: string;
  name: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
}

export function SaveToItineraryButton({
  type,
  itemId,
  name,
  variant = 'outline',
  size = 'sm',
}: SaveToItineraryButtonProps) {
  const { hasItem, addItem, removeItem, items } = useItineraryStore();
  const saved = hasItem(type, itemId);
  const existingItem = items.find((i) => i.type === type && i.itemId === itemId);

  const handleClick = () => {
    if (saved && existingItem) {
      removeItem(existingItem.id);
      showToast(`Removed "${name}" from itinerary`, 'info');
    } else {
      const added = addItem(type, itemId);
      if (added) {
        showToast(`"${name}" saved to your itinerary`, 'success');
      }
    }
  };

  return (
    <Button variant={saved ? 'primary' : variant} size={size} onClick={handleClick}>
      {saved ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          Saved to Itinerary
        </>
      ) : (
        <>
          <BookmarkPlus className="h-4 w-4" />
          Save to Itinerary
        </>
      )}
    </Button>
  );
}
