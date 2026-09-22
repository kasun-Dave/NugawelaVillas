import type { FAQ } from '@/types';

export const mockFaqs: FAQ[] = [
  {
    id: 'faq-checkin',
    question: 'What are the check-in and check-out times?',
    answer:
      'Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out may be arranged subject to availability.',
    category: 'booking',
    tags: ['check-in', 'check-out', 'arrival'],
  },
  {
    id: 'faq-adventure',
    question: 'How does The Hidden Trail scavenger hunt work?',
    answer:
      'After check-in, you receive a welcome card with a unique adventure code. Enter it on our website to begin a story-driven hunt across verified safe locations around the resort and valley.',
    category: 'adventure',
    tags: ['hidden trail', 'scavenger hunt', 'adventure code'],
  },
  {
    id: 'faq-transport',
    question: 'How do I get to Nugawela from Colombo?',
    answer:
      'The resort is approximately 4–5 hours from Colombo by car. We offer airport transfer add-ons. The nearest major town is accessible by hill-country train routes.',
    category: 'travel',
    tags: ['transport', 'airport', 'colombo', 'directions'],
  },
  {
    id: 'faq-dining',
    question: 'Is breakfast included in the room rate?',
    answer:
      'Breakfast is available as an optional add-on. Our dining room serves hill-country cuisine from 7:30 AM. Room rates do not include breakfast by default.',
    category: 'dining',
    tags: ['breakfast', 'food', 'dining'],
  },
  {
    id: 'faq-accessibility',
    question: 'Is the resort accessible for guests with mobility needs?',
    answer:
      'Several rooms and paths are accessible. Our adventure stages include staff-assisted options. Contact us before arrival to discuss specific needs.',
    category: 'accessibility',
    tags: ['accessibility', 'mobility', 'wheelchair'],
  },
  {
    id: 'faq-cancellation',
    question: 'What is the cancellation policy?',
    answer:
      'Free cancellation up to 48 hours before check-in. Cancellations within 48 hours incur a 50% charge. No-shows are charged in full.',
    category: 'booking',
    tags: ['cancellation', 'refund', 'policy'],
  },
  {
    id: 'faq-children',
    question: 'Are children welcome at the resort?',
    answer:
      'Yes. The Heritage Family Villa accommodates families. Several experiences and adventure stages have child-friendly options with staff supervision.',
    category: 'families',
    tags: ['children', 'family', 'kids'],
  },
  {
    id: 'faq-wifi',
    question: 'Is Wi-Fi available throughout the resort?',
    answer:
      'Wi-Fi is available in all rooms and common areas. Hill-country connectivity can vary; we recommend downloading offline maps for valley excursions.',
    category: 'amenities',
    tags: ['wifi', 'internet', 'connectivity'],
  },
];
