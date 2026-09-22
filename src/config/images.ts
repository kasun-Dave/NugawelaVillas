/**
 * Centralized image configuration — Sri Lanka locations only.
 * Sources: Unsplash photos tagged / located in Sri Lanka (Mirissa, Galle, Sigiriya, Ella, etc.).
 */

const u = (id: string, w = 1600) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

/** Verified Sri Lanka photo IDs (Unsplash CDN). */
const SL = {
  mirissaBeach: 'photo-1776363558416-94f4fcb4cc1b',
  mirissaCoast: 'photo-1776776236588-bd5630bc86b8',
  parrotRock: 'photo-1776362916901-2123f9ebf1d3',
  unawatuna: 'photo-1649856092355-eee498b1d0f2',
  galleFort: 'photo-1743614887896-c0cef1e559db',
  galleAerial: 'photo-1734279135089-a3cb47fa52bf',
  sigiriya: 'photo-1711389552655-9230667c6338',
  sigiriyaView: 'photo-1711797750174-c3750dd9d7c9',
  pidurangalaSunset: 'photo-1751247026229-518bfec9b5e6',
  // Nine Arch / tea country — avoid generic “mountain” stock that isn’t Sri Lanka
  ellaMountains: 'photo-1763030597070-6ec70fdea04b',
  nineArch: 'photo-1763030597070-6ec70fdea04b',
  nineArchTrain: 'photo-1704797389230-100a9bbb5b73',
  nineArchViewpoint: 'photo-1770839012309-1a2cddff696e',
  teaNuwaraEliya: 'photo-1760533852055-724d3a50dcbd',
  teaHills: 'photo-1585171328560-947fbd92d6f0',
  teaAerial: 'photo-1544015759-237f87d55ef3',
  teaValley: 'photo-1578517929034-db013fd86597',
  teaFields: 'photo-1491497895121-1334fc14d8c9',
  elephantUdawalawe: 'photo-1674540741502-d818716c5310',
  highlandCamp: 'photo-1708174934536-a5ebd5510fa4',
} as const;

export const images = {
  hero: {
    main: u(SL.mirissaBeach, 1920),
    alt: 'Mirissa Beach on Sri Lanka’s south coast',
    slides: [
      {
        src: u(SL.mirissaBeach, 1920),
        alt: 'Mirissa Beach, southern Sri Lanka',
        label: 'Mirissa',
      },
      {
        src: u(SL.parrotRock, 1920),
        alt: 'Parrot Rock off Mirissa Beach, Sri Lanka',
        label: 'South Coast',
      },
      {
        src: u(SL.sigiriya, 1920),
        alt: 'Sigiriya Rock Fortress, Cultural Triangle',
        label: 'Sigiriya',
      },
      {
        src: u(SL.teaNuwaraEliya, 1920),
        alt: 'Tea plantations in Nuwara Eliya, Sri Lanka',
        label: 'Hill Country',
      },
      {
        src: u(SL.elephantUdawalawe, 1920),
        alt: 'Elephants at Udawalawe National Park, Sri Lanka',
        label: 'Wildlife',
      },
    ],
  },
  resort: {
    garden: u(SL.teaHills, 1200),
    terrace: u(SL.galleFort, 1200),
    dining: u(SL.teaNuwaraEliya, 1200),
    trail: u(SL.nineArch, 1200),
  },
  rooms: {
    mountainSuite: u(SL.ellaMountains, 800),
    forestChalet: u(SL.teaValley, 800),
    heritageVilla: u(SL.galleFort, 800),
    stargazerCabin: u(SL.highlandCamp, 800),
    gardenRoom: u(SL.teaFields, 800),
  },
  experiences: {
    natureWalk: u(SL.nineArchViewpoint, 800),
    teaTasting: u(SL.teaNuwaraEliya, 800),
    campfire: u(SL.highlandCamp, 800),
    stargazing: u(SL.pidurangalaSunset, 800),
  },
  destinations: {
    village: u(SL.teaHills, 800),
    sunrise: u(SL.pidurangalaSunset, 800),
    waterfall: u(SL.nineArch, 800),
    temple: u(SL.sigiriyaView, 800),
  },
  adventure: {
    trail: u(SL.ellaMountains, 1200),
    lantern: u(SL.nineArchTrain, 800),
    garden: u(SL.teaAerial, 800),
  },
  sriLanka: {
    mirissa: u(SL.mirissaBeach, 1600),
    mirissaCoast: u(SL.mirissaCoast, 1600),
    unawatuna: u(SL.unawatuna, 1600),
    galle: u(SL.galleFort, 1600),
    galleAerial: u(SL.galleAerial, 1600),
    sigiriya: u(SL.sigiriya, 1600),
    ella: u(SL.ellaMountains, 1600),
    nineArch: u(SL.nineArch, 1600),
    train: u(SL.nineArchTrain, 1600),
    tea: u(SL.teaNuwaraEliya, 1600),
    wildlife: u(SL.elephantUdawalawe, 1600),
  },
  testimonials: {
    // Place imagery (no stock portraits) — Sri Lanka scenes for guest cards if needed
    guest1: u(SL.galleFort, 400),
    guest2: u(SL.teaHills, 400),
    guest3: u(SL.mirissaBeach, 400),
  },
  map: {
    territory: u(SL.galleAerial, 1200),
  },
} as const;

/** CSS gradient placeholders for lazy-loading states */
export const imageGradients = {
  hero: 'linear-gradient(135deg, #2D4A3E 0%, #1B2F27 50%, #0A1410 100%)',
  forest: 'linear-gradient(180deg, #3D6B56 0%, #2D4A3E 100%)',
  mist: 'linear-gradient(180deg, #E8ECE9 0%, #D4DBD6 100%)',
  gold: 'linear-gradient(135deg, #C4A265 0%, #8B6F3E 100%)',
  terracotta: 'linear-gradient(135deg, #B85C38 0%, #9A4A2C 100%)',
} as const;
