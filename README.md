# Lanka Horizons

A public Sri Lanka travel discovery platform — destinations, attractions, activities, trails, guides, and travel updates across the island.

## Features

- **Home** — Hero discovery, featured regions, attractions, activities, trails, seasonal tips, updates, and guides
- **Destinations** — Regional overviews (Cultural Triangle, Hill Country, coasts, wildlife circuits, and more)
- **Attractions** — Famous landmarks and city-scoped hidden gems with filters (province, city, category)
- **Explore hubs** — National parks, beaches, wildlife, and heritage views
- **Activities & trails** — Difficulty, season, duration, safety notes, and related places
- **Guides & updates** — Practical articles plus seasonal/festival/advisory notes
- **Search** — Discovery search across regions, attractions, activities, trails, guides, and updates

## Sri Lanka place catalog

| Coverage | Count |
|----------|------:|
| Provinces | 9 |
| Districts | 25 |
| Cities / towns | 89+ |
| Famous places (curated) | 100s |
| Hidden gems (generated slots) | **1,000,000+** |

### How it works

- **Famous places** are curated landmarks (Sigiriya, Galle Fort, Temple of the Tooth, Ella’s Nine Arch Bridge, Yala, and more).
- **Hidden gems** are generated per city hub with deterministic IDs (`gem-{cityId}-{index}`).
- The UI is **city-scoped + paginated**: pick a province/city, then browse famous spots and hidden gems for that hub.

Data lives in:

- `src/services/mock-data/sri-lanka-cities.ts`
- `src/services/mock-data/sri-lanka-famous-places.ts`
- `src/services/mock-data/sri-lanka-place-catalog.ts`
- `src/services/mock-data/travel-*.ts` — regions, activities, trails, guides, updates

## Tech Stack

- React 18 + TypeScript (strict)
- Vite · Tailwind CSS · React Router · TanStack Query · Zustand
- React Hook Form + Zod · Framer Motion
- Vitest + React Testing Library · Playwright E2E

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright) |
| `npm run test:ci` | Typecheck, lint, format, unit tests, build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | Milestone tracker |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Hosting and CI |
| [FIREBASE_MIGRATION.md](./FIREBASE_MIGRATION.md) | Firebase plan |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |

## License

Private — Lanka Horizons.
