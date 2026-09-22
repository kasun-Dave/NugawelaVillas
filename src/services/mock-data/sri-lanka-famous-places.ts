import { images } from '@/config/images';
import type { AttractionCategory, Destination, SriLankaCity, SriLankaProvince } from '@/types';
import { CITY_BY_ID, SRI_LANKA_CITIES } from './sri-lanka-cities';
import { haversineKm, offsetLatLng, toMapPercent } from '@/utils/geo';
import { NUGAWELA_CENTRAL_COLLEGE } from '@/config/maps';

interface FamousPlaceSeed {
  id: string;
  cityId: string;
  name: string;
  category: AttractionCategory;
  description: string;
  lat: number;
  lng: number;
  difficulty?: Destination['difficulty'];
  featured?: boolean;
}

const FAMOUS_SEEDS: FamousPlaceSeed[] = [
  // Western
  {
    id: 'famous-colombo-gangaramaya',
    cityId: 'colombo',
    name: 'Gangaramaya Temple',
    category: 'temple',
    lat: 6.9167,
    lng: 79.8564,
    description:
      'Iconic Colombo Buddhist temple complex beside Beira Lake, known for its museum and ornate architecture.',
    featured: true,
  },
  {
    id: 'famous-colombo-galle-face',
    cityId: 'colombo',
    name: 'Galle Face Green',
    category: 'viewpoint',
    lat: 6.9279,
    lng: 79.8442,
    description:
      'Oceanfront promenade and green where locals gather for sunset views over the Indian Ocean.',
    featured: true,
  },
  {
    id: 'famous-colombo-independence',
    cityId: 'colombo',
    name: 'Independence Memorial Hall',
    category: 'historic',
    lat: 6.9036,
    lng: 79.869,
    description:
      'National monument commemorating Sri Lanka’s independence, set in a ceremonial park.',
    featured: true,
  },
  {
    id: 'famous-colombo-pettah',
    cityId: 'colombo',
    name: 'Pettah Market',
    category: 'market',
    lat: 6.937,
    lng: 79.853,
    description:
      'Bustling traditional market district packed with spices, textiles, and street life.',
    featured: false,
  },
  {
    id: 'famous-colombo-lotus-tower',
    cityId: 'colombo',
    name: 'Lotus Tower Viewpoint',
    category: 'viewpoint',
    lat: 6.927,
    lng: 79.858,
    description: 'Signature Colombo skyline landmark with sweeping city and lagoon views.',
    featured: true,
  },
  {
    id: 'famous-mount-lavinia-beach',
    cityId: 'dehiwala',
    name: 'Mount Lavinia Beach',
    category: 'nature',
    lat: 6.829,
    lng: 79.865,
    description:
      'Classic suburban beach stretch with colonial hotel heritage and evening sea breezes.',
    featured: true,
  },
  {
    id: 'famous-kelaniya-temple',
    cityId: 'kelaniya',
    name: 'Kelaniya Raja Maha Vihara',
    category: 'temple',
    lat: 6.951,
    lng: 79.918,
    description: 'Ancient riverside temple associated with Buddhist history and vibrant murals.',
    featured: true,
  },
  {
    id: 'famous-negombo-dutch-fort',
    cityId: 'negombo',
    name: 'Negombo Dutch Fort',
    category: 'historic',
    lat: 7.211,
    lng: 79.839,
    description: 'Coastal fort remnants and lagoon-side walks that tell Negombo’s colonial story.',
    featured: true,
  },
  {
    id: 'famous-negombo-fish-market',
    cityId: 'negombo',
    name: 'Negombo Fish Market',
    category: 'market',
    lat: 7.21,
    lng: 79.838,
    description: 'Early-morning fish auctions and drying yards along the lagoon shoreline.',
    featured: false,
  },
  {
    id: 'famous-bentota-beach',
    cityId: 'bentota',
    name: 'Bentota Beach & River',
    category: 'nature',
    lat: 6.424,
    lng: 79.995,
    description: 'Golden beach and Bentota River estuary popular for boat rides and water sports.',
    featured: true,
  },
  {
    id: 'famous-kalutara-bodhiya',
    cityId: 'kalutara',
    name: 'Kalutara Bodhiya',
    category: 'temple',
    lat: 6.586,
    lng: 79.961,
    description: 'Landmark riverside Buddhist shrine beside the Kaluganga bridge approach.',
    featured: true,
  },

  // Central
  {
    id: 'famous-kandy-tooth',
    cityId: 'kandy',
    name: 'Temple of the Sacred Tooth Relic',
    category: 'temple',
    lat: 7.2936,
    lng: 80.6413,
    description:
      'UNESCO-linked sacred temple complex at the heart of Kandyan culture and ceremony.',
    featured: true,
  },
  {
    id: 'famous-kandy-lake',
    cityId: 'kandy',
    name: 'Kandy Lake Walk',
    category: 'viewpoint',
    lat: 7.291,
    lng: 80.642,
    description: 'Scenic loop around Kiri Muhuda with temple and hill views.',
    featured: true,
  },
  {
    id: 'famous-kandy-botanical',
    cityId: 'peradeniya',
    name: 'Royal Botanic Gardens, Peradeniya',
    category: 'nature',
    lat: 7.271,
    lng: 80.596,
    description: 'Historic botanical gardens with orchid houses, palms, and riverside trails.',
    featured: true,
  },
  {
    id: 'famous-nugawela-college',
    cityId: 'nugawela',
    name: 'Nugawela Central College Hub',
    category: 'education',
    lat: 7.3263862,
    lng: 80.5850772,
    description:
      'Community landmark and resort adventure map hub for Werallagama valley exploration.',
    featured: true,
  },
  {
    id: 'famous-bahirawakanda',
    cityId: 'kandy',
    name: 'Bahirawakanda Buddha Statue',
    category: 'viewpoint',
    lat: 7.295,
    lng: 80.625,
    description: 'Hilltop Buddha statue overlooking Kandy city and the surrounding ranges.',
    featured: true,
  },
  {
    id: 'famous-udawatta-kele',
    cityId: 'kandy',
    name: 'Udawatta Kele Sanctuary',
    category: 'trail',
    lat: 7.298,
    lng: 80.645,
    description: 'Forest sanctuary trails above Kandy with birdsong and cooler shade.',
    featured: false,
  },
  {
    id: 'famous-dambulla-cave',
    cityId: 'dambulla',
    name: 'Dambulla Cave Temple',
    category: 'temple',
    lat: 7.8567,
    lng: 80.6492,
    description: 'Cave monastery complex with ancient murals and panoramic rock-top views.',
    featured: true,
  },
  {
    id: 'famous-sigiriya-rock',
    cityId: 'sigiriya',
    name: 'Sigiriya Rock Fortress',
    category: 'historic',
    lat: 7.957,
    lng: 80.7603,
    description: 'Legendary rock citadel with frescoes, water gardens, and summit vistas.',
    featured: true,
    difficulty: 'challenging',
  },
  {
    id: 'famous-pidurangala',
    cityId: 'sigiriya',
    name: 'Pidurangala Rock',
    category: 'viewpoint',
    lat: 7.965,
    lng: 80.76,
    description: 'Sunrise hike with classic views toward Sigiriya Rock.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-nuwara-eliya-lake',
    cityId: 'nuwara-eliya',
    name: 'Lake Gregory',
    category: 'nature',
    lat: 6.957,
    lng: 80.78,
    description: 'Highland lake promenade for boat rides and cool-country walks.',
    featured: true,
  },
  {
    id: 'famous-horton-plains',
    cityId: 'nuwara-eliya',
    name: 'Horton Plains & World’s End',
    category: 'trail',
    lat: 6.809,
    lng: 80.802,
    description: 'Cloud-forest plateau hike ending at dramatic highland cliffs.',
    featured: true,
    difficulty: 'challenging',
  },
  {
    id: 'famous-tea-factory-ne',
    cityId: 'nuwara-eliya',
    name: 'Pedro Tea Estate',
    category: 'tea_estate',
    lat: 6.97,
    lng: 80.78,
    description: 'Working highland tea estate and factory tour near Nuwara Eliya.',
    featured: true,
  },
  {
    id: 'famous-adamspeak-trail',
    cityId: 'hatton',
    name: 'Adam’s Peak Trailhead (Dalhousie)',
    category: 'trail',
    lat: 6.809,
    lng: 80.499,
    description: 'Sacred mountain pilgrimage route famous for night climbs and sunrise.',
    featured: true,
    difficulty: 'challenging',
  },

  // Southern
  {
    id: 'famous-galle-fort',
    cityId: 'galle',
    name: 'Galle Fort',
    category: 'historic',
    lat: 6.026,
    lng: 80.217,
    description: 'Living UNESCO fort city with ramparts, cafés, and ocean walls.',
    featured: true,
  },
  {
    id: 'famous-galle-lighthouse',
    cityId: 'galle',
    name: 'Galle Lighthouse',
    category: 'viewpoint',
    lat: 6.0246,
    lng: 80.2194,
    description: 'Iconic lighthouse on the fort’s southern ramparts.',
    featured: true,
  },
  {
    id: 'famous-hikkaduwa-reef',
    cityId: 'hikkaduwa',
    name: 'Hikkaduwa Coral Sanctuary',
    category: 'nature',
    lat: 6.14,
    lng: 80.1,
    description: 'Snorkel-friendly reef waters and beachside marine life viewing.',
    featured: true,
  },
  {
    id: 'famous-unawatuna-bay',
    cityId: 'unawatuna',
    name: 'Unawatuna Bay',
    category: 'nature',
    lat: 6.009,
    lng: 80.248,
    description: 'Curved southern bay popular for swimming and beach walks.',
    featured: true,
  },
  {
    id: 'famous-mirissa-whale',
    cityId: 'mirissa',
    name: 'Mirissa Whale Watching Harbour',
    category: 'adventure_stop',
    lat: 5.948,
    lng: 80.457,
    description: 'Departure point for seasonal blue whale and dolphin watching.',
    featured: true,
  },
  {
    id: 'famous-coconut-tree-hill',
    cityId: 'mirissa',
    name: 'Coconut Tree Hill',
    category: 'viewpoint',
    lat: 5.944,
    lng: 80.459,
    description: 'Photogenic palm-fringed headland above Mirissa beach.',
    featured: true,
  },
  {
    id: 'famous-weligama-surf',
    cityId: 'weligama',
    name: 'Weligama Surf Bay',
    category: 'adventure_stop',
    lat: 5.973,
    lng: 80.429,
    description: 'Gentle bay break popular with first-time surfers.',
    featured: false,
  },
  {
    id: 'famous-tangalle-beach',
    cityId: 'tangalle',
    name: 'Tangalle Beach Stretch',
    category: 'nature',
    lat: 6.023,
    lng: 80.796,
    description: 'Quieter southern beaches with wide sand and fishing villages.',
    featured: true,
  },
  {
    id: 'famous-yala',
    cityId: 'yala-edge',
    name: 'Yala National Park',
    category: 'nature',
    lat: 6.3729,
    lng: 81.518,
    description: 'Premier wildlife reserve known for leopards, elephants, and coastal lagoons.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-bundala',
    cityId: 'tissamaharama',
    name: 'Bundala National Park',
    category: 'nature',
    lat: 6.195,
    lng: 81.22,
    description: 'Ramsar wetland sanctuary famous for migratory birds.',
    featured: true,
  },

  // Northern
  {
    id: 'famous-nallur-kovil',
    cityId: 'nallur',
    name: 'Nallur Kandaswamy Temple',
    category: 'temple',
    lat: 9.6745,
    lng: 80.029,
    description: 'Major Hindu temple and cultural centre of the Jaffna peninsula.',
    featured: true,
  },
  {
    id: 'famous-jaffna-fort',
    cityId: 'jaffna',
    name: 'Jaffna Fort',
    category: 'historic',
    lat: 9.662,
    lng: 80.012,
    description: 'Star fort overlooking the lagoon, restored as a living heritage site.',
    featured: true,
  },
  {
    id: 'famous-jaffna-library',
    cityId: 'jaffna',
    name: 'Jaffna Public Library',
    category: 'historic',
    lat: 9.6628,
    lng: 80.0105,
    description: 'Rebuilt cultural landmark symbolising knowledge and resilience.',
    featured: true,
  },
  {
    id: 'famous-casuarina-beach',
    cityId: 'jaffna',
    name: 'Casuarina Beach',
    category: 'nature',
    lat: 9.75,
    lng: 79.9,
    description: 'Shallow northern beach lined with casuarina trees.',
    featured: false,
  },
  {
    id: 'famous-mannar-fort',
    cityId: 'mannar',
    name: 'Mannar Fort',
    category: 'historic',
    lat: 8.978,
    lng: 79.904,
    description: 'Island fort remnant guarding the approach to Mannar.',
    featured: false,
  },

  // Eastern
  {
    id: 'famous-trincomalee-kovil',
    cityId: 'trincomalee',
    name: 'Koneswaram Temple',
    category: 'temple',
    lat: 8.582,
    lng: 81.245,
    description: 'Cliff-top Hindu temple overlooking Trincomalee harbour.',
    featured: true,
  },
  {
    id: 'famous-nilaveli-beach',
    cityId: 'nilaveli',
    name: 'Nilaveli Beach',
    category: 'nature',
    lat: 8.692,
    lng: 81.19,
    description: 'Long pale-sand beach and gateway to Pigeon Island snorkelling.',
    featured: true,
  },
  {
    id: 'famous-pigeon-island',
    cityId: 'nilaveli',
    name: 'Pigeon Island National Park',
    category: 'nature',
    lat: 8.722,
    lng: 81.203,
    description: 'Marine park with coral gardens and reef fish.',
    featured: true,
  },
  {
    id: 'famous-passikudah-bay',
    cityId: 'passikudah',
    name: 'Passikudah Bay',
    category: 'nature',
    lat: 7.923,
    lng: 81.565,
    description: 'Calm shallow bay on the east coast, ideal for relaxed swimming.',
    featured: true,
  },
  {
    id: 'famous-batticaloa-lagoon',
    cityId: 'batticaloa',
    name: 'Batticaloa Lagoon Bridge',
    category: 'viewpoint',
    lat: 7.712,
    lng: 81.7,
    description: 'Lagoon crossings and evening walks through Batticaloa’s waterways.',
    featured: false,
  },
  {
    id: 'famous-arugam-bay',
    cityId: 'arugam-bay',
    name: 'Arugam Bay Point',
    category: 'adventure_stop',
    lat: 6.8404,
    lng: 81.8363,
    description: 'World-famous right-hand point break and east-coast surf village.',
    featured: true,
  },

  // North Western
  {
    id: 'famous-kurunegala-rock',
    cityId: 'kurunegala',
    name: 'Ethagala (Elephant Rock)',
    category: 'viewpoint',
    lat: 7.487,
    lng: 80.365,
    description: 'City rock outcrop with temple and panoramic plains views.',
    featured: true,
  },
  {
    id: 'famous-wilpattu-edge',
    cityId: 'puttalam',
    name: 'Wilpattu National Park Gateway',
    category: 'nature',
    lat: 8.45,
    lng: 80.05,
    description: 'Entry corridor to one of Sri Lanka’s largest and wildest parks.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-chilaw-lagoon',
    cityId: 'chilaw',
    name: 'Chilaw Lagoon Shore',
    category: 'nature',
    lat: 7.576,
    lng: 79.795,
    description: 'Lagoon-side birding and fishing village landscapes.',
    featured: false,
  },

  // North Central
  {
    id: 'famous-anuradhapura-sri-maha',
    cityId: 'anuradhapura',
    name: 'Sri Maha Bodhi',
    category: 'temple',
    lat: 8.345,
    lng: 80.397,
    description: 'Sacred Bodhi tree sanctuary at the heart of the ancient capital.',
    featured: true,
  },
  {
    id: 'famous-ruwanwelisaya',
    cityId: 'anuradhapura',
    name: 'Ruwanwelisaya Stupa',
    category: 'historic',
    lat: 8.35,
    lng: 80.3965,
    description: 'Great white stupa and pilgrimage focus of Anuradhapura.',
    featured: true,
  },
  {
    id: 'famous-jetavanaramaya',
    cityId: 'anuradhapura',
    name: 'Jetavanaramaya',
    category: 'historic',
    lat: 8.3515,
    lng: 80.4037,
    description: 'Colossal ancient brick stupa within the sacred city.',
    featured: true,
  },
  {
    id: 'famous-mihintale',
    cityId: 'mihintale',
    name: 'Mihintale Sacred Mountain',
    category: 'trail',
    lat: 8.3505,
    lng: 80.505,
    description: 'Stairway pilgrimage site regarded as the cradle of Buddhism in Sri Lanka.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-polonnaruwa-galvihara',
    cityId: 'polonnaruwa',
    name: 'Gal Vihara',
    category: 'historic',
    lat: 7.966,
    lng: 80.995,
    description: 'Masterpiece rock-cut Buddha statues of medieval Polonnaruwa.',
    featured: true,
  },
  {
    id: 'famous-polonnaruwa-vatadage',
    cityId: 'polonnaruwa',
    name: 'Polonnaruwa Vatadage',
    category: 'historic',
    lat: 7.947,
    lng: 81.001,
    description: 'Circular relic house within the ancient royal city.',
    featured: true,
  },
  {
    id: 'famous-minneriya',
    cityId: 'habarana',
    name: 'Minneriya National Park',
    category: 'nature',
    lat: 8.036,
    lng: 80.833,
    description: 'Seasonal elephant gathering around the Minneriya tank.',
    featured: true,
  },

  // Uva
  {
    id: 'famous-ella-rock',
    cityId: 'ella',
    name: 'Ella Rock Trail',
    category: 'trail',
    lat: 6.86,
    lng: 81.04,
    description: 'Signature highland hike with tea-country and valley views.',
    featured: true,
    difficulty: 'challenging',
  },
  {
    id: 'famous-nine-arch',
    cityId: 'ella',
    name: 'Nine Arch Bridge',
    category: 'historic',
    lat: 6.8765,
    lng: 81.063,
    description: 'Colonial railway viaduct framed by jungle and tea hills.',
    featured: true,
  },
  {
    id: 'famous-little-adams-peak',
    cityId: 'ella',
    name: 'Little Adam’s Peak',
    category: 'viewpoint',
    lat: 6.871,
    lng: 81.057,
    description: 'Short scenic climb popular at sunrise and sunset.',
    featured: true,
  },
  {
    id: 'famous-ravana-falls',
    cityId: 'ella',
    name: 'Ravana Falls',
    category: 'waterfall',
    lat: 6.84,
    lng: 81.05,
    description: 'Roadside cascade linked to Ramayana legends near Ella.',
    featured: true,
  },
  {
    id: 'famous-badulla-muthiyangana',
    cityId: 'badulla',
    name: 'Muthiyangana Raja Maha Vihara',
    category: 'temple',
    lat: 6.989,
    lng: 81.057,
    description: 'Historic Buddhist temple in the Badulla valley.',
    featured: false,
  },
  {
    id: 'famous-kataragama',
    cityId: 'kataragama',
    name: 'Kataragama Sacred City',
    category: 'temple',
    lat: 6.4135,
    lng: 81.3327,
    description: 'Multi-faith pilgrimage town sacred to Buddhists and Hindus.',
    featured: true,
  },
  {
    id: 'famous-diyaluma',
    cityId: 'wellawaya',
    name: 'Diyaluma Falls',
    category: 'waterfall',
    lat: 6.733,
    lng: 81.03,
    description: 'One of Sri Lanka’s tallest waterfalls with upper pool trails.',
    featured: true,
    difficulty: 'moderate',
  },

  // Sabaragamuwa
  {
    id: 'famous-ratnapura-gem',
    cityId: 'ratnapura',
    name: 'Ratnapura Gem District',
    category: 'market',
    lat: 6.7056,
    lng: 80.3847,
    description: 'Gem-trading heartland with museums and cutting workshops.',
    featured: true,
  },
  {
    id: 'famous-sinharaja-edge',
    cityId: 'ratnapura',
    name: 'Sinharaja Forest Gateway',
    category: 'trail',
    lat: 6.416,
    lng: 80.5,
    description: 'Rainforest UNESCO reserve trails for birding and canopy walks.',
    featured: true,
    difficulty: 'challenging',
  },
  {
    id: 'famous-kitulgala-river',
    cityId: 'kitulgala',
    name: 'Kitulgala Kelani River',
    category: 'adventure_stop',
    lat: 6.99,
    lng: 80.411,
    description: 'White-water rafting and rainforest adventure hub.',
    featured: true,
  },
  {
    id: 'famous-belilena',
    cityId: 'kitulgala',
    name: 'Belilena Cave',
    category: 'historic',
    lat: 6.983,
    lng: 80.433,
    description: 'Prehistoric cave site near Kitulgala with archaeological significance.',
    featured: false,
  },
  {
    id: 'famous-pinnawala',
    cityId: 'kegalle',
    name: 'Pinnawala Elephant Orphanage',
    category: 'nature',
    lat: 7.272,
    lng: 80.388,
    description: 'River bathing viewpoint and conservation visitor centre for elephants.',
    featured: true,
  },

  // ── Expansion: full city coverage ──────────────────────────────────────────

  // Western — Colombo District
  {
    id: 'famous-colombo-national-museum',
    cityId: 'colombo',
    name: 'Colombo National Museum',
    category: 'historic',
    lat: 6.9107,
    lng: 79.8611,
    description:
      'The island’s largest museum, housing the Kandyan royal regalia and centuries of Sri Lankan art and archaeology.',
    featured: true,
  },
  {
    id: 'famous-colombo-viharamahadevi',
    cityId: 'colombo',
    name: 'Viharamahadevi Park',
    category: 'nature',
    lat: 6.9137,
    lng: 79.8636,
    description:
      'Colombo’s oldest and largest public park, shaded by flowering trees beside the Town Hall.',
    featured: false,
  },
  {
    id: 'famous-moratuwa-bolgoda',
    cityId: 'moratuwa',
    name: 'Bolgoda Lake',
    category: 'nature',
    lat: 6.756,
    lng: 79.906,
    description:
      'One of Sri Lanka’s largest natural freshwater lakes, popular for boat rides, birdwatching, and lakeside dining.',
    featured: true,
  },
  {
    id: 'famous-moratuwa-lunawa',
    cityId: 'moratuwa',
    name: 'Lunawa Lagoon',
    category: 'nature',
    lat: 6.795,
    lng: 79.877,
    description:
      'Restored coastal lagoon with a walking path linking Moratuwa’s beach communities.',
    featured: false,
  },
  {
    id: 'famous-kotte-ramparts',
    cityId: 'kotte',
    name: 'Kotte Ancient Ramparts & Raja Maha Vihara',
    category: 'historic',
    lat: 6.894,
    lng: 79.908,
    description:
      'Remnants of the moats and laterite ramparts of the 15th-century Kotte kingdom, beside its historic temple.',
    featured: true,
  },
  {
    id: 'famous-kotte-diyatha',
    cityId: 'kotte',
    name: 'Diyatha Uyana',
    category: 'nature',
    lat: 6.9025,
    lng: 79.9077,
    description:
      'Popular waterfront park and weekend plant-and-food market on the banks of Diyawanna Lake.',
    featured: true,
  },
  {
    id: 'famous-kotte-diyawanna',
    cityId: 'kotte',
    name: 'Diyawanna Lake & Parliament View',
    category: 'viewpoint',
    lat: 6.886,
    lng: 79.918,
    description:
      'Lakeside walks with views of the island Parliament complex designed by Geoffrey Bawa.',
    featured: false,
  },
  {
    id: 'famous-maharagama-pamunuwa',
    cityId: 'maharagama',
    name: 'Pamunuwa Textile Market',
    category: 'market',
    lat: 6.845,
    lng: 79.924,
    description:
      'Bargain clothing and textile strip drawing shoppers from across the Colombo suburbs.',
    featured: false,
  },
  {
    id: 'famous-maharagama-dharmayatanaya',
    cityId: 'maharagama',
    name: 'Maharagama Sri Vajiragnana Dharmayatanaya',
    category: 'temple',
    lat: 6.8465,
    lng: 79.9285,
    description:
      'Leading Buddhist study and meditation centre known for its Sunday dhamma programmes.',
    featured: false,
  },
  {
    id: 'famous-piliyandala-bellanwila',
    cityId: 'piliyandala',
    name: 'Bellanwila Raja Maha Viharaya',
    category: 'temple',
    lat: 6.8423,
    lng: 79.9006,
    description:
      'Famed temple with a sacred Bodhi tree, vivid modern murals, and a grand annual perahera.',
    featured: true,
  },
  {
    id: 'famous-piliyandala-bolgoda-jetty',
    cityId: 'piliyandala',
    name: 'Bolgoda River Boat Jetties',
    category: 'nature',
    lat: 6.79,
    lng: 79.92,
    description: 'Quiet jetties on the Bolgoda waterway for sunset boat trips and birdlife.',
    featured: false,
  },
  {
    id: 'famous-avissawella-seethawaka-gardens',
    cityId: 'avissawella',
    name: 'Seethawaka Wet Zone Botanic Gardens',
    category: 'nature',
    lat: 6.9,
    lng: 80.18,
    description:
      'Rainforest-fringed botanical garden showcasing wet-zone flora in the Seethawaka valley.',
    featured: true,
  },
  {
    id: 'famous-avissawella-berendi',
    cityId: 'avissawella',
    name: 'Berendi Kovil Ruins',
    category: 'historic',
    lat: 6.951,
    lng: 80.199,
    description: 'Stone ruins of a 16th-century Seethawaka-era shrine beside the Sitawaka River.',
    featured: false,
  },

  // Western — Gampaha District
  {
    id: 'famous-gampaha-henarathgoda',
    cityId: 'gampaha',
    name: 'Henarathgoda Botanical Garden',
    category: 'nature',
    lat: 7.0919,
    lng: 79.9953,
    description:
      'Historic garden where Asia’s first rubber tree was planted in 1876; shady lawns and rare palms.',
    featured: true,
  },
  {
    id: 'famous-wattala-muthurajawela',
    cityId: 'wattala',
    name: 'Muthurajawela Marsh',
    category: 'nature',
    lat: 7.04,
    lng: 79.868,
    description:
      'Vast coastal wetland with guided boat safaris through mangroves rich in birds and monitor lizards.',
    featured: true,
  },
  {
    id: 'famous-wattala-hamilton-canal',
    cityId: 'wattala',
    name: 'Hamilton Canal (Hendala)',
    category: 'historic',
    lat: 6.998,
    lng: 79.872,
    description:
      'Dutch-era canal pathway linking Colombo to Negombo, now a waterside walking and cycling route.',
    featured: false,
  },
  {
    id: 'famous-ja-ela-dutch-canal',
    cityId: 'ja-ela',
    name: 'Ja-Ela Dutch Canal',
    category: 'historic',
    lat: 7.079,
    lng: 79.892,
    description:
      'Colonial canal stretch through Ja-Ela town, part of the old Colombo–Negombo waterway.',
    featured: false,
  },
  {
    id: 'famous-minuwangoda-aluthepola',
    cityId: 'minuwangoda',
    name: 'Aluthepola Ganekanda Raja Maha Viharaya',
    category: 'temple',
    lat: 7.155,
    lng: 79.939,
    description: 'Rock-outcrop temple with cave shrines and countryside views near Minuwangoda.',
    featured: false,
  },

  // Western — Kalutara District
  {
    id: 'famous-panadura-rankoth',
    cityId: 'panadura',
    name: 'Panadura Rankoth Viharaya',
    category: 'temple',
    lat: 6.7108,
    lng: 79.9066,
    description: 'Landmark gilded-pinnacle temple central to Panadura’s Buddhist revival history.',
    featured: true,
  },
  {
    id: 'famous-panadura-beach',
    cityId: 'panadura',
    name: 'Panadura Beach',
    category: 'nature',
    lat: 6.72,
    lng: 79.897,
    description: 'Local beach strip at the Kalu Ganga estuary mouth, popular for evening walks.',
    featured: false,
  },
  {
    id: 'famous-beruwala-kechimalai',
    cityId: 'beruwala',
    name: 'Kechimalai Mosque',
    category: 'historic',
    lat: 6.4726,
    lng: 79.9822,
    description:
      'One of Sri Lanka’s oldest mosques, a white hilltop landmark marking early Arab trader settlement.',
    featured: true,
  },
  {
    id: 'famous-beruwala-barberyn',
    cityId: 'beruwala',
    name: 'Barberyn Island Lighthouse',
    category: 'viewpoint',
    lat: 6.459,
    lng: 79.972,
    description:
      'Offshore island lighthouse reached by boat, with reef waters and coastal panoramas.',
    featured: false,
    difficulty: 'moderate',
  },
  {
    id: 'famous-horana-rajamaha',
    cityId: 'horana',
    name: 'Horana Raja Maha Viharaya',
    category: 'temple',
    lat: 6.716,
    lng: 80.062,
    description: 'Historic temple at the heart of Horana town, a centre of local festivals.',
    featured: false,
  },
  {
    id: 'famous-wadduwa-beach',
    cityId: 'wadduwa',
    name: 'Wadduwa Beach',
    category: 'nature',
    lat: 6.636,
    lng: 79.923,
    description: 'Broad golden beach lined with coconut palms and resort gardens south of Colombo.',
    featured: true,
  },

  // Central — Kandy District
  {
    id: 'famous-gampola-ambuluwawa',
    cityId: 'gampola',
    name: 'Ambuluwawa Biodiversity Complex',
    category: 'viewpoint',
    lat: 7.1568,
    lng: 80.5646,
    description:
      'Spiralling summit tower on a biodiversity hill with 360° views over four mountain ranges.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-gampola-lankatilaka',
    cityId: 'gampola',
    name: 'Lankatilaka Viharaya',
    category: 'temple',
    lat: 7.2318,
    lng: 80.5731,
    description:
      'Majestic 14th-century Gampola-era temple rising from a rock, famed for its architecture and frescoes.',
    featured: true,
  },
  {
    id: 'famous-gampola-embekke',
    cityId: 'gampola',
    name: 'Embekke Devalaya',
    category: 'historic',
    lat: 7.2158,
    lng: 80.5736,
    description:
      'Medieval shrine celebrated for the finest traditional wood carvings in Sri Lanka.',
    featured: true,
  },
  {
    id: 'famous-katugastota-mahaweli',
    cityId: 'katugastota',
    name: 'Mahaweli River Bend at Katugastota',
    category: 'nature',
    lat: 7.335,
    lng: 80.618,
    description:
      'Riverside stretch of the Mahaweli long associated with elephant bathing and ferry crossings.',
    featured: false,
  },
  {
    id: 'famous-kadugannawa-dawson',
    cityId: 'kadugannawa',
    name: 'Dawson Tower',
    category: 'historic',
    lat: 7.253,
    lng: 80.524,
    description:
      'Colonial memorial tower honouring the engineer of the historic Colombo–Kandy road.',
    featured: true,
  },
  {
    id: 'famous-kadugannawa-railway-museum',
    cityId: 'kadugannawa',
    name: 'National Railway Museum',
    category: 'education',
    lat: 7.2545,
    lng: 80.5248,
    description: 'Vintage locomotives and railway heritage at the old Kadugannawa station yard.',
    featured: false,
  },
  {
    id: 'famous-kadugannawa-gadaladeniya',
    cityId: 'kadugannawa',
    name: 'Gadaladeniya Viharaya',
    category: 'temple',
    lat: 7.2528,
    lng: 80.5539,
    description:
      'Stone-built 14th-century temple on a rock outcrop with South Indian architectural influences.',
    featured: true,
  },

  // Central — Matale District
  {
    id: 'famous-matale-aluvihare',
    cityId: 'matale',
    name: 'Aluvihare Rock Temple',
    category: 'temple',
    lat: 7.5065,
    lng: 80.6153,
    description:
      'Cave monastery where the Buddhist Pali canon was first committed to writing in the 1st century BCE.',
    featured: true,
  },
  {
    id: 'famous-matale-riverston',
    cityId: 'matale',
    name: 'Riverston Peak (Knuckles)',
    category: 'trail',
    lat: 7.527,
    lng: 80.736,
    description:
      'Misty gap and peak trail in the Knuckles range with sweeping views over the dry-zone plains.',
    featured: true,
    difficulty: 'challenging',
  },
  {
    id: 'famous-matale-sembuwatta',
    cityId: 'matale',
    name: 'Sembuwatta Lake',
    category: 'nature',
    lat: 7.533,
    lng: 80.689,
    description:
      'Turquoise man-made lake amid the Elkaduwa tea estates, a favourite highland picnic spot.',
    featured: false,
    difficulty: 'moderate',
  },
  {
    id: 'famous-nalanda-gedige',
    cityId: 'nalanda',
    name: 'Nalanda Gedige',
    category: 'historic',
    lat: 7.6636,
    lng: 80.6528,
    description:
      'Unique ancient stone shrine blending Buddhist and Hindu architecture at the island’s geographic centre.',
    featured: true,
  },

  // Central — Nuwara Eliya District
  {
    id: 'famous-nuwara-eliya-hakgala',
    cityId: 'nuwara-eliya',
    name: 'Hakgala Botanical Garden',
    category: 'nature',
    lat: 6.9247,
    lng: 80.82,
    description:
      'High-altitude garden beneath Hakgala Rock, renowned for roses, ferns, and montane forest.',
    featured: true,
  },
  {
    id: 'famous-nuwara-eliya-victoria-park',
    cityId: 'nuwara-eliya',
    name: 'Victoria Park',
    category: 'nature',
    lat: 6.9689,
    lng: 80.7654,
    description: 'Manicured town park prized by birdwatchers for rare montane species.',
    featured: false,
  },
  {
    id: 'famous-hatton-castlereagh',
    cityId: 'hatton',
    name: 'Castlereagh Reservoir',
    category: 'nature',
    lat: 6.868,
    lng: 80.578,
    description: 'Serene tea-country reservoir ringed by estate bungalows and misty hills.',
    featured: true,
  },
  {
    id: 'famous-hatton-st-clairs',
    cityId: 'hatton',
    name: 'St. Clair’s Falls',
    category: 'waterfall',
    lat: 6.94,
    lng: 80.655,
    description:
      'Wide twin cascade dubbed the “Little Niagara of Sri Lanka”, seen from the Hatton–Talawakele road.',
    featured: true,
  },
  {
    id: 'famous-hatton-devon-falls',
    cityId: 'hatton',
    name: 'Devon Falls',
    category: 'waterfall',
    lat: 6.944,
    lng: 80.628,
    description:
      'Slender 97 m waterfall plunging through tea terraces opposite a popular viewing platform.',
    featured: false,
  },
  {
    id: 'famous-haputale-liptons-seat',
    cityId: 'haputale',
    name: 'Lipton’s Seat',
    category: 'viewpoint',
    lat: 6.8,
    lng: 80.967,
    description:
      'Sir Thomas Lipton’s favourite lookout above the Dambatenne tea estates, with views over five provinces.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-haputale-adisham',
    cityId: 'haputale',
    name: 'Adisham Bungalow',
    category: 'historic',
    lat: 6.7743,
    lng: 80.9498,
    description:
      'English country-manor monastery in the misty Haputale hills, open to visitors on weekends.',
    featured: true,
  },

  // Southern — Galle District
  {
    id: 'famous-galle-jungle-beach',
    cityId: 'galle',
    name: 'Jungle Beach & Rumassala',
    category: 'nature',
    lat: 6.0225,
    lng: 80.2399,
    description:
      'Secluded cove beneath the legend-rich Rumassala headland, reached by a short forest path.',
    featured: false,
  },
  {
    id: 'famous-unawatuna-peace-pagoda',
    cityId: 'unawatuna',
    name: 'Japanese Peace Pagoda',
    category: 'temple',
    lat: 6.0091,
    lng: 80.2373,
    description: 'Gleaming white stupa on Rumassala hill with sweeping views over Galle harbour.',
    featured: true,
  },
  {
    id: 'famous-ambalangoda-mask-museum',
    cityId: 'ambalangoda',
    name: 'Ambalangoda Mask Museum',
    category: 'education',
    lat: 6.2353,
    lng: 80.0536,
    description:
      'Workshop-museum of traditional Sri Lankan devil-dance and kolam masks carved by master families.',
    featured: true,
  },
  {
    id: 'famous-ambalangoda-madu-river',
    cityId: 'ambalangoda',
    name: 'Madu River Safari (Balapitiya)',
    category: 'nature',
    lat: 6.283,
    lng: 80.048,
    description:
      'Mangrove boat safari across a Ramsar wetland dotted with island temples and cinnamon isles.',
    featured: true,
  },
  {
    id: 'famous-ahangama-stilt-fishermen',
    cityId: 'ahangama',
    name: 'Stilt Fishermen of Ahangama',
    category: 'viewpoint',
    lat: 5.973,
    lng: 80.363,
    description:
      'Iconic coastal sight of fishermen perched on stilts in the surf at dawn and dusk.',
    featured: true,
  },
  {
    id: 'famous-ahangama-kabalana',
    cityId: 'ahangama',
    name: 'Kabalana Surf Point (The Rock)',
    category: 'adventure_stop',
    lat: 5.975,
    lng: 80.369,
    description: 'Consistent A-frame reef break that made Ahangama a year-round surf hub.',
    featured: false,
  },
  {
    id: 'famous-ahangama-koggala-lake',
    cityId: 'ahangama',
    name: 'Koggala Lake & Islands',
    category: 'nature',
    lat: 5.996,
    lng: 80.335,
    description: 'Island-dotted lake with boat trips to a temple isle and cinnamon gardens.',
    featured: false,
  },

  // Southern — Matara District
  {
    id: 'famous-matara-star-fort',
    cityId: 'matara',
    name: 'Matara Star Fort',
    category: 'historic',
    lat: 5.9487,
    lng: 80.5432,
    description: 'Rare star-shaped Dutch fort of 1765 guarding the Nilwala River crossing.',
    featured: true,
  },
  {
    id: 'famous-matara-paravi-duwa',
    cityId: 'matara',
    name: 'Paravi Duwa Temple',
    category: 'temple',
    lat: 5.942,
    lng: 80.5416,
    description: 'Picturesque island temple joined to Matara beach by a pedestrian bridge.',
    featured: true,
  },
  {
    id: 'famous-matara-dondra-lighthouse',
    cityId: 'matara',
    name: 'Dondra Head Lighthouse',
    category: 'viewpoint',
    lat: 5.921,
    lng: 80.59,
    description: 'Sri Lanka’s tallest lighthouse at the island’s southernmost point.',
    featured: true,
  },
  {
    id: 'famous-matara-weherahena',
    cityId: 'matara',
    name: 'Weherahena Poorwarama Viharaya',
    category: 'temple',
    lat: 5.951,
    lng: 80.575,
    description: 'Tunnel temple with a towering seated Buddha and thousands of comic-strip murals.',
    featured: false,
  },
  {
    id: 'famous-dikwella-wewurukannala',
    cityId: 'dikwella',
    name: 'Wewurukannala Vihara',
    category: 'temple',
    lat: 5.9702,
    lng: 80.6982,
    description: 'Home to a 50 m seated Buddha, among the tallest statues on the island.',
    featured: true,
  },
  {
    id: 'famous-dikwella-hiriketiya',
    cityId: 'dikwella',
    name: 'Hiriketiya Beach',
    category: 'nature',
    lat: 5.9636,
    lng: 80.7025,
    description:
      'Horseshoe surf cove ringed by palms, one of the south coast’s most loved beaches.',
    featured: true,
  },
  {
    id: 'famous-dikwella-hummanaya',
    cityId: 'dikwella',
    name: 'Hummanaya Blowhole',
    category: 'nature',
    lat: 5.9569,
    lng: 80.7367,
    description:
      'Sri Lanka’s only known blowhole, shooting seawater high above the Kudawella cliffs.',
    featured: true,
  },
  {
    id: 'famous-weligama-taprobane',
    cityId: 'weligama',
    name: 'Taprobane Island View',
    category: 'viewpoint',
    lat: 5.9722,
    lng: 80.4321,
    description: 'View across Weligama Bay to the storied private island villa of Count de Mauny.',
    featured: false,
  },
  {
    id: 'famous-weligama-kushta-raja',
    cityId: 'weligama',
    name: 'Kushta Raja Gala',
    category: 'historic',
    lat: 5.9744,
    lng: 80.4247,
    description:
      'Ancient rock-cut statue of a royal figure carved into a boulder near Weligama town.',
    featured: false,
  },

  // Southern — Hambantota District
  {
    id: 'famous-tangalle-mulkirigala',
    cityId: 'tangalle',
    name: 'Mulkirigala Rock Temple',
    category: 'temple',
    lat: 6.1194,
    lng: 80.7314,
    description:
      'Seven-terraced cave temple climbing a 200 m rock, with ancient murals and library caves.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-tangalle-rekawa',
    cityId: 'tangalle',
    name: 'Rekawa Turtle Beach',
    category: 'nature',
    lat: 6.0454,
    lng: 80.85,
    description:
      'Conservation beach where five sea-turtle species nest year-round under guided night watches.',
    featured: true,
  },
  {
    id: 'famous-hambantota-ridiyagama',
    cityId: 'hambantota',
    name: 'Ridiyagama Safari Park',
    category: 'nature',
    lat: 6.158,
    lng: 80.972,
    description: 'Drive-through safari park with free-roaming lions, elephants, and African fauna.',
    featured: true,
  },
  {
    id: 'famous-hambantota-martello',
    cityId: 'hambantota',
    name: 'Hambantota Martello Tower',
    category: 'historic',
    lat: 6.1229,
    lng: 81.123,
    description: 'Rare British Martello tower overlooking the old fishing harbour.',
    featured: false,
  },
  {
    id: 'famous-tissamaharama-vihara',
    cityId: 'tissamaharama',
    name: 'Tissamaharama Raja Maha Vihara',
    category: 'temple',
    lat: 6.2822,
    lng: 81.276,
    description:
      'Great white dagoba of the ancient Ruhuna kingdom, rising above paddy fields and lakes.',
    featured: true,
  },
  {
    id: 'famous-tissamaharama-wewa',
    cityId: 'tissamaharama',
    name: 'Tissa Wewa',
    category: 'nature',
    lat: 6.29,
    lng: 81.284,
    description:
      'Ancient royal reservoir fringed by flame trees, alive with egrets and flying foxes at dusk.',
    featured: false,
  },

  // Northern
  {
    id: 'famous-point-pedro-lighthouse',
    cityId: 'point-pedro',
    name: 'Point Pedro Lighthouse',
    category: 'viewpoint',
    lat: 9.83,
    lng: 80.241,
    description: 'Lighthouse marking Sri Lanka’s northernmost point above the Vadamarachchi coast.',
    featured: true,
  },
  {
    id: 'famous-point-pedro-vallipuram',
    cityId: 'point-pedro',
    name: 'Vallipuram Alvar Kovil',
    category: 'temple',
    lat: 9.783,
    lng: 80.243,
    description:
      'Ancient Vishnu temple linked to one of the earliest inscriptions found on the island.',
    featured: false,
  },
  {
    id: 'famous-kilinochchi-iranamadu',
    cityId: 'kilinochchi',
    name: 'Iranamadu Tank',
    category: 'nature',
    lat: 9.29,
    lng: 80.44,
    description: 'Expansive irrigation reservoir with birdlife and quiet shoreline picnic spots.',
    featured: true,
  },
  {
    id: 'famous-kilinochchi-water-tower',
    cityId: 'kilinochchi',
    name: 'Kilinochchi Fallen Water Tower Memorial',
    category: 'historic',
    lat: 9.3906,
    lng: 80.399,
    description: 'Toppled water tower preserved as a stark memorial of the civil war years.',
    featured: false,
  },
  {
    id: 'famous-mullaitivu-vattappalai',
    cityId: 'mullaitivu',
    name: 'Vattappalai Kannaki Amman Kovil',
    category: 'temple',
    lat: 9.28,
    lng: 80.79,
    description: 'Revered coastal Amman temple famed for its annual Pongal festival.',
    featured: true,
  },
  {
    id: 'famous-mullaitivu-beach',
    cityId: 'mullaitivu',
    name: 'Mullaitivu Beach',
    category: 'nature',
    lat: 9.268,
    lng: 80.816,
    description: 'Long, quiet north-eastern beach with fishing fleets and open horizons.',
    featured: false,
  },
  {
    id: 'famous-vavuniya-madukanda',
    cityId: 'vavuniya',
    name: 'Madukanda Vihara',
    category: 'temple',
    lat: 8.719,
    lng: 80.527,
    description:
      'Ancient temple regarded as a resting place of the Sacred Tooth Relic on its journey to Anuradhapura.',
    featured: true,
  },
  {
    id: 'famous-vavuniya-tank',
    cityId: 'vavuniya',
    name: 'Vavuniya Tank',
    category: 'nature',
    lat: 8.756,
    lng: 80.499,
    description: 'Town reservoir and evening gathering spot with waterbirds and sunset views.',
    featured: false,
  },
  {
    id: 'famous-chavakachcheri-market',
    cityId: 'chavakachcheri',
    name: 'Chavakachcheri Market Square',
    category: 'market',
    lat: 9.657,
    lng: 80.164,
    description: 'Rebuilt market town at the heart of Thenmarachchi’s farming country.',
    featured: false,
  },
  {
    id: 'famous-mannar-baobab',
    cityId: 'mannar',
    name: 'Pallimunai Baobab Tree',
    category: 'nature',
    lat: 8.981,
    lng: 79.912,
    description: 'Massive baobab planted by Arab traders, believed to be over 700 years old.',
    featured: true,
  },
  {
    id: 'famous-mannar-talaimannar',
    cityId: 'mannar',
    name: 'Talaimannar Pier & Adam’s Bridge',
    category: 'viewpoint',
    lat: 9.095,
    lng: 79.729,
    description: 'Historic ferry pier facing the chain of sandbanks stretching toward India.',
    featured: true,
  },
  {
    id: 'famous-mannar-madhu',
    cityId: 'mannar',
    name: 'Shrine of Our Lady of Madhu',
    category: 'temple',
    lat: 8.856,
    lng: 80.207,
    description:
      'Sri Lanka’s holiest Catholic shrine, drawing hundreds of thousands to its August festival.',
    featured: true,
  },

  // Eastern
  {
    id: 'famous-trincomalee-fort-frederick',
    cityId: 'trincomalee',
    name: 'Fort Frederick',
    category: 'historic',
    lat: 8.579,
    lng: 81.242,
    description:
      'Portuguese-Dutch-British fort on Swami Rock, walked through en route to Koneswaram.',
    featured: true,
  },
  {
    id: 'famous-trincomalee-marble-beach',
    cityId: 'trincomalee',
    name: 'Marble Beach',
    category: 'nature',
    lat: 8.5449,
    lng: 81.2226,
    description: 'Sheltered air-force-managed bay with glass-clear water south of Trincomalee.',
    featured: true,
  },
  {
    id: 'famous-kantale-tank',
    cityId: 'kantale',
    name: 'Kantale Tank',
    category: 'nature',
    lat: 8.357,
    lng: 80.994,
    description:
      'Vast ancient reservoir built by King Aggabodhi II, anchoring the Kantale rice country.',
    featured: true,
  },
  {
    id: 'famous-batticaloa-fort',
    cityId: 'batticaloa',
    name: 'Batticaloa Dutch Fort',
    category: 'historic',
    lat: 7.7115,
    lng: 81.6952,
    description:
      '17th-century lagoon-side fort with corner bastions, still housing district offices.',
    featured: true,
  },
  {
    id: 'famous-ampara-deegavapi',
    cityId: 'ampara',
    name: 'Deegavapi Raja Maha Viharaya',
    category: 'temple',
    lat: 7.2903,
    lng: 81.7852,
    description:
      'Sacred ancient stupa in the eastern paddy plains, tied to visits of the Buddha in island lore.',
    featured: true,
  },
  {
    id: 'famous-ampara-gal-oya',
    cityId: 'ampara',
    name: 'Gal Oya National Park (Inginiyagala)',
    category: 'nature',
    lat: 7.222,
    lng: 81.503,
    description: 'Boat safaris on Senanayake Samudraya where elephants swim between islands.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-pottuvil-muhudu',
    cityId: 'pottuvil',
    name: 'Muhudu Maha Viharaya',
    category: 'temple',
    lat: 6.869,
    lng: 81.839,
    description:
      'Beachside ancient temple ruins linked to the legend of Princess Viharamahadevi’s landing.',
    featured: true,
  },
  {
    id: 'famous-pottuvil-lagoon',
    cityId: 'pottuvil',
    name: 'Pottuvil Lagoon Safari',
    category: 'nature',
    lat: 6.883,
    lng: 81.828,
    description: 'Dawn canoe safaris past mangroves with elephants, crocodiles, and shorebirds.',
    featured: false,
  },
  {
    id: 'famous-pottuvil-kudumbigala',
    cityId: 'pottuvil',
    name: 'Kudumbigala Monastery',
    category: 'trail',
    lat: 6.6519,
    lng: 81.7375,
    description:
      'Remote rock hermitage climb with panoramic views over jungle and coastline toward Kumana.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-kalmunai-beach',
    cityId: 'kalmunai',
    name: 'Kalmunai Beach Park',
    category: 'nature',
    lat: 7.41,
    lng: 81.84,
    description: 'Palm-lined urban beach park serving the east coast’s largest town.',
    featured: false,
  },

  // North Western
  {
    id: 'famous-kurunegala-yapahuwa',
    cityId: 'kurunegala',
    name: 'Yapahuwa Rock Fortress',
    category: 'historic',
    lat: 7.8158,
    lng: 80.3103,
    description:
      '13th-century rock citadel with an ornate stone stairway that once housed the Tooth Relic.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-kurunegala-ridi-vihara',
    cityId: 'kurunegala',
    name: 'Ridi Viharaya (Silver Temple)',
    category: 'temple',
    lat: 7.548,
    lng: 80.454,
    description:
      'Cave temple at the site of the silver ore that funded the great Ruwanwelisaya stupa.',
    featured: false,
  },
  {
    id: 'famous-kuliyapitiya-panduwasnuwara',
    cityId: 'kuliyapitiya',
    name: 'Panduwasnuwara Ancient City',
    category: 'historic',
    lat: 7.605,
    lng: 80.098,
    description:
      'Ruins of a 12th-century royal capital of King Parakramabahu I, with moated citadel and monasteries.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-narammala-dambadeniya',
    cityId: 'narammala',
    name: 'Dambadeniya Ancient Kingdom Ruins',
    category: 'historic',
    lat: 7.4258,
    lng: 80.1633,
    description:
      'Rock-top remains of the 13th-century Dambadeniya kingdom and its Tooth Relic temple.',
    featured: true,
  },
  {
    id: 'famous-marawila-beach',
    cityId: 'marawila',
    name: 'Marawila Beach',
    category: 'nature',
    lat: 7.42,
    lng: 79.815,
    description: 'Low-key west coast beach known for fishing catamarans and resort stays.',
    featured: false,
  },
  {
    id: 'famous-puttalam-kalpitiya',
    cityId: 'puttalam',
    name: 'Kalpitiya Peninsula & Dolphin Watching',
    category: 'adventure_stop',
    lat: 8.2295,
    lng: 79.766,
    description: 'Kitesurfing lagoons and boat trips famous for large spinner dolphin pods.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-chilaw-munneswaram',
    cityId: 'chilaw',
    name: 'Munneswaram Temple',
    category: 'temple',
    lat: 7.577,
    lng: 79.817,
    description:
      'One of the five ancient Ishwaram Shiva temples of Sri Lanka, famed for its festivals.',
    featured: true,
  },
  {
    id: 'famous-chilaw-anawilundawa',
    cityId: 'chilaw',
    name: 'Anawilundawa Wetland Sanctuary',
    category: 'nature',
    lat: 7.7075,
    lng: 79.821,
    description:
      'Ramsar-listed cascade of ancient tanks sheltering waterbirds between the sea and coconut lands.',
    featured: true,
  },

  // North Central
  {
    id: 'famous-anuradhapura-isurumuniya',
    cityId: 'anuradhapura',
    name: 'Isurumuniya Viharaya',
    category: 'temple',
    lat: 8.3336,
    lng: 80.3891,
    description:
      'Rock temple beside Tissa Wewa, home of the celebrated “Isurumuniya Lovers” carving.',
    featured: true,
  },
  {
    id: 'famous-polonnaruwa-parakrama',
    cityId: 'polonnaruwa',
    name: 'Parakrama Samudra',
    category: 'nature',
    lat: 7.92,
    lng: 80.99,
    description:
      'The “Sea of Parakrama”, a vast 12th-century reservoir defining the medieval capital.',
    featured: true,
  },
  {
    id: 'famous-kekirawa-avukana',
    cityId: 'kekirawa',
    name: 'Avukana Buddha Statue',
    category: 'historic',
    lat: 8.0089,
    lng: 80.5108,
    description:
      'Majestic 12 m standing Buddha carved from a single granite face in the 5th century.',
    featured: true,
  },
  {
    id: 'famous-kekirawa-kala-wewa',
    cityId: 'kekirawa',
    name: 'Kala Wewa Reservoir',
    category: 'nature',
    lat: 8.03,
    lng: 80.535,
    description:
      'Great tank of King Dhatusena feeding Anuradhapura via the ancient Yoda Ela canal.',
    featured: false,
  },
  {
    id: 'famous-medirigiriya-vatadage',
    cityId: 'medirigiriya',
    name: 'Medirigiriya Vatadage',
    category: 'historic',
    lat: 8.1544,
    lng: 80.9735,
    description:
      'Elegant circular relic shrine on a rock platform, among the finest vatadages surviving.',
    featured: true,
  },
  {
    id: 'famous-habarana-kaudulla',
    cityId: 'habarana',
    name: 'Kaudulla National Park',
    category: 'nature',
    lat: 8.117,
    lng: 80.893,
    description: 'Elephant-gathering park around Kaudulla tank, complementing nearby Minneriya.',
    featured: true,
  },

  // Uva
  {
    id: 'famous-badulla-dunhinda',
    cityId: 'badulla',
    name: 'Dunhinda Falls',
    category: 'waterfall',
    lat: 7.021,
    lng: 81.051,
    description: 'Badulla’s famed “bridal veil” fall, reached by a scenic 1 km jungle footpath.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-badulla-bogoda',
    cityId: 'badulla',
    name: 'Bogoda Wooden Bridge',
    category: 'historic',
    lat: 6.983,
    lng: 80.968,
    description:
      '16th-century roofed wooden bridge, the oldest surviving of its kind in Sri Lanka.',
    featured: false,
  },
  {
    id: 'famous-bandarawela-dowa',
    cityId: 'bandarawela',
    name: 'Dowa Rock Temple',
    category: 'temple',
    lat: 6.85,
    lng: 81.011,
    description: 'Cave temple with an unfinished 12 m Buddha relief carved into the rock face.',
    featured: true,
  },
  {
    id: 'famous-welimada-bomburu-ella',
    cityId: 'welimada',
    name: 'Bomburu Ella Waterfall',
    category: 'waterfall',
    lat: 6.9,
    lng: 80.848,
    description:
      'Wide multi-cascade fall fed by Uva Paranagama springs, reached by an easy forest walk.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-monaragala-maligawila',
    cityId: 'monaragala',
    name: 'Maligawila Buddha Statue',
    category: 'historic',
    lat: 6.727,
    lng: 81.317,
    description:
      'Towering 7th-century limestone Buddha, one of the tallest free-standing ancient statues.',
    featured: true,
  },
  {
    id: 'famous-monaragala-yudaganawa',
    cityId: 'monaragala',
    name: 'Yudaganawa Stupa (Buttala)',
    category: 'historic',
    lat: 6.7583,
    lng: 81.2433,
    description: 'Enormous ancient stupa mound linked to the epic of King Dutugemunu.',
    featured: false,
  },
  {
    id: 'famous-bibile-nilgala',
    cityId: 'bibile',
    name: 'Nilgala Forest Reserve',
    category: 'nature',
    lat: 7.15,
    lng: 81.35,
    description: 'Savannah-like medicinal forest of the Gal Oya foothills, rich in endemic birds.',
    featured: false,
    difficulty: 'moderate',
  },

  // Sabaragamuwa
  {
    id: 'famous-ratnapura-bopath-ella',
    cityId: 'ratnapura',
    name: 'Bopath Ella Falls',
    category: 'waterfall',
    lat: 6.8,
    lng: 80.37,
    description:
      'Perfectly bo-leaf-shaped waterfall at Kuruwita, one of the island’s most photographed.',
    featured: true,
  },
  {
    id: 'famous-ratnapura-saman-devalaya',
    cityId: 'ratnapura',
    name: 'Maha Saman Devalaya',
    category: 'temple',
    lat: 6.704,
    lng: 80.361,
    description:
      'Principal shrine of God Saman, guardian of Adam’s Peak, with a grand September perahera.',
    featured: true,
  },
  {
    id: 'famous-balangoda-belihuloya',
    cityId: 'balangoda',
    name: 'Belihul Oya',
    category: 'nature',
    lat: 6.7167,
    lng: 80.777,
    description:
      'Mountain stream resthold between the hill country and lowlands, ideal for cool dips and walks.',
    featured: true,
  },
  {
    id: 'famous-balangoda-samanalawewa',
    cityId: 'balangoda',
    name: 'Samanalawewa Reservoir Viewpoint',
    category: 'viewpoint',
    lat: 6.671,
    lng: 80.798,
    description: 'Sweeping views over the hydro reservoir cradled by Sabaragamuwa ridges.',
    featured: false,
  },
  {
    id: 'famous-emibilipitiya-udawalawe',
    cityId: 'emibilipitiya',
    name: 'Udawalawe National Park',
    category: 'nature',
    lat: 6.4386,
    lng: 80.8883,
    description: 'Premier elephant-viewing park around the Udawalawe reservoir grasslands.',
    featured: true,
    difficulty: 'moderate',
  },
  {
    id: 'famous-emibilipitiya-transit-home',
    cityId: 'emibilipitiya',
    name: 'Elephant Transit Home (Udawalawe)',
    category: 'nature',
    lat: 6.444,
    lng: 80.858,
    description:
      'Conservation centre rehabilitating orphaned elephant calves, with public feeding viewings.',
    featured: true,
  },
  {
    id: 'famous-mawanella-bible-rock',
    cityId: 'mawanella',
    name: 'Bible Rock (Bathalegala)',
    category: 'trail',
    lat: 7.19,
    lng: 80.444,
    description:
      'Flat-topped rock resembling an open book, a rewarding half-day climb above Mawanella.',
    featured: true,
    difficulty: 'challenging',
  },
  {
    id: 'famous-rambukkana-pinnawala-zoo',
    cityId: 'rambukkana',
    name: 'Pinnawala Open Zoo & Elephant River Bath',
    category: 'nature',
    lat: 7.299,
    lng: 80.387,
    description:
      'Open zoological gardens beside the Ma Oya, where Pinnawala’s elephants bathe daily.',
    featured: true,
  },
];

