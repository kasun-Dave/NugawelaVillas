import type { AdventureChapter } from '@/types/adventure';

export const adventureChapters: AdventureChapter[] = [
  {
    id: 'chapter-arrival',
    order: 1,
    title: 'The Arrival',
    description: 'Your journey begins at the resort gates, where mist and mystery first greet you.',
    summary: 'Discover the welcome clues hidden in the resort arrival spaces.',
  },
  {
    id: 'chapter-garden',
    order: 2,
    title: 'The Whispering Garden',
    description:
      'The resort gardens hold botanical secrets and celestial markers left by past storytellers.',
    summary: 'Follow garden paths, benches, and star charts through the whispering herbs.',
  },
  {
    id: 'chapter-keepers',
    order: 3,
    title: 'The Keepers of the Valley',
    description: 'Trusted partners in the valley guard fragments of the larger tale.',
    summary: 'Visit approved story-keeper stations with respect and daylight guidance.',
  },
  {
    id: 'chapter-lantern',
    order: 4,
    title: 'The Final Lantern',
    description: 'The ridge lantern awaits those who have gathered every artifact of the trail.',
    summary: 'Complete the story at a supervised ridge viewpoint before dusk.',
  },
];
