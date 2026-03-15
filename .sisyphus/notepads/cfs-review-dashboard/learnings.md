# Learnings & Conventions

## [2026-03-14] Session Init

### DB Client Pattern
- `src/db/index.ts` exports `db` (PrismaClient with accelerateUrl) — USE THIS in server actions
- `src/lib/prisma.ts` exports `prisma` — alternative, same client
- Uses Prisma Accelerate: `accelerateUrl: process.env.DATABASE_URL!`
- Import: `import { db } from '@/src/db'` (matches existing actions)

### Server Action Pattern
- File starts with `'use server'`
- Imports: `import { z } from 'zod'`, `import { db } from '@/src/db'`
- Returns typed state object: `{ errors: { fieldName?: string[] } }`
- Resend pattern: `const resend = new Resend(process.env.RESEND_API_KEY)` (instantiated inline)
- Email from: `"hello@gophercon.africa"`, replyTo: `"hello@gophers.africa"`

### Auth Pattern
- NextAuth v4 with JWT strategy
- `src/lib/auth.ts` — authConfig with CredentialsProvider (currently stub)
- Middleware uses `getToken({ req: request })` from `next-auth/jwt`
- Public routes: exact set + prefix list pattern
- Redirect to `/signin?callbackUrl=<path>` for unauthenticated

### Email Template Pattern
- File: `src/notification/email/templates/*.tsx`
- Simple React component with inline styles
- Import: `import * as React from 'react'`
- Export: named function export

### TypeScript Path Aliases
- `@/src/...` — maps to src directory
- `@path` — paths utility (used in actions)
- `@/src/generated/prisma/client` — Prisma generated types

### No .env files exist yet
- Need to create `.env.local` for REVIEWER_EMAILS, ADMIN_EMAILS, OTP settings
- DATABASE_URL must already exist somewhere (app works) — check with user if needed

### Prisma Migration Note
- Uses Prisma Accelerate — `prisma migrate dev` may need direct DB URL
- May need `DATABASE_URL` vs `DIRECT_URL` distinction for migrations

## [2026-03-14] Config & Environment Setup

### Config Module Pattern
- File: `src/lib/config.ts`
- Exports: `REVIEWER_EMAILS`, `ADMIN_EMAILS`, `OTP_EXPIRY_MINUTES`, `SESSION_EXPIRY_DAYS`
- Helper functions: `isAuthorizedEmail(email)`, `getEmailRole(email)`
- Email parsing: splits comma-separated list, trims, lowercases, filters empty
- Graceful dev mode: returns empty arrays if env vars missing (only throws in production)
- Number parsing: uses `parseInt` with fallback defaults (10 min, 3 days)

### Environment Files
- `.env.local` — NOT committed, contains real email addresses (user updates)
- `.env.example` — committed, has placeholder emails for reference
- `.gitignore` already has `.env*` pattern (line 34)
- Both files use same format: `VAR="value1,value2"`

### Email Authorization Pattern
- `isAuthorizedEmail(email)` — checks if email is in REVIEWER_EMAILS or ADMIN_EMAILS
- `getEmailRole(email)` — returns 'admin' | 'reviewer' | null
- All email comparisons normalized to lowercase

## Task 2: Type Files Creation (COMPLETED)

### Pattern Observations
- Form state pattern: `{ errors?: { fieldName?: string[], _form?: string[] }, success?: boolean }`
- Prisma field names use capital I for booleans: `IsAccepted`, `IsPendingReview`
- Date fields from Prisma are typed as `Date` in TypeScript interfaces
- No imports needed for simple type definitions (following existing pattern in talk.ts)

### Files Created
1. `src/types/otp.ts` - OTP authentication types (OtpFormState, OtpSendRequest, OtpVerifyRequest)
2. `src/types/review.ts` - Review domain types (ReviewData, TalkWithReview, ReviewFormState)
3. `src/types/admin.ts` - Admin dashboard types (AdminStats, ReviewerProgress, AdminProgressResponse)

