# CLAUDE.md

Guidance for working in this repo. Keep it short; update it when a convention changes.

## Stack
- **Next.js 16 (App Router)** + React 19, TypeScript.
- **Tailwind CSS v4** — CSS-based config in `src/styles/globals.css` (no `tailwind.config`). Theme tokens and the `@custom-variant dark` live there.
- **Prisma + PostgreSQL**. Client is generated to **`src/generated/prisma`** (not the default location); import the shared instance from `@/src/db`.
- **NextAuth (v4)** with a Credentials/OTP flow; **Resend** for transactional email.

## Commands
- `npm run dev` — dev server on :3000.
- `npm run build` — runs `prisma generate` then `next build` (webpack). Next 16 does **not** lint during builds.
- `npm run lint` — runs `eslint .` directly (`next lint` was removed in Next 16); flat config in `eslint.config.mjs` uses `eslint-config-next`'s native flat exports (no FlatCompat). `npx tsc --noEmit` for type-checking.
- `npm run test` — vitest (pinned to v3: v4's rolldown needs `util.styleText`, missing on the Node 21.1 dev box). Route tests live next to the route as `route.test.ts`; mock `next-auth/jwt` and `@/src/db`.
- Commit **both** `package-lock.json` **and** `yarn.lock` — the repo maintains both lockfiles in tandem (prior commits touch them together). There's no `packageManager` field; dev has used npm.

## Auth & route protection
- Sign-in is **OTP over email**: `src/actions/auth/otp.ts` emails a code (from `hello@gophercon.africa`), verified in `src/lib/auth.ts` (`authorize`). JWT sessions.
- Route gating is in **`src/middleware.ts`** (Next middleware — kept as `middleware.ts`, not `proxy.ts`, because Next 16 forces proxy files onto the Node runtime, which the Cloudflare OpenNext adapter can't run): public routes are allowlisted; `/reviews` requires `role === 'reviewer'` or `token.isReviewer`; `/admin` requires `role === 'admin'`.
- Roles/authorized users: `AuthorizedUser` table + `src/lib/config.ts` env fallbacks (`REVIEWER_EMAILS`, `ADMIN_EMAILS`).
- To exercise gated pages locally without email, mint a `next-auth.session-token` JWT with `NEXTAUTH_SECRET` (see the "Local testing" note below).

## Review / admin data model
- Submissions are the **`Talk`** model; reviews are **`Review`** (unique per `talkId`+`reviewerEmail`).
- The review queue (`src/app/api/reviews/route.ts`) and admin (`src/app/api/admin/submissions/route.ts`) filter by **`eventYear === currentYear`** and (for the queue) **`IsPendingReview === true`**. Seed/test rows must set both to show up.

## Conventions (don't break these)
- **Dark mode is global.** It covers the marketing content pages *and* `/admin`/`/reviews`. Provider in `src/app/providers.tsx` (`next-themes`, `attribute="class"`, `defaultTheme="system"`, `enableColorScheme`). The `.dark` class is global on `<html>`; a `.dark { }` block in `globals.css` redefines the semantic-neutral tokens (surface/ink/body/muted/faint/line/brand-tint), so any component built on tokens themes automatically. Brand greens are constant across themes.
  - **Prefer semantic tokens** (`bg-surface`, `text-ink`, `border-line`, …) so a component flips for free. Add explicit `dark:` variants only where a raw color is unavoidable — e.g. sponsor tiles stay `bg-white` in both themes so logos don't vanish, and `Badge` neutral/brand tones carry `dark:` text overrides.
  - The global light/dark/system switcher is `components/theme/ThemeToggle.tsx`, rendered in the header on every route. `Header`/`Modal` are token-based and no longer route-gate their dark styles.
  - Dark mode now covers **all** marketing pages, including the auth pages and the `/call-for-speakers` form (migrated to tokens). Green *text* on dark needs `dark:text-brand-bright`; dark-inked logo/icon assets get an interim `dark:brightness-0 dark:invert` (wordmark) / `dark:invert` (black X icon) until reversed assets exist.
- **Workspace scroll** (`src/app/reviews/[talkId]/ReviewWorkspaceClient.tsx` and `src/app/admin/selection/[talkId]/page.tsx`): the page adds `.review-workspace-lock` to `<body>` on mount (rule in `globals.css`) to cap the body to viewport height so the main column and sidebar list scroll independently. **Do not** replace this with a `calc(100dvh - <header>)` — the header height isn't constant (the logo renders anywhere from ~82px to ~208px depending on load state). Talk navigation resets the main column to the top; the sidebar scroll position is preserved on purpose.

## Gotchas
- The Tawk.to chat widget (`src/components/TawkController.tsx`) only loads on the landing page at the production host (`gophercon.africa`) — never locally. Where it does load, its open socket means headless-browser `waitUntil: 'networkidle0'` never settles — use `'domcontentloaded'`.
- `src/lib/email.ts` is a placeholder; real sends go through Resend in the server actions.
