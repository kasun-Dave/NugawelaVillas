# Firebase Integration — Nugawela Escape Resort

This app supports two data backends, switched via `VITE_DATA_SOURCE`:

| Mode | Storage | Firebase loaded? |
|------|---------|------------------|
| `local` (default) | Mock JSON + `localStorage` | **No** — SDK is lazy-loaded only in firebase mode |
| `firebase` | Firebase Auth + Firestore | Yes — on first app boot |

## Quick setup

### 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project (e.g. `nugawela-resort`)
3. Add a **Web app** and copy the config values

### 2. Enable services

- **Authentication** → Sign-in method → Email/Password → Enable
- **Firestore** → Create database → Start in **test mode** (then deploy rules below)

### 3. Configure environment

Copy `.env.example` to `.env`:

```env
VITE_DATA_SOURCE=firebase
VITE_APP_ENV=development

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Deploy Firestore security rules

**Before first app load**, deploy rules (required for auto-seed to work):

```bash
npm run firebase:check          # validate .env
npx firebase-tools login        # once
npx firebase-tools use your-project-id
npm run firebase:deploy-rules
```

Or paste `firestore.rules` into Firebase Console → Firestore → Rules.

> **Note:** The app auto-seeds on first launch by signing in as the demo admin briefly. Rules must be deployed — test mode alone expires after 30 days.

### 5. Run the app

```bash
npm run dev
```

On first launch in firebase mode, the app **auto-seeds** Firestore with rooms, destinations, experiences, adventure codes, and demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Guest | `guest@nugawela.com` | `guest123` |
| Admin | `admin@nugawela.com` | `admin123` |

Adventure code: `NEG-TRAIL01`

## Architecture

```
src/services/
  repository-registry.ts     # Proxy — swaps local vs firebase at boot
  local-registry.ts          # localStorage + mock implementations
  firebase-adapters/         # Firestore + Auth implementations (lazy chunk)
  firebase/
    config.ts                # Firebase app init
    seed.ts                  # First-run Firestore seed
    auth-listener.ts         # onAuthStateChanged → authStore
```

Repository interfaces are unchanged — UI code uses `repositories.*` everywhere.

## Firestore collections

| Collection | Purpose |
|------------|---------|
| `rooms`, `destinations`, `experiences`, `testimonials` | Public content |
| `users`, `guest_profiles` | Auth + profiles |
| `bookings` | Reservations |
| `adventure_progress` | Per-guest trail state (doc id = user uid) |
| `adventure_codes` | Trail activation codes |
| `notifications` | User notifications |
| `newsletter_subscriptions` | Newsletter signups |
| `audit_logs` | Admin audit trail |
| `content_overrides` | Featured toggles |
| `meta/seed` | Seed version marker |

## Performance (lazy loading)

Firebase is **not bundled** when `VITE_DATA_SOURCE=local`. In firebase mode:

- `initializeDataLayer()` dynamically imports `firebase-adapters/registry`
- Vite splits Firebase into a separate chunk (~200KB gzipped)
- Local demo / Netlify deploy stays fast with default `local` mode

## Switching back to local

```env
VITE_DATA_SOURCE=local
```

Rebuild — no Firebase code path runs.

## Production checklist

- [ ] Deploy `firestore.rules` (tighten rules for production)
- [ ] Set Firebase env vars in Netlify/Vercel **before** build
- [ ] Enable App Check (optional, recommended)
- [ ] Remove or change demo passwords in production

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Stuck on "Connecting to Nugawela…" | Check Firebase config env vars and browser console |
| `auth/invalid-credential` | Re-seed: delete `meta/seed` doc in Firestore and reload |
| Permission denied in Firestore | Deploy `firestore.rules` or use test mode temporarily |
| Large bundle | Stay on `local` mode for static demos |
