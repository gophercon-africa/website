# AGENTS.md - GopherCon Africa Website

## Project Overview

GopherCon Africa conference website built with Next.js 16 (App Router), TypeScript, Prisma (PostgreSQL), Tailwind CSS v4, and NextAuth. Deployed on Vercel.

## Build / Dev / Lint Commands

```bash
npm run dev          # Start dev server (next dev)
npm run build        # Production build (prisma generate + next build --webpack)
npm run lint         # ESLint (next lint)
npm run start        # Start production server
npm run postinstall  # prisma generate (runs automatically)
```

**No test framework is configured.** No test files exist in the project.

### Prisma

```bash
npx prisma generate          # Regenerate client (output: src/generated/prisma)
npx prisma migrate dev        # Run migrations in dev
npx prisma db push            # Push schema without migration
```

Schema: `prisma/schema.prisma`. Client output: `src/generated/prisma/`.

## Project Structure

```
src/
  app/              # Next.js App Router pages and API routes
    api/            # Route handlers (GET/POST with NextRequest/NextResponse)
    [year]/         # Dynamic year routes
    admin/          # Admin dashboard
  actions/          # Server Actions ('use server')
  components/       # React components (organized by feature: hero/, header/, footer/, etc.)
  data/             # Static data
  db/               # Prisma client singleton + queries/
  generated/        # Prisma generated client (DO NOT EDIT)
  lib/              # Shared utilities (auth, config, email, otp, prisma)
  notification/     # Email templates
  pages/            # Page-level components (not Next.js pages dir)
  styles/           # Global CSS
  types/            # TypeScript type definitions
  utils/            # Utility functions
  path.ts           # Centralized route paths
prisma/
  schema.prisma     # Database schema
  migrations/       # Migration files
```

## Path Aliases (tsconfig.json)

```
@/*           → ./*
@components/* → ./src/components/*
@app/*        → ./src/app/*
@actions/*    → ./src/actions/*
@data/*       → ./src/data/*
@types/*      → ./src/types/*
@lib/*        → ./src/lib/*
@utils/*      → ./src/utils/*
@hooks/*      → ./src/hooks/*
@styles/*     → ./src/styles/*
@assets/*     → ./src/assets/*
@config/*     → ./src/config/*
@db/*         → ./prisma/*
@pages/*      → ./src/pages/*
@path         → ./src/path
```

Use these aliases consistently. Prefer `@components/...` over relative `../components/...`.

## Code Style

### TypeScript

- **Strict mode** enabled. Do not use `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Use explicit interface/type definitions in `src/types/` for shared types.
- Use `camelCase` for variables/functions, `PascalCase` for components/interfaces/types.
- Prisma model field names use `PascalCase` for booleans (`IsAccepted`, `IsPendingReview`) - follow this existing convention.

### Components

- One component per file. File name matches component name in PascalCase (`Hero.tsx`, `Footer.tsx`).
- Default exports for page components and layout components.
- Named exports for server actions and utilities.
- Mark client components with `'use client'` directive at top of file.
- Use `lucide-react` for icons, `framer-motion` for animations.
- UI library: `@heroui/react`. Use it for UI primitives where applicable.

### Styling

- **Tailwind CSS v4** via PostCSS (`@tailwindcss/postcss`). No `tailwind.config` file - uses CSS-based config.
- Global styles in `src/styles/globals.css` and `src/app/globals.css`.
- Inline Tailwind classes on elements. No CSS modules.

### Server Actions

- Place in `src/actions/` with `'use server'` directive.
- Validate input with **Zod** schemas defined in the same file.
- Return `{ errors: { field?: string[] } }` shape for form validation.
- Re-export from `src/actions/index.ts` barrel file.

### API Routes

- Use Next.js App Router route handlers in `src/app/api/`.
- Use `NextRequest`/`NextResponse` from `next/server`.
- Authenticate with `getToken` from `next-auth/jwt`.
- Validate request body with Zod.
- Return JSON responses with appropriate HTTP status codes.
- Log errors with `console.error` including the route path.

### Database

- Two Prisma client singletons exist: `src/db/index.ts` (exports `db` and default) and `src/lib/prisma.ts` (exports `prisma`). Prefer `import { db } from '@/src/db'` or `import db from '@/src/db'`.
- Database queries go in `src/db/queries/`.
- Always use the global singleton pattern to prevent connection exhaustion in dev.

### Auth

- NextAuth v4 with JWT strategy and OTP-based credentials provider.
- Auth config in `src/lib/auth.ts`.
- Protected routes check `getToken()` for `email` and `role`.
- Roles: `admin`, `reviewer`.

### Error Handling

- Server actions: return error objects, don't throw.
- API routes: try/catch with `console.error` and JSON error response.
- Use `instanceof Error` checks in catch blocks.

### Imports Order

1. External packages (`react`, `next`, `next-auth`, `zod`, etc.)
2. Path-aliased internal imports (`@components/...`, `@/src/...`)
3. Relative imports (only when alias doesn't exist)

### Forms

- Use `react-hook-form` with `@hookform/resolvers` and `zod`/`yup` for validation.
- Toast notifications via `sonner` (configured in `src/app/providers.tsx`).

## Environment Variables

See `.env.example`. Required:
- `DATABASE_URL` - PostgreSQL connection string
- `RESEND_API_KEY` - Email service
- `REVIEWER_EMAILS`, `ADMIN_EMAILS` - Auth role assignment
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - NextAuth config

## Known Issues

- Build config disables ESLint during build (`.eslintrc.build.json` turns off all rules).

## Deployment

Vercel. CI deploys on GitHub release via `.github/workflows/deploy.yml`. Build command: `npm run build`.
