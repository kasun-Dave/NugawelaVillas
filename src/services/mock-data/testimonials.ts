import { images } from '@/config/images';
import type { Testimonial } from '@/types';

export const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    guestName: 'Elena Marchetti',
    location: 'Milan, Italy',
    quote:
      "We came for the mountains and stayed for the stories. The Hidden Trail turned our anniversary into something we'll never forget — every clue led us deeper into the valley's secrets.",
    rating: 5,
    imageUrl: images.testimonials.guest1,
    stayType: 'Mountain View Suite — 5 nights',
  },
  {
    id: 'testimonial-2',
    guestName: 'James Okonkwo',
    location: 'London, UK',
    quote:
      'The Forest Hideaway Chalet felt like waking inside a painting. Morning mist through the trees, birdsong at dawn, and the campfire evening was pure magic. Nugawela is a world apart.',
    rating: 5,
    imageUrl: images.testimonials.guest2,
    stayType: 'Forest Hideaway Chalet — 3 nights',
  },
  {
    id: 'testimonial-3',
    guestName: 'Priya Sharma',
    location: 'Mumbai, India',
    quote:
      'Our family loved the Heritage Villa and the village walk. The kids adored the scavenger hunt, and we appreciated how thoughtfully every adventure stage was designed for safety.',
    rating: 5,
    imageUrl: images.testimonials.guest3,
    stayType: 'Heritage Family Villa — 7 nights',
  },
];
