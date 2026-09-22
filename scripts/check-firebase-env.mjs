/**
 * Validates Firebase env vars before switching to firebase mode.
 * Usage: node scripts/check-firebase-env.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env');

const required = [
  'VITE_DATA_SOURCE',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const recommended = ['VITE_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_MESSAGING_SENDER_ID'];

function parseEnv(text) {
  const env = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = value;
  }
  return env;
}

if (!existsSync(envPath)) {
  console.error('❌ No .env file found.');
  console.error('   Copy .env.example to .env and add your Firebase config.');
  console.error('   See FIREBASE_MIGRATION.md for step-by-step setup.');
  process.exit(1);
}

const env = parseEnv(readFileSync(envPath, 'utf8'));
const missing = required.filter((key) => !env[key] || env[key] === 'your-api-key' || env[key].startsWith('your-'));
const missingRecommended = recommended.filter((key) => !env[key]);

if (env.VITE_DATA_SOURCE !== 'firebase') {
  console.warn('⚠️  VITE_DATA_SOURCE is not "firebase" — app will use local mock data.');
  console.warn('   Set VITE_DATA_SOURCE=firebase in .env to enable Firebase.');
}

if (missing.length) {
  console.error('❌ Missing or placeholder Firebase env vars:');
  missing.forEach((key) => console.error(`   - ${key}`));
  console.error('\nGet values from Firebase Console → Project settings → Your apps → Web app.');
  process.exit(1);
}

console.log('✅ Firebase environment looks good.');
if (missingRecommended.length) {
  console.warn('⚠️  Optional vars not set (usually fine):');
  missingRecommended.forEach((key) => console.warn(`   - ${key}`));
}
console.log(`   Project: ${env.VITE_FIREBASE_PROJECT_ID}`);
console.log('\nNext steps:');
console.log('  1. Enable Email/Password auth in Firebase Console');
console.log('  2. Create Firestore database');
console.log('  3. Deploy rules: npx firebase-tools deploy --only firestore:rules');
console.log('  4. npm run dev — first load auto-seeds demo data');
