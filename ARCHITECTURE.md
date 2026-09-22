# Nugawela Escape Resort — Architecture

## Overview

Nugawela Escape Resort is a destination experience platform combining resort booking, local travel guides, and a story-driven scavenger hunt. The application is built as a **local-first** React SPA with mock repositories and localStorage persistence, designed for a future Firebase migration without UI rewrites.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite |
| Styling | Tailwind CSS + design tokens |
| Routing | React Router v6 |
| Server state | TanStack Query |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Motion | Framer Motion |
| Charts | Recharts |
| Unit tests | Vitest + React Testing Library |
| E2E tests | Playwright |

## Architecture Principles

1. **Repository pattern** — All data access goes through typed repository interfaces.
2. **Feature-based modules** — UI and logic grouped by domain feature.
3. **Local-first** — Mock JSON + localStorage until Firebase adapters are wired.
4. **Firebase isolation** — Firebase-specific code lives only in `src/services/firebase-adapters/`.
5. **Progressive enhancement** — Loading, error, empty, and populated states on every data-driven view.

## Folder Structure

```
src/
  app/                    # App shell, providers, error boundaries
  components/
    ui/                   # Reusable primitives (Button, Card, Input, etc.)
    layout/               # Header, Footer, PageLayout
    navigation/           # Nav links, mobile menu
    booking/              # Shared booking widgets
    adventure/            # Shared adventure widgets
    maps/                 # Illustrated map components
  features/
    home/                 # Home page sections
    rooms/                # Room listing and detail
    booking/              # Booking flow
    account/              # User account area
    scavenger-hunt/       # Adventure / scavenger hunt
    destinations/         # Travel destinations guide
    experiences/          # Resort experiences
    stories/              # Story content
    admin/                # Admin portal
    notifications/        # Notification UI
    search/               # Global search
  services/
    repositories/         # Repository interfaces + local implementations
    mock-data/            # JSON seed fixtures
    firebase-adapters/    # Firebase stub adapters (future)
  hooks/                  # Shared custom hooks
  types/                  # Domain TypeScript models
  utils/                  # Pure utility functions
  routes/                 # Route definitions and guards
  styles/                 # Global CSS, tokens, fonts
  test/                   # Test utilities and setup
```

## Data Layer

### Repository Interfaces

Each domain module defines an interface in `src/services/repositories/`:

- `UserRepository`
- `BookingRepository`
- `RoomRepository`
- `DestinationRepository`
- `ExperienceRepository`
- `AdventureRepository`
- `NotificationRepository`
- `AdminRepository`

### Implementations

| Implementation | Purpose |
|----------------|---------|
| `MockRepository` | In-memory data from JSON fixtures |
| `LocalStorageRepository` | Persists mock data mutations to localStorage |
| `FirebaseRepository` (stub) | Future Firestore/Auth integration |

### Service Registry

`src/services/repository-registry.ts` exposes a singleton registry that resolves the active repository implementation based on environment config (`VITE_DATA_SOURCE=local|firebase`).

## State Management

| Concern | Solution |
|---------|----------|
| Server/async data | TanStack Query with repository calls |
| Auth session | Zustand `authStore` |
| UI preferences | Zustand `preferencesStore` |
| Adventure progress | Zustand `adventureStore` + localStorage |
| Form state | React Hook Form |

## Routing

```
/                           Home
/rooms                      Room listing
/rooms/:id                  Room detail
/booking/*                  Booking flow (nested)
/destinations               Destination listing
/destinations/:id           Destination detail
/experiences                Experience listing
/experiences/:id            Experience detail
/adventure                  Adventure landing
/adventure/*                Adventure authenticated routes
/search                     Global search
/account/*                  User account (protected)
/admin/*                    Admin portal (role-protected)
/login, /register           Auth pages
```

Route guards use a permission evaluator that checks roles against route policies.

## Design System

Design tokens are defined in `src/styles/tokens.css` and extended in Tailwind config:

- **Colors**: ivory, mist, forest, charcoal, gold, terracotta
- **Typography**: Editorial serif (Playfair Display) + clean sans (DM Sans)
- **Spacing**: 4px base scale
- **Motion**: Restrained Framer Motion presets

Images are centralized in `src/config/images.ts` — no scattered hardcoded URLs.

## Algorithms (implemented across milestones)

| Algorithm | Location | Milestone |
|-----------|----------|-----------|
| Room availability & pricing | `utils/pricing.ts` | 2 |
| Booking conflict detection | `utils/booking.ts` | 2 |
| Search ranking | `utils/search.ts` | 3 |
| Destination recommendation | `utils/recommendations.ts` | 3 |
| Itinerary optimizer | `utils/itinerary.ts` | 3 |
| Stage unlock state machine | `utils/adventure-unlock.ts` | 5–6 |
| Puzzle validation framework | `utils/puzzle-engine.ts` | 5–6 |
| Permission evaluator | `utils/permissions.ts` | 4 |
| Feature flag evaluator | `utils/feature-flags.ts` | 7 |

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Algorithms, validators, permissions |
| Component | RTL | Forms, filters, modals, adventure UI |
| Integration | Vitest | Repository operations |
| E2E | Playwright | Critical user journeys |

## Security (local mock phase)

- Mock auth with role-based access control
- No real payment processing
- Adventure safety gates enforced in puzzle engine
- Admin routes protected by permission evaluator

## Firebase Migration

See `FIREBASE_MIGRATION.md` for the full migration plan. Key points:

- Repository interfaces remain unchanged
- Swap `LocalStorageRepository` → `FirebaseRepository` in registry
- Auth moves to Firebase Authentication
- Data moves to Firestore collections matching domain models
- Images move to Firebase Storage

## Performance

- Route-level lazy loading via `React.lazy`
- TanStack Query caching with stale-time config
- Skeleton loaders for async content
- Image lazy loading with placeholder gradients
