# Deployment Guide — Nugawela Escape Resort

This app is a static Vite + React SPA. Production output lives in `dist/`.

## Prerequisites

- Node.js 20+
- npm 9+

## Local production preview

```bash
npm ci
npm run build
npm run preview
```

Open [http://localhost:4173](http://localhost:4173).

## Environment variables

Copy `.env.example` to `.env` for local development:

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_DATA_SOURCE` | `local` | `local` or `firebase` |
| `VITE_APP_ENV` | `development` | Environment label |
| `VITE_FIREBASE_API_KEY` | — | Required when `firebase` |
| `VITE_FIREBASE_AUTH_DOMAIN` | — | Required when `firebase` |
| `VITE_FIREBASE_PROJECT_ID` | — | Required when `firebase` |
| `VITE_FIREBASE_STORAGE_BUCKET` | — | Recommended |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | — | Recommended |
| `VITE_FIREBASE_APP_ID` | — | Required when `firebase` |

See `FIREBASE_MIGRATION.md` for Firebase setup. Run `npm run firebase:check` to validate your `.env`.

## Static hosting (recommended)

Deploy the `dist/` folder to any static host:

- **Netlify** — build `npm run build`, publish `dist` (see **Quick Netlify deploy** below)
- **Vercel** — connect repo, build command `npm run build`, output `dist`
- **Azure Static Web Apps** — app location `/`, output `dist`
- **AWS S3 + CloudFront** — upload `dist` contents, enable SPA fallback to `index.html`

### Quick Netlify deploy (free)

`netlify.toml` is included. After `npm run build`:

```bash
# One-off deploy (anonymous Netlify Drop — claim within 60 minutes to keep the URL)
npx netlify-cli deploy --prod --dir=dist --allow-anonymous

# Or with a free Netlify account (persistent site, no password)
npx netlify-cli login
npx netlify-cli deploy --prod
```

Anonymous drops show a temporary password (`My-Drop-Site`). Claim the site from the link in the CLI output so it stays live.

Alternatively drag the `dist` folder onto [Netlify Drop](https://app.netlify.com/drop).

### Vercel (free)

```bash
npx vercel login
npx vercel --prod
```

`vercel.json` configures SPA routing and build settings.

### SPA routing

Configure your host to serve `index.html` for unknown paths so React Router works:

```
/*  /index.html  200
```

Netlify: add `public/_redirects` with `/* /index.html 200`  
Vercel: automatic for Vite projects

## CI pipeline

GitHub Actions workflow `.github/workflows/ci.yml` runs on push/PR:

1. Typecheck, ESLint, Prettier, Vitest, production build
2. Playwright E2E smoke tests (Chromium)

Run the same checks locally:

```bash
npm run test:ci        # typecheck, lint, format, unit tests, build
npm run test:e2e       # Playwright (starts dev server automatically)
```

## Pre-deploy checklist

- [ ] `npm run test:ci` passes
- [ ] `npm run test:e2e` passes
- [ ] `.env` production values set on host
- [ ] SPA redirect rules configured
- [ ] Custom domain + HTTPS enabled

## Firebase migration (future)

When `VITE_DATA_SOURCE=firebase`, configure Firebase env vars per `FIREBASE_MIGRATION.md` and rebuild. No hosting change required — still a static SPA.
