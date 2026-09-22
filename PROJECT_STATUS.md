# Project Status — Lanka Horizons

Last updated: 2026-08-05

## Product direction

Pivoted from Nugawela Escape Resort booking/adventure product to a **public Sri Lanka travel discovery platform** (Lanka Horizons). Rooms, booking, auth/account, admin, and The Hidden Trail are removed from the public route tree for this phase.

## Milestone Overview

| Milestone | Status | Description |
|-----------|--------|-------------|
| M1–M8 | ✅ Complete | Original resort + adventure product milestones |
| Travel pivot | ✅ Complete | Brand, IA, homepage, content domains, search, cleanup |

## Travel pivot — Completed

- [x] Lanka Horizons branding (header, footer, meta, package name)
- [x] Public IA: destinations, attractions, activities, trails, parks/beaches/wildlife/heritage, guides, updates, about, contact, search
- [x] Legacy redirects (`/rooms` → attractions, `/experiences` → activities, `/adventure` → trails)
- [x] Homepage rebuilt as travel portal
- [x] Travel content mocks + repository (regions, activities, trails, guides, updates)
- [x] Discovery search index (no rooms/bookings)
- [x] Related-content links on detail pages
- [x] README / smoke E2E updated for travel site

## Quality Commands

```bash
npm run test:ci     # Full local CI gate (no E2E)
npm run test:e2e    # Playwright smoke tests
```

## Known Issues

Legacy hotel/adventure modules may still exist in `src/` for local/Firebase adapters but are not routed in the public app.

## Future Enhancements

- Real CMS / Firebase content admin for travel content
- Live weather / park advisories APIs
- Optional saved itinerary in nav
- Expanded E2E coverage for travel flows
