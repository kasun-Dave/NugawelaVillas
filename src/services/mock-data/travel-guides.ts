import { images } from '@/config/images';
import type { TravelGuide } from '@/types/travel';

export const mockGuides: TravelGuide[] = [
  {
    id: 'guide-first-time',
    title: 'First-Time Visitor Guide to Sri Lanka',
    slug: 'first-time-visitor',
    summary: 'How to shape your first island itinerary without missing the essentials.',
    topic: 'first_time',
    readingMinutes: 8,
    sections: [
      {
        heading: 'Pick a circuit, not everything',
        body: 'Sri Lanka rewards focus. Combine one cultural hub, one highland base, and one coast rather than racing the whole map in a week.',
      },
      {
        heading: 'Trains, drivers, and timing',
        body: 'Book highland train seats early when possible. Private drivers are common for multi-stop routes; allow buffer days for weather and festivals.',
      },
      {
        heading: 'Temple etiquette basics',
        body: 'Cover shoulders and knees, remove shoes and hats, and walk clockwise around stupas when in doubt.',
      },
    ],
    relatedRegionIds: ['region-cultural-triangle', 'region-hill-country', 'region-south-coast'],
    images: [images.hero.main],
    featured: true,
    publishedAt: '2026-01-12',
  },
  {
    id: 'guide-transport',
    title: 'Getting Around Sri Lanka',
    slug: 'getting-around',
    summary: 'Trains, buses, tuk-tuks, and when a private driver makes sense.',
    topic: 'transport',
    readingMinutes: 7,
    sections: [
      {
        heading: 'The scenic railway',
        body: 'The upcountry line is both transport and attraction. Sit on the right side Kandy→Ella for classic valley views (orientation varies by direction).',
      },
      {
        heading: 'Roads and pacing',
        body: 'Distances look short on a map but hills and traffic stretch drive times. Plan shorter daily hops in the highlands.',
      },
    ],
    relatedRegionIds: ['region-hill-country', 'region-west-coast'],
    images: [images.adventure.trail],
    featured: true,
    publishedAt: '2026-02-02',
  },
  {
    id: 'guide-food',
    title: 'Sri Lankan Food Guide',
    slug: 'food-guide',
    summary: 'Rice & curry, hoppers, seafood, and regional specialties worth seeking.',
    topic: 'food',
    readingMinutes: 6,
    sections: [
      {
        heading: 'The everyday feast',
        body: 'A proper rice and curry spread is the heart of the cuisine — multiple vegetable curries, sambols, and a protein.',
      },
      {
        heading: 'By the coast',
        body: 'Order the catch of the day. Jaffna crab, lagoon prawns, and grilled fish define different shorelines.',
      },
    ],
    relatedRegionIds: ['region-north', 'region-south-coast', 'region-west-coast'],
    images: [images.experiences.teaTasting, images.resort.dining],
    featured: true,
    publishedAt: '2026-02-18',
  },
  {
    id: 'guide-wildlife',
    title: 'Wildlife & Safari Etiquette',
    slug: 'wildlife-safari-guide',
    summary: 'How to choose parks and behave well around animals.',
    topic: 'wildlife',
    readingMinutes: 6,
    sections: [
      {
        heading: 'Match park to season',
        body: 'Yala and Udawalawe shine in drier months; Minneriya’s elephant gathering peaks in the dry mid-year window.',
      },
      {
        heading: 'Quiet wins',
        body: 'Ask drivers to keep distance, avoid crowding sightings, and never feed wildlife.',
      },
    ],
    relatedRegionIds: ['region-wildlife'],
    images: [images.experiences.natureWalk],
    featured: true,
    publishedAt: '2026-03-01',
  },
  {
    id: 'guide-packing',
    title: 'What to Pack for Sri Lanka',
    slug: 'packing-tips',
    summary: 'Layers for highlands, reef-safe lotion for coasts, and temple-ready clothes.',
    topic: 'packing',
    readingMinutes: 5,
    sections: [
      {
        heading: 'One bag, many climates',
        body: 'Pack light layers: humid coasts, cool evenings in Nuwara Eliya, and hot dry-zone ruins before noon.',
      },
      {
        heading: 'Temple kit',
        body: 'A scarf or light trousers that cover knees saves time at sacred sites.',
      },
    ],
    relatedRegionIds: [],
    images: [images.destinations.village],
    featured: false,
    publishedAt: '2026-03-10',
  },
  {
    id: 'guide-culture',
    title: 'Cultural Etiquette Essentials',
    slug: 'cultural-etiquette',
    summary: 'Respectful travel across faiths, festivals, and village life.',
    topic: 'culture',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Ask before photographing people',
        body: 'Especially at ceremonies and in rural villages. A smile and gesture go far.',
      },
      {
        heading: 'Right hand and shoes',
        body: 'Use your right hand for greetings and food where customary; remove shoes before entering homes and temples.',
      },
    ],
    relatedRegionIds: ['region-cultural-triangle', 'region-north'],
    images: [images.destinations.temple],
    featured: false,
    publishedAt: '2026-03-20',
  },
  {
    id: 'guide-budget',
    title: 'Budget Travel on the Island',
    slug: 'budget-travel',
    summary: 'Stretch your rupees with trains, local eateries, and smart pacing.',
    topic: 'budget',
    readingMinutes: 6,
    sections: [
      {
        heading: 'Eat local',
        body: 'Rice shops and hoppers stands beat resort markups — and taste better.',
      },
      {
        heading: 'Public transport plus one splurge',
        body: 'Use buses/trains between hubs, then budget for one memorable safari or whale outing.',
      },
    ],
    relatedRegionIds: ['region-hill-country', 'region-south-coast'],
    images: [images.destinations.village],
    featured: false,
    publishedAt: '2026-04-01',
  },
  {
    id: 'guide-seasonal',
    title: 'Seasonal Travel Calendar',
    slug: 'seasonal-travel',
    summary: 'Which coast and hills shine in which months.',
    topic: 'seasonal',
    readingMinutes: 7,
    sections: [
      {
        heading: 'West & south vs east',
        body: 'Roughly, Dec–April favors west/south beaches; May–Sep favors the east. Highlands are year-round with cooler nights.',
      },
      {
        heading: 'Festivals',
        body: 'Esala Perahera in Kandy and Nallur Festival in Jaffna transform those cities — book early.',
      },
    ],
    relatedRegionIds: ['region-south-coast', 'region-east-coast', 'region-hill-country'],
    images: [images.destinations.sunrise],
    featured: true,
    publishedAt: '2026-04-12',
  },
];
