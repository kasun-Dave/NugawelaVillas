/**
 * Write .env from Firebase web app config (paste from Firebase Console).
 * Usage:
 *   node scripts/write-firebase-env.mjs --from-json '{"apiKey":"...","authDomain":"...",...}'
 * Or set env vars and run without args.
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function fromArgs() {
  const args = process.argv.slice(2);
  const map = {};
  for (const arg of args) {
    if (arg.startsWith('--from-json=')) {
      return JSON.parse(arg.slice('--from-json='.length));
    }
    const m = arg.match(/^--([^=]+)=(.*)$/);
    if (m) map[m[1]] = m[2];
  }
  if (!map.apiKey) return null;
  return {
    apiKey: map.apiKey,
    authDomain: map.authDomain,
    projectId: map.projectId,
    storageBucket: map.storageBucket,
    messagingSenderId: map.messagingSenderId,
    appId: map.appId,
  };
}

const config = fromArgs() ?? {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missing = required.filter((k) => !config[k]);
if (missing.length) {
  console.error('Missing:', missing.join(', '));
  console.error(
    'Paste your Firebase web config JSON from Console → Project settings → Your apps:',
  );
  console.error(
    '  node scripts/write-firebase-env.mjs --from-json=\'{"apiKey":"...","authDomain":"...",...}\'',
  );
  process.exit(1);
}

const env = `# Firebase — written by scripts/write-firebase-env.mjs
VITE_DATA_SOURCE=firebase
VITE_APP_ENV=development

VITE_FIREBASE_API_KEY=${config.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}
VITE_FIREBASE_PROJECT_ID=${config.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket ?? `${config.projectId}.appspot.com`}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId ?? ''}
VITE_FIREBASE_APP_ID=${config.appId}
`;

writeFileSync(resolve(root, '.env'), env);
writeFileSync(
  resolve(root, '.firebaserc'),
  JSON.stringify({ projects: { default: config.projectId } }, null, 2) + '\n',
);

console.log('✅ Wrote .env and .firebaserc for project:', config.projectId);
console.log('Next: npm run firebase:deploy-rules  (after firebase login)');
console.log('Then: npm run dev');
