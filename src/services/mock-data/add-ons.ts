import type { AddOn } from '@/types';

export const mockAddOns: AddOn[] = [
  {
    id: 'addon-breakfast',
    name: 'Breakfast Package',
    description: 'Daily breakfast with hill-country specialties, fresh fruit, and Ceylon tea.',
    price: 18,
    currency: 'USD',
    perNight: true,
    category: 'dining',
  },
  {
    id: 'addon-guided-trail',
    name: 'Guided Trail Experience',
    description: 'A private guided nature walk through resort forest trails with a naturalist.',
    price: 45,
    currency: 'USD',
    perNight: false,
    category: 'adventure',
  },
  {
    id: 'addon-transport',
    name: 'Airport Transfer',
    description: 'Private vehicle transfer from Bandaranaike International Airport.',
    price: 85,
    currency: 'USD',
    perNight: false,
    category: 'transport',
  },
  {
    id: 'addon-campfire',
    name: 'Campfire Dinner',
    description: 'Hillside campfire evening with spiced snacks, herbal drinks, and storytelling.',
    price: 35,
    currency: 'USD',
    perNight: false,
    category: 'dining',
  },
  {
    id: 'addon-stargazing',
    name: 'Stargazing Session',
    description: 'Guided stargazing on the ridge with telescope and constellation maps.',
    price: 40,
    currency: 'USD',
    perNight: false,
    category: 'adventure',
  },
];