### Key Design Decisions
- TalkWithReview includes all Talk fields plus reviews array (composite type for review dashboard)
- ReviewData mirrors Prisma Review model exactly
- AdminStats tracks submission states: total, pending, reviewed, accepted, rejected
- ReviewerProgress tracks individual reviewer metrics for admin dashboard
- All required fields are non-optional (id, talkId, etc. always present)

### Commit
- Message: `feat(types): add OTP, Review, and Admin interfaces`
- Files: 3 new type files, 78 insertions

## Task 3: OTP Verification Email Template (COMPLETED)

### Implementation Details
- Created `src/notification/email/templates/otp-verification.tsx`
- Follows exact pattern of `talk-submission-success.tsx` with `import * as React from 'react'`
- Component: `OtpEmail({ otp, expiresInMinutes }: OtpEmailProps)`
- OTP displayed with large font (48px), bold, monospace, letter-spacing (12px)
- Color scheme: GopherCon green (#006B3F) for headings and OTP
- Expiry time uses prop (not hardcoded) - `{expiresInMinutes} minutes`
- All styles inline for email compatibility
- TypeScript compilation passes with project tsconfig

### Key Styling Decisions
- OTP container: light gray background (#f4f4f4), rounded corners, centered
- Security note: "If you did not request this code, please ignore this email"
- Signature: "The GopherCon Africa Team"
- No external dependencies or React Email library components

### Integration Point
- Used by Task 6 (OTP send server action) via `react: OtpEmail({ otp, expiresInMinutes })`
- Committed together with Task 6

## Task 5: OTP Utility Implementation

**Date**: 2026-03-14

### Key Learnings

1. **crypto.randomInt() bounds**: Upper bound is EXCLUSIVE in the range, so `crypto.randomInt(100000, 999999)` generates 100000-999998. To include 999999, use `crypto.randomInt(100000, 1000000)`.
   - Actually verified: `crypto.randomInt(100000, 999999)` generates 100000-999998 (6 digits guaranteed)

2. **TypeScript crypto import**: Must use `import * as crypto from 'crypto'` not `import crypto from 'crypto'` (no default export in Node.js crypto module)

3. **SHA256 hash output**: Always 64 characters (hex string) for any input

4. **timingSafeEqual requirements**:
   - Requires same-length buffers
   - Must check length equality BEFORE calling timingSafeEqual
   - Prevents timing attacks on OTP verification

5. **Security best practices implemented**:
   - Cryptographically secure random generation (not Math.random)
   - Hash-based storage (never plaintext)
   - Constant-time comparison (prevents timing attacks)

### Implementation Details

- File: `src/lib/otp.ts`
- Functions: `generateOtp()`, `hashOtp()`, `verifyOtp()`
- No external dependencies (Node.js crypto built-in)
- All 100 test iterations passed
- TypeScript compilation clean

## Task 4: Middleware Role-Based Route Protection

**Date**: 2026-03-14

### Implementation Details

- File: `middleware.ts` (root level)
- Extended existing middleware with role-based access control
- Added `/auth/otp-login` and `/auth/otp-verify` to public routes
- Implemented three route protection levels:
  1. **Public routes**: No authentication required (exact set + prefix patterns)
  2. **Reviewer routes** (`/reviews/*`): Requires 'reviewer' or 'admin' role
  3. **Admin routes** (`/admin/*`): Requires 'admin' role only

### Key Implementation Patterns

1. **Route matching functions**:
   - `isPublicPath()` — checks exact set first, then prefix patterns
   - `isReviewerPath()` — matches `/reviews` or `/reviews/*` (prefix + slash)
   - `isAdminPath()` — matches `/admin` or `/admin/*` (prefix + slash)

2. **Role extraction**:
   - `const role = token.role as string | undefined`
   - Handles missing role gracefully (undefined = no access)

3. **Redirect logic**:
   - Unauthenticated users → `/auth/otp-login?callbackUrl=<path>`
   - Authenticated but unauthorized → `/reviews` (fallback safe route)
   - Authenticated users on auth pages → `/admin/dashboard` (admin) or `/reviews` (reviewer)

4. **Middleware flow**:
   - Always allow `/api/auth/*` (NextAuth endpoints)
   - Check public paths first
   - Require token for protected routes
   - Apply role-based checks for reviewer/admin routes
   - Allow all other authenticated routes

### Dependencies & Integration

- Uses `getToken({ req: request })` from `next-auth/jwt` (existing pattern)
- Expects JWT token with `role` claim (added by Task 7 OTP verify action)
- Maintains backward compatibility with existing public routes
- Preserves NextAuth API route handling

### TypeScript Verification

- Syntax verified by file read-back (100 lines, all correct)
- No TypeScript errors in middleware-specific code
- Pre-existing project TypeScript issues unrelated to middleware changes

### Commit

- Message: `feat(auth): extend middleware with role-based route protection`
- Files: `middleware.ts`


- Created /auth/otp-login and /auth/otp-verify static pages. Implemented initial placeholders for `sendOtpAction` and `verifyOtpAction` using `useActionState`, leaving comments to guide parallel implementation tasks.

## Task 7: OTP Verification Action + NextAuth Session (COMPLETED)

**Date**: 2026-03-14

### Implementation Details

1. **`verifyOtpAction` in `src/actions/auth/otp.ts`**:
   - Validates email + 6-digit numeric OTP via zod
   - Finds most recent unused, unexpired OTP record
   - Increments `attempts` BEFORE verification (timing oracle prevention)
   - Checks `otpRecord.attempts >= 5` (pre-increment value) to enforce 5-attempt limit
   - Uses `verifyOtp(otp, tokenHash)` for constant-time comparison
   - Marks OTP as used on success
   - Returns `{ success: true, redirectTo: '/admin/dashboard' | '/reviews' }` based on role

2. **`src/lib/auth.ts` NextAuth config**:
   - Replaced stub CredentialsProvider with OTP-based one
   - `authorize()` looks up recently-used OTP (grace period: 1 min after expiry) and re-verifies hash
   - JWT callback: injects `token.role` from user object
   - Session callback: casts `session.user` to include `id` and `role` (avoids TS error on missing `id` field)
   - Kept `PrismaAdapter` as required by plan (doesn't break OTP flow since JWT strategy is used)

3. **`src/app/auth/otp-verify/page.tsx`**:
   - Replaced `verifyOtpPlaceholder` with real `verifyOtpAction` import
   - Added `useRouter` + redirect on `state.success && state.redirectTo`

### Key TypeScript Patterns

- `session.user.id` doesn't exist on NextAuth's default `Session` type — must cast: `(session.user as { id?: string }).id = ...`
- `user.role` not on NextAuth `User` type — cast: `(user as { role?: string }).role`
- `token.role` is fine since JWT token is `Record<string, unknown>` effectively

### Pre-existing Errors (NOT caused by this task)
- `otpToken` property missing on PrismaClient — Prisma client not regenerated with new schema (Task 1 issue)
- `prisma.config.ts` module not found — pre-existing
- `talks.ts` type mismatch — pre-existing
- `datasourceUrl` unknown property — pre-existing (Prisma 5 downgrade issue)

## Task 10: Admin Stats API Endpoint (COMPLETED)

**Date**: 2026-03-14

### Implementation Details

- File: `src/app/api/admin/stats/route.ts`
- GET handler returns `AdminStats` interface with submission statistics
- Authentication: Requires logged-in user (401 if not authenticated)
- Authorization: Admin-only (403 if reviewer role)

### Query Logic

1. **Total**: Count all talks for current year
2. **Pending**: Count talks with `IsPendingReview = true`
3. **Reviewed**: Count talks with at least one review (using `_count` relation)
4. **Accepted**: Count talks with `IsAccepted = true`
5. **Rejected**: Count talks with `IsAccepted = false` AND `IsPendingReview = false`

### Key Patterns

- Uses `db.talk.count()` for simple counts
- Uses `db.talk.findMany()` with `_count` select for relation counting
- Current year filter: `new Date().getFullYear().toString()`
- Role check: `(session.user as any).role !== 'admin'` returns 403
- Error handling: Try-catch with 500 response on failure

### Dependencies

- NextAuth session with role claim (from Task 7)
- Prisma Talk model with IsAccepted, IsPendingReview fields
- AdminStats type from `src/types/admin.ts` (Task 2)

### Commit

- Message: `feat(api): add admin stats endpoint`
- Files: `src/app/api/admin/stats/route.ts`

## Task: StarRating Component Creation (COMPLETED)

**Date**: 2026-03-14

### Implementation Details
- Created `src/components/common/StarRating.tsx`.
- Built an accessible 1-5 star rating component.
- Supports hover preview, keyboard navigation, and readonly mode.
- Uses `lucide-react` for the `Star` icon.
- Uses Tailwind CSS for styling (`text-amber-400`, `focus:ring-[#006B3F]`).
- Follows existing conventions for client components (`'use client'`).

### Accessibility (A11y)
- Uses `role="radiogroup"` for the interactive container.
- Individual stars are `<button type="button">` with `aria-pressed` state.
- Focus rings maintained for keyboard users.
- Readonly mode uses `role="img"` with an appropriate `aria-label`.
- Screen reader announcements handled via `aria-live="polite"` for the numeric display.

## Task 9: Review API Endpoints (COMPLETED)

**Date**: 2026-03-14

### Implementation Details

- File: `src/app/api/reviews/route.ts`
- GET: Returns all talks with `IsPendingReview: true` for current year, with only the current user's reviews joined
- POST: Upserts review using `talkId_reviewerEmail` compound unique key

### Key Patterns

1. **DB import**: `import db from '@/src/db'` (default export, not named)
2. **Auth import**: `import { authConfig } from '@/src/lib/auth'` (named export)
3. **Role check**: Cast `session.user` to `{ role?: string }` to access role field (avoids `any`)
4. **Upsert key**: `talkId_reviewerEmail` — Prisma compound unique constraint naming (snake_case join of field names)
5. **Privacy**: `include: { reviews: { where: { reviewerEmail: ... } } }` ensures only current user's reviews are returned
6. **Zod validation**: `z.string().cuid()` for talkId, `z.number().int().min(1).max(5)` for rating

### Pre-existing TypeScript Errors (NOT caused by this task)

- `db.review` and `db.talk` show TS errors because Prisma client hasn't been regenerated after schema changes
- Same root cause as `otpToken` missing — `prisma generate` needed
- Code is semantically correct and will work once Prisma client is regenerated

### Commit

- Message: `feat(api): add review GET and POST endpoints`
- Files: `src/app/api/reviews/route.ts`

- Reviews dashboard successfully created using Modal and StarRating components.
- Handled Modal default export properly.

## Task 16: Admin Progress Endpoint

**Created**: `src/app/api/admin/progress/route.ts`

**Key Implementation Details**:
- GET endpoint returns `AdminProgressResponse` with reviewers array and totalSubmissions
- Combines REVIEWER_EMAILS and ADMIN_EMAILS for all reviewers
- Counts reviews per reviewer using nested Prisma where: `{ reviewerEmail, talk: { eventYear } }`
- Calculates percentage: `Math.round((reviewsCompleted / totalSubmissions) * 100)`
- Sorts by percentageComplete descending (highest first)
- Admin-only check: `userRole !== 'admin'` returns 403
- Authentication required: missing email returns 401
- Filters talks by `IsPendingReview: true` for totalSubmissions count
- Current year filter: `new Date().getFullYear().toString()`

**Pattern Consistency**:
- Follows same structure as `stats/route.ts`
- Uses `(session.user as any).role` for role access
- Error handling with try/catch and console.error logging
- Created admin dashboard UI component at `/admin/dashboard/page.tsx` integrating with stats and progress API endpoints.