const CATEGORY_IMAGES: Record<AttractionCategory, string[]> = {
  temple: [images.destinations.temple],
  viewpoint: [images.destinations.sunrise, images.experiences.stargazing],
  waterfall: [images.destinations.waterfall],
  tea_estate: [images.experiences.teaTasting],
  village: [images.destinations.village],
  trail: [images.experiences.natureWalk, images.resort.trail],
  historic: [images.destinations.temple, images.destinations.village],
  market: [images.destinations.village],
  nature: [images.experiences.natureWalk, images.destinations.waterfall],
  education: [images.destinations.village],
  adventure_stop: [images.adventure.trail, images.adventure.lantern],
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function difficultyForDistance(km: number): Destination['difficulty'] {
  if (km <= 3) return 'easy';
  if (km <= 10) return 'moderate';
  return 'challenging';
}

export function buildFamousDestinations(): Destination[] {
  return FAMOUS_SEEDS.map((seed, index) => {
    const city = CITY_BY_ID[seed.cityId];
    if (!city) {
      throw new Error(`Unknown cityId for famous place: ${seed.cityId}`);
    }
    const distanceKm = Math.round(haversineKm(city.lat, city.lng, seed.lat, seed.lng) * 10) / 10;
    const mapPct = toMapPercent(
      seed.lat,
      seed.lng,
      NUGAWELA_CENTRAL_COLLEGE.lat,
      NUGAWELA_CENTRAL_COLLEGE.lng,
      2.5,
    );
    const difficulty = seed.difficulty ?? difficultyForDistance(distanceKm);
    const imagePool = CATEGORY_IMAGES[seed.category];

    return {
      id: seed.id,
      name: seed.name,
      slug: `${slugify(seed.name)}-${seed.cityId}`,
      description: seed.description,
      shortDescription: `${seed.category.replace('_', ' ')} · ${city.name}, ${city.district}`,
      distanceKm,
      travelTimeMinutes: Math.max(10, Math.round(distanceKm * 14 + 8)),
      difficulty,
      category: seed.category,
      accessibility:
        difficulty === 'easy'
          ? 'Generally accessible paths; family-friendly with local guidance.'
          : difficulty === 'moderate'
            ? 'Some uneven terrain; comfortable footwear recommended.'
            : 'Steep, remote, or ticketed summit access; guided visits advised.',
      suggestedVisitDuration:
        difficulty === 'easy' ? '1–2 hours' : difficulty === 'moderate' ? '2–4 hours' : 'Half day+',
      whatToBring: ['Comfortable shoes', 'Water bottle', 'Sun hat', 'Light rain jacket'],
      safetyNotes: [
        'Follow marked paths and local guidance',
        'Daylight visits recommended unless a known night experience',
        'Respect religious sites, wildlife rules, and private property',
      ],
      culturalContext: `A well-known landmark of ${city.name} in ${city.district} District, ${city.province} Province.`,
      isFictionalStory: false,
      images: [imagePool[index % imagePool.length]],
      coordinates: { x: mapPct.x, y: mapPct.y, lat: seed.lat, lng: seed.lng },
      featured: seed.featured ?? false,
      cityId: city.id,
      cityName: city.name,
      district: city.district,
      province: city.province as SriLankaProvince,
      placeKind: 'famous',
    };
  });
}

/**
 * Minimum famous entries per city. Curated real landmarks come first; the
 * remainder are deterministic "local notable" spots (temples, weekly fairs,
 * tanks, viewpoints) generated around each city hub — the same approach used
 * for the 1M+ hidden gems, so no giant literal array is stored.
 */
export const FAMOUS_TARGET_PER_CITY = 100;

const LOCAL_NAME_PART_A = [
  'Uda',
  'Pahala',
  'Meda',
  'Ihala',
  'Kuda',
  'Maha',
  'Diya',
  'Gal',
  'Kiri',
  'Ran',
  'Mal',
  'Kele',
  'Wel',
  'Batu',
  'Kos',
  'Pol',
  'Thal',
  'Nel',
  'Amba',
  'Dodam',
];

const LOCAL_NAME_PART_B = [
  'gama',
  'watta',
  'goda',
  'kanda',
  'wela',
  'pitiya',
  'mulla',
  'deniya',
  'oya',
  'hena',
  'kumbura',
  'landa',
  'thota',
  'gedara',
  'pola',
  'gaha',
];

const HILL_PROVINCES: SriLankaProvince[] = ['Central', 'Uva', 'Sabaragamuwa'];

const LOCAL_CATEGORY_POOL_HILL: AttractionCategory[] = [
  'temple',
  'nature',
  'viewpoint',
  'market',
  'trail',
  'historic',
  'village',
  'waterfall',
  'tea_estate',
  'education',
];

const LOCAL_CATEGORY_POOL_FLAT: AttractionCategory[] = [
  'temple',
  'nature',
  'viewpoint',
  'market',
  'trail',
  'historic',
  'village',
  'education',
];

const LOCAL_SUFFIXES: Record<AttractionCategory, string[]> = {
  temple: ['Purana Viharaya', 'Bodhiya', 'Devalaya', 'Aranya Senasanaya'],
  viewpoint: ['Gala Viewpoint', 'Hilltop Lookout', 'Rock Vista'],
  waterfall: ['Ella', 'Falls', 'Dola Cascade'],
  tea_estate: ['Tea Factory', 'Estate Division', 'Tea Gardens'],
  village: ['Heritage Village', 'Craft Village', 'Farming Hamlet'],
  trail: ['Nature Trail', 'Village Loop', 'Paddy Walk'],
  historic: ['Ambalama', 'Old Bridge', 'Rest House Ruins'],
  market: ['Sathi Pola', 'Town Pola', 'Fruit Stalls'],
  nature: ['Wewa', 'Bird Wetland', 'Riverside Grove'],
  education: ['Maha Vidyalaya', 'Community Library', 'Central College'],
  adventure_stop: ['Waypoint', 'Trail Gate', 'Checkpoint'],
};

const LOCAL_DESCRIPTIONS: Record<AttractionCategory, string> = {
  temple: 'A well-loved neighbourhood temple where locals gather for poya-day observances.',
  viewpoint: 'A favourite local lookout with open views over the surrounding countryside.',
  waterfall: 'A seasonal cascade known mainly to villagers, liveliest after the monsoon rains.',
  tea_estate: 'A working estate stop where visitors can watch plucking rounds and taste fresh tea.',
  village: 'A friendly village cluster known for its crafts, gardens, and unhurried pace.',
  trail: 'A gentle local walking route through paddy fields, groves, and quiet lanes.',
  historic: 'A modest heritage spot that anchors local memory and village festivals.',
  market: 'A lively periodic market where growers sell produce, spices, and street snacks.',
  nature: 'A tranquil natural spot favoured by birdwatchers and evening strollers.',
  education: 'A community institution at the heart of local life and school-day bustle.',
  adventure_stop: 'A mapped waypoint on the island-wide adventure catalog.',
};

function localNotableName(index: number, category: AttractionCategory): string {
  const a = LOCAL_NAME_PART_A[index % LOCAL_NAME_PART_A.length];
  const b =
    LOCAL_NAME_PART_B[Math.floor(index / LOCAL_NAME_PART_A.length) % LOCAL_NAME_PART_B.length];
  const suffix = LOCAL_SUFFIXES[category][index % LOCAL_SUFFIXES[category].length];
  return `${a}${b} ${suffix}`;
}

function buildLocalNotable(city: SriLankaCity, index: number): Destination {
  const pool = HILL_PROVINCES.includes(city.province)
    ? LOCAL_CATEGORY_POOL_HILL
    : LOCAL_CATEGORY_POOL_FLAT;
  const category = pool[index % pool.length];
  const bearing = (index * 137.508 + 61) % 360;
  const distanceKm = Math.min(0.4 + (index % 45) * (city.radiusKm / 52), city.radiusKm);
  const { lat, lng } = offsetLatLng(city.lat, city.lng, distanceKm, bearing);
  const actualKm = Math.round(haversineKm(city.lat, city.lng, lat, lng) * 10) / 10;
  const mapPct = toMapPercent(
    lat,
    lng,
    NUGAWELA_CENTRAL_COLLEGE.lat,
    NUGAWELA_CENTRAL_COLLEGE.lng,
    2.5,
  );
  const name = localNotableName(index, category);
  const difficulty = difficultyForDistance(actualKm);
  const imagePool = CATEGORY_IMAGES[category];
  const id = `famous-${city.id}-local-${index}`;

  return {
    id,
    name: `${name} — ${city.name}`,
    slug: `${slugify(name)}-${city.id}-local-${index}`,
    description: `${LOCAL_DESCRIPTIONS[category]} Located about ${actualKm} km from central ${city.name} in ${city.district} District.`,
    shortDescription: `${category.replace('_', ' ')} · ${city.name}, ${city.district}`,
    distanceKm: actualKm,
    travelTimeMinutes: Math.max(10, Math.round(actualKm * 14 + 8)),
    difficulty,
    category,
    accessibility:
      difficulty === 'easy'
        ? 'Generally accessible paths; family-friendly with local guidance.'
        : difficulty === 'moderate'
          ? 'Some uneven terrain; comfortable footwear recommended.'
          : 'Remote local roads; guided visits advised.',
    suggestedVisitDuration:
      difficulty === 'easy' ? '1–2 hours' : difficulty === 'moderate' ? '2–3 hours' : '3–4 hours',
    whatToBring: ['Comfortable shoes', 'Water bottle', 'Sun hat', 'Light rain jacket'],
    safetyNotes: [
      'Follow marked paths and local guidance',
      'Daylight visits recommended unless a known night experience',
      'Respect religious sites, wildlife rules, and private property',
    ],
    culturalContext: `A locally notable spot around ${city.name} in ${city.district} District, ${city.province} Province — popular with residents and repeat visitors.`,
    isFictionalStory: false,
    images: [imagePool[index % imagePool.length]],
    coordinates: { x: mapPct.x, y: mapPct.y, lat, lng },
    featured: false,
    cityId: city.id,
    cityName: city.name,
    district: city.district,
    province: city.province,
    placeKind: 'famous',
  };
}

/** Tops every city up to FAMOUS_TARGET_PER_CITY famous entries. */
function buildLocalNotables(curated: Destination[]): Destination[] {
  const curatedPerCity = new Map<string, number>();
  for (const dest of curated) {
    curatedPerCity.set(dest.cityId, (curatedPerCity.get(dest.cityId) ?? 0) + 1);
  }

  const extras: Destination[] = [];
  for (const city of SRI_LANKA_CITIES) {
    const need = Math.max(0, FAMOUS_TARGET_PER_CITY - (curatedPerCity.get(city.id) ?? 0));
    for (let i = 0; i < need; i++) {
      extras.push(buildLocalNotable(city, i));
    }
  }
  return extras;
}

const curatedFamousDestinations = buildFamousDestinations();

export const famousDestinations: Destination[] = [
  ...curatedFamousDestinations,
  ...buildLocalNotables(curatedFamousDestinations),
];
