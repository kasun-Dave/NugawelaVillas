# Contributing to Nugawela Escape Resort

## Development Workflow

1. Review `PROJECT_STATUS.md` to understand the current milestone.
2. Create focused changes aligned with the milestone scope.
3. Run quality checks before submitting:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Code Style

- TypeScript strict mode — no `any` without justification
- Feature-based folder structure (see `ARCHITECTURE.md`)
- Repository pattern for all data access
- Centralized images in `src/config/images.ts`
- Design tokens via Tailwind config and `globals.css`

## Component Guidelines

- Semantic HTML with accessible labels and focus states
- Loading, error, empty, and populated states for data views
- Skeleton loaders for async content
- Framer Motion for restrained transitions only

## Testing

- Unit tests for algorithms and utilities in `src/test/` or co-located `*.test.ts`
- Component tests for forms, modals, and interactive UI
- Integration tests for repository operations

## Commits

Use clear, descriptive commit messages focused on the "why":

```
Add room availability search to hero section

Enable guests to filter rooms by dates and guest count directly from the home page.
```

## Firebase

Do not integrate Firebase during the local-first phase. Repository interfaces and adapter stubs are in place — see `FIREBASE_MIGRATION.md`.
