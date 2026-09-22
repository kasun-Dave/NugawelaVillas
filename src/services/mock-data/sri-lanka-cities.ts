import type { SriLankaCity } from '@/types';

/**
 * Complete Sri Lanka city/town coverage across all 25 districts.
 * Hidden-gem slot totals are sized so the national catalog exceeds 1,000,000 places.
 */
export const SRI_LANKA_CITIES: SriLankaCity[] = [
  // Western
  { id: 'colombo', name: 'Colombo', district: 'Colombo', province: 'Western', lat: 6.9271, lng: 79.8612, hiddenGemCount: 32000, radiusKm: 18 },
  { id: 'dehiwala', name: 'Dehiwala-Mount Lavinia', district: 'Colombo', province: 'Western', lat: 6.8301, lng: 79.8801, hiddenGemCount: 12000, radiusKm: 10 },
  { id: 'moratuwa', name: 'Moratuwa', district: 'Colombo', province: 'Western', lat: 6.773, lng: 79.8816, hiddenGemCount: 11000, radiusKm: 9 },
  { id: 'kotte', name: 'Sri Jayawardenepura Kotte', district: 'Colombo', province: 'Western', lat: 6.9106, lng: 79.9087, hiddenGemCount: 10000, radiusKm: 8 },
  { id: 'maharagama', name: 'Maharagama', district: 'Colombo', province: 'Western', lat: 6.848, lng: 79.9265, hiddenGemCount: 9000, radiusKm: 8 },
  { id: 'gampaha', name: 'Gampaha', district: 'Gampaha', province: 'Western', lat: 7.0917, lng: 79.999, hiddenGemCount: 14000, radiusKm: 14 },
  { id: 'negombo', name: 'Negombo', district: 'Gampaha', province: 'Western', lat: 7.2083, lng: 79.8358, hiddenGemCount: 16000, radiusKm: 12 },
  { id: 'kelaniya', name: 'Kelaniya', district: 'Gampaha', province: 'Western', lat: 6.9553, lng: 79.922, hiddenGemCount: 9000, radiusKm: 8 },
  { id: 'wattala', name: 'Wattala', district: 'Gampaha', province: 'Western', lat: 6.989, lng: 79.891, hiddenGemCount: 8000, radiusKm: 7 },
  { id: 'ja-ela', name: 'Ja-Ela', district: 'Gampaha', province: 'Western', lat: 7.0742, lng: 79.8919, hiddenGemCount: 8000, radiusKm: 8 },
  { id: 'kalutara', name: 'Kalutara', district: 'Kalutara', province: 'Western', lat: 6.5854, lng: 79.9607, hiddenGemCount: 13000, radiusKm: 12 },
  { id: 'panadura', name: 'Panadura', district: 'Kalutara', province: 'Western', lat: 6.7132, lng: 79.9026, hiddenGemCount: 10000, radiusKm: 9 },
  { id: 'beruwala', name: 'Beruwala', district: 'Kalutara', province: 'Western', lat: 6.4788, lng: 79.9828, hiddenGemCount: 9000, radiusKm: 9 },
  { id: 'bentota', name: 'Bentota', district: 'Kalutara', province: 'Western', lat: 6.4259, lng: 79.9959, hiddenGemCount: 10000, radiusKm: 10 },

  // Central
  { id: 'kandy', name: 'Kandy', district: 'Kandy', province: 'Central', lat: 7.2906, lng: 80.6337, hiddenGemCount: 30000, radiusKm: 16 },
  { id: 'nugawela', name: 'Nugawela / Werallagama', district: 'Kandy', province: 'Central', lat: 7.3263862, lng: 80.5850772, hiddenGemCount: 22000, radiusKm: 14 },
  { id: 'peradeniya', name: 'Peradeniya', district: 'Kandy', province: 'Central', lat: 7.2599, lng: 80.5974, hiddenGemCount: 11000, radiusKm: 9 },
  { id: 'gampola', name: 'Gampola', district: 'Kandy', province: 'Central', lat: 7.1642, lng: 80.5696, hiddenGemCount: 9000, radiusKm: 10 },
  { id: 'katugastota', name: 'Katugastota', district: 'Kandy', province: 'Central', lat: 7.335, lng: 80.621, hiddenGemCount: 8000, radiusKm: 8 },
  { id: 'matale', name: 'Matale', district: 'Matale', province: 'Central', lat: 7.4675, lng: 80.6234, hiddenGemCount: 14000, radiusKm: 14 },
  { id: 'dambulla', name: 'Dambulla', district: 'Matale', province: 'Central', lat: 7.8742, lng: 80.6511, hiddenGemCount: 16000, radiusKm: 16 },
  { id: 'sigiriya', name: 'Sigiriya', district: 'Matale', province: 'Central', lat: 7.957, lng: 80.7603, hiddenGemCount: 14000, radiusKm: 12 },
  { id: 'nuwara-eliya', name: 'Nuwara Eliya', district: 'Nuwara Eliya', province: 'Central', lat: 6.9497, lng: 80.7891, hiddenGemCount: 22000, radiusKm: 16 },
  { id: 'hatton', name: 'Hatton', district: 'Nuwara Eliya', province: 'Central', lat: 6.8916, lng: 80.5956, hiddenGemCount: 11000, radiusKm: 12 },
  { id: 'haputale', name: 'Haputale', district: 'Nuwara Eliya', province: 'Central', lat: 6.765, lng: 80.958, hiddenGemCount: 10000, radiusKm: 11 },

  // Southern
  { id: 'galle', name: 'Galle', district: 'Galle', province: 'Southern', lat: 6.0535, lng: 80.221, hiddenGemCount: 28000, radiusKm: 14 },
  { id: 'hikkaduwa', name: 'Hikkaduwa', district: 'Galle', province: 'Southern', lat: 6.1395, lng: 80.1063, hiddenGemCount: 12000, radiusKm: 10 },
  { id: 'unawatuna', name: 'Unawatuna', district: 'Galle', province: 'Southern', lat: 6.0108, lng: 80.2489, hiddenGemCount: 10000, radiusKm: 8 },
  { id: 'matara', name: 'Matara', district: 'Matara', province: 'Southern', lat: 5.9549, lng: 80.555, hiddenGemCount: 16000, radiusKm: 12 },
  { id: 'mirissa', name: 'Mirissa', district: 'Matara', province: 'Southern', lat: 5.9483, lng: 80.4589, hiddenGemCount: 12000, radiusKm: 9 },
  { id: 'weligama', name: 'Weligama', district: 'Matara', province: 'Southern', lat: 5.975, lng: 80.4297, hiddenGemCount: 10000, radiusKm: 8 },
  { id: 'hambantota', name: 'Hambantota', district: 'Hambantota', province: 'Southern', lat: 6.1244, lng: 81.1185, hiddenGemCount: 14000, radiusKm: 16 },
  { id: 'tangalle', name: 'Tangalle', district: 'Hambantota', province: 'Southern', lat: 6.024, lng: 80.797, hiddenGemCount: 11000, radiusKm: 12 },
  { id: 'tissamaharama', name: 'Tissamaharama', district: 'Hambantota', province: 'Southern', lat: 6.2792, lng: 81.2875, hiddenGemCount: 12000, radiusKm: 14 },

  // Northern
  { id: 'jaffna', name: 'Jaffna', district: 'Jaffna', province: 'Northern', lat: 9.6615, lng: 80.0255, hiddenGemCount: 20000, radiusKm: 16 },
  { id: 'nallur', name: 'Nallur', district: 'Jaffna', province: 'Northern', lat: 9.674, lng: 80.035, hiddenGemCount: 8000, radiusKm: 6 },
  { id: 'point-pedro', name: 'Point Pedro', district: 'Jaffna', province: 'Northern', lat: 9.8167, lng: 80.2333, hiddenGemCount: 7000, radiusKm: 10 },
  { id: 'kilinochchi', name: 'Kilinochchi', district: 'Kilinochchi', province: 'Northern', lat: 9.3803, lng: 80.377, hiddenGemCount: 9000, radiusKm: 14 },
  { id: 'mannar', name: 'Mannar', district: 'Mannar', province: 'Northern', lat: 8.977, lng: 79.904, hiddenGemCount: 9000, radiusKm: 14 },
  { id: 'mullaitivu', name: 'Mullaitivu', district: 'Mullaitivu', province: 'Northern', lat: 9.267, lng: 80.814, hiddenGemCount: 8000, radiusKm: 14 },
  { id: 'vavuniya', name: 'Vavuniya', district: 'Vavuniya', province: 'Northern', lat: 8.7514, lng: 80.4971, hiddenGemCount: 10000, radiusKm: 14 },

  // Eastern
  { id: 'trincomalee', name: 'Trincomalee', district: 'Trincomalee', province: 'Eastern', lat: 8.5874, lng: 81.2152, hiddenGemCount: 18000, radiusKm: 16 },
  { id: 'nilaveli', name: 'Nilaveli', district: 'Trincomalee', province: 'Eastern', lat: 8.692, lng: 81.188, hiddenGemCount: 9000, radiusKm: 10 },
  { id: 'batticaloa', name: 'Batticaloa', district: 'Batticaloa', province: 'Eastern', lat: 7.7102, lng: 81.6924, hiddenGemCount: 15000, radiusKm: 14 },
  { id: 'ampara', name: 'Ampara', district: 'Ampara', province: 'Eastern', lat: 7.2911, lng: 81.672, hiddenGemCount: 11000, radiusKm: 14 },
  { id: 'arugam-bay', name: 'Arugam Bay', district: 'Ampara', province: 'Eastern', lat: 6.8404, lng: 81.8363, hiddenGemCount: 12000, radiusKm: 12 },
  { id: 'pottuvil', name: 'Pottuvil', district: 'Ampara', province: 'Eastern', lat: 6.876, lng: 81.833, hiddenGemCount: 7000, radiusKm: 10 },

  // North Western
  { id: 'kurunegala', name: 'Kurunegala', district: 'Kurunegala', province: 'North Western', lat: 7.4818, lng: 80.3609, hiddenGemCount: 15000, radiusKm: 16 },
  { id: 'puttalam', name: 'Puttalam', district: 'Puttalam', province: 'North Western', lat: 8.0362, lng: 79.8283, hiddenGemCount: 12000, radiusKm: 16 },
  { id: 'chilaw', name: 'Chilaw', district: 'Puttalam', province: 'North Western', lat: 7.5758, lng: 79.7953, hiddenGemCount: 9000, radiusKm: 12 },
  { id: 'kuliyapitiya', name: 'Kuliyapitiya', district: 'Kurunegala', province: 'North Western', lat: 7.468, lng: 80.045, hiddenGemCount: 7000, radiusKm: 10 },

  // North Central
  { id: 'anuradhapura', name: 'Anuradhapura', district: 'Anuradhapura', province: 'North Central', lat: 8.3114, lng: 80.4037, hiddenGemCount: 22000, radiusKm: 18 },
  { id: 'mihintale', name: 'Mihintale', district: 'Anuradhapura', province: 'North Central', lat: 8.3505, lng: 80.505, hiddenGemCount: 9000, radiusKm: 10 },
  { id: 'polonnaruwa', name: 'Polonnaruwa', district: 'Polonnaruwa', province: 'North Central', lat: 7.9403, lng: 81.0188, hiddenGemCount: 18000, radiusKm: 16 },
  { id: 'habarana', name: 'Habarana', district: 'Polonnaruwa', province: 'North Central', lat: 8.036, lng: 80.751, hiddenGemCount: 10000, radiusKm: 12 },

  // Uva
  { id: 'badulla', name: 'Badulla', district: 'Badulla', province: 'Uva', lat: 6.9934, lng: 81.055, hiddenGemCount: 14000, radiusKm: 14 },
  { id: 'ella', name: 'Ella', district: 'Badulla', province: 'Uva', lat: 6.8667, lng: 81.0466, hiddenGemCount: 20000, radiusKm: 12 },
  { id: 'bandarawela', name: 'Bandarawela', district: 'Badulla', province: 'Uva', lat: 6.829, lng: 80.989, hiddenGemCount: 10000, radiusKm: 10 },
  { id: 'monaragala', name: 'Monaragala', district: 'Monaragala', province: 'Uva', lat: 6.8728, lng: 81.3507, hiddenGemCount: 11000, radiusKm: 16 },
  { id: 'kataragama', name: 'Kataragama', district: 'Monaragala', province: 'Uva', lat: 6.4135, lng: 81.3327, hiddenGemCount: 12000, radiusKm: 12 },
  { id: 'wellawaya', name: 'Wellawaya', district: 'Monaragala', province: 'Uva', lat: 6.733, lng: 81.1, hiddenGemCount: 8000, radiusKm: 12 },

  // Sabaragamuwa
  { id: 'ratnapura', name: 'Ratnapura', district: 'Ratnapura', province: 'Sabaragamuwa', lat: 6.7056, lng: 80.3847, hiddenGemCount: 16000, radiusKm: 16 },
  { id: 'balangoda', name: 'Balangoda', district: 'Ratnapura', province: 'Sabaragamuwa', lat: 6.65, lng: 80.7, hiddenGemCount: 9000, radiusKm: 12 },
  { id: 'kegalle', name: 'Kegalle', district: 'Kegalle', province: 'Sabaragamuwa', lat: 7.2513, lng: 80.3464, hiddenGemCount: 13000, radiusKm: 14 },
  { id: 'kitulgala', name: 'Kitulgala', district: 'Kegalle', province: 'Sabaragamuwa', lat: 6.990, lng: 80.411, hiddenGemCount: 11000, radiusKm: 12 },
  { id: 'avissawella', name: 'Avissawella', district: 'Colombo', province: 'Western', lat: 6.953, lng: 80.211, hiddenGemCount: 8000, radiusKm: 10 },

  // Additional district coverage towns
  { id: 'horana', name: 'Horana', district: 'Kalutara', province: 'Western', lat: 6.715, lng: 80.061, hiddenGemCount: 7000, radiusKm: 10 },
  { id: 'kadugannawa', name: 'Kadugannawa', district: 'Kandy', province: 'Central', lat: 7.254, lng: 80.522, hiddenGemCount: 7000, radiusKm: 8 },
  { id: 'nalanda', name: 'Nalanda', district: 'Matale', province: 'Central', lat: 7.672, lng: 80.635, hiddenGemCount: 6000, radiusKm: 10 },
  { id: 'ambalangoda', name: 'Ambalangoda', district: 'Galle', province: 'Southern', lat: 6.235, lng: 80.054, hiddenGemCount: 8000, radiusKm: 9 },
  { id: 'ahangama', name: 'Ahangama', district: 'Galle', province: 'Southern', lat: 5.971, lng: 80.391, hiddenGemCount: 7000, radiusKm: 8 },
  { id: 'dikwella', name: 'Dikwella', district: 'Matara', province: 'Southern', lat: 5.966, lng: 80.695, hiddenGemCount: 7000, radiusKm: 9 },
  { id: 'yala-edge', name: 'Yala Gateway', district: 'Hambantota', province: 'Southern', lat: 6.372, lng: 81.518, hiddenGemCount: 9000, radiusKm: 14 },
  { id: 'chavakachcheri', name: 'Chavakachcheri', district: 'Jaffna', province: 'Northern', lat: 9.661, lng: 80.165, hiddenGemCount: 6000, radiusKm: 9 },
  { id: 'kantale', name: 'Kantale', district: 'Trincomalee', province: 'Eastern', lat: 8.358, lng: 80.999, hiddenGemCount: 7000, radiusKm: 12 },
  { id: 'kalmunai', name: 'Kalmunai', district: 'Ampara', province: 'Eastern', lat: 7.409, lng: 81.835, hiddenGemCount: 8000, radiusKm: 10 },
  { id: 'passikudah', name: 'Passikudah', district: 'Batticaloa', province: 'Eastern', lat: 7.923, lng: 81.565, hiddenGemCount: 8000, radiusKm: 9 },
  { id: 'narammala', name: 'Narammala', district: 'Kurunegala', province: 'North Western', lat: 7.432, lng: 80.216, hiddenGemCount: 6000, radiusKm: 10 },
  { id: 'marawila', name: 'Marawila', district: 'Puttalam', province: 'North Western', lat: 7.42, lng: 79.83, hiddenGemCount: 7000, radiusKm: 9 },
  { id: 'kekirawa', name: 'Kekirawa', district: 'Anuradhapura', province: 'North Central', lat: 8.036, lng: 80.586, hiddenGemCount: 7000, radiusKm: 12 },
  { id: 'medirigiriya', name: 'Medirigiriya', district: 'Polonnaruwa', province: 'North Central', lat: 8.14, lng: 80.97, hiddenGemCount: 6000, radiusKm: 12 },
  { id: 'welimada', name: 'Welimada', district: 'Badulla', province: 'Uva', lat: 6.901, lng: 80.906, hiddenGemCount: 7000, radiusKm: 10 },
  { id: 'bibile', name: 'Bibile', district: 'Monaragala', province: 'Uva', lat: 7.158, lng: 81.227, hiddenGemCount: 6000, radiusKm: 12 },
  { id: 'emibilipitiya', name: 'Embilipitiya', district: 'Ratnapura', province: 'Sabaragamuwa', lat: 6.343, lng: 80.849, hiddenGemCount: 8000, radiusKm: 12 },
  { id: 'mawanella', name: 'Mawanella', district: 'Kegalle', province: 'Sabaragamuwa', lat: 7.253, lng: 80.446, hiddenGemCount: 7000, radiusKm: 10 },
  { id: 'rambukkana', name: 'Rambukkana', district: 'Kegalle', province: 'Sabaragamuwa', lat: 7.321, lng: 80.396, hiddenGemCount: 6000, radiusKm: 9 },
  { id: 'wadduwa', name: 'Wadduwa', district: 'Kalutara', province: 'Western', lat: 6.636, lng: 79.928, hiddenGemCount: 7000, radiusKm: 8 },
  { id: 'minuwangoda', name: 'Minuwangoda', district: 'Gampaha', province: 'Western', lat: 7.173, lng: 79.953, hiddenGemCount: 7000, radiusKm: 9 },
  { id: 'piliyandala', name: 'Piliyandala', district: 'Colombo', province: 'Western', lat: 6.801, lng: 79.922, hiddenGemCount: 7000, radiusKm: 7 },
];

export const CITY_BY_ID: Record<string, SriLankaCity> = Object.fromEntries(
  SRI_LANKA_CITIES.map((city) => [city.id, city]),
);

export function getCitiesByProvince(province: string): SriLankaCity[] {
  return SRI_LANKA_CITIES.filter((c) => c.province === province);
}

export function getDistricts(): string[] {
  return [...new Set(SRI_LANKA_CITIES.map((c) => c.district))].sort();
}

export function getProvinces(): string[] {
  return [...new Set(SRI_LANKA_CITIES.map((c) => c.province))];
}

export function getTotalHiddenGemSlots(): number {
  return SRI_LANKA_CITIES.reduce((sum, city) => sum + city.hiddenGemCount, 0);
}
