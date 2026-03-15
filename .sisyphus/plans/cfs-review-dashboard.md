# CFS Review Dashboard with OTP Authentication

## TL;DR

> **Quick Summary**: Build a two-part review system for CFS submissions: (1) reviewer dashboard where all reviewers rate all submissions 1-5 with private notes, (2) admin dashboard showing submission stats and reviewer progress. Authentication via OTP (email-based, no passwords).
> 
> **Deliverables**:
> - OTP authentication system (10min validity, 3-day sessions, hardcoded reviewer/admin lists)
> - Reviewer dashboard (/reviews) with submission list, rating interface, progress tracking
> - Admin dashboard (/admin/dashboard) with submission stats and reviewer activity metrics
> - New Prisma models (OtpToken, Review) and API routes
> - Email templates for OTP delivery via Resend
> 
> **Estimated Effort**: Large (18-22 tasks across 4 waves)
> **Parallel Execution**: YES - 4 waves with up to 6 parallel tasks per wave
> **Critical Path**: Prisma schema → OTP auth → Review API → UI components → Integration

---

## Context

### Original Request
User has a CFS (Call for Speakers) form accepting talk submissions stored in a `Talk` model (14 fields: speaker info, talk details, flags for IsAccepted/IsPendingReview). Wants a simple review dashboard similar to Sessionize but for internal use only.

### Interview Summary
**Key Discussions**:
- **Review workflow**: All reviewers review all submissions (free-for-all, not assigned). Rating scale 1-5 + private committee notes.
- **Admin needs**: Primary view = submission stats (total, pending, reviewed, accepted, rejected). Secondary action = view reviewer progress.
- **OTP auth**: 10min validity, 3-day session, two separate hardcoded email lists (reviewers vs admins), 6-digit numeric codes.
- **Permissions**: All submission info visible to reviewers. No status modifications (IsAccepted/IsPendingReview remain read-only). Submissions read-only.
- **Scope boundaries**: Explicitly exclude assignment automation, real-time notifications, submission editing, public results page, advanced analytics, calendar integration.

**Research Findings**:
- **OTP security**: Use `crypto.randomInt(100000, 999999)`, store SHA256 hash (not plaintext), `crypto.timingSafeEqual` for verification, rate limit (1min cooldown + 5/hour max + 5 attempts per OTP).
- **Review UX patterns**: Split pending/completed tables, star ratings with hover preview, per-row save buttons, progress bars with ARIA, color-coded admin badges.
- **Codebase conventions**: Next.js 16 App Router, server actions + `useActionState` + Zod validation, Sonner toasts, Tailwind #006B3F primary color, Modal/FormError/ToastWrapper reusables.
- **Test infrastructure**: NONE exists (no Jest/Vitest) → rely on agent-executed QA scenarios for verification.

---

## Work Objectives

### Core Objective
Build a secure, simple review dashboard that allows committee members to rate CFS submissions and admins to track review progress, authenticated via OTP email codes.

### Concrete Deliverables
- **OTP Auth System**: `/auth/otp-login` and `/auth/otp-verify` pages, server actions for send/verify, OtpToken Prisma model, email templates
- **Reviewer Dashboard**: `/reviews` page with pending/completed tables, star rating component, notes textarea, save functionality
- **Admin Dashboard**: `/admin/dashboard` page with submission stats cards, reviewer progress table, filtering by status/category
- **API Routes**: `/api/auth/otp/send`, `/api/auth/otp/verify`, `/api/reviews` (GET/POST), `/api/admin/stats`, `/api/admin/progress`
- **Prisma Models**: `OtpToken` (id, email, tokenHash, expiresAt, attempts, used, role), `Review` (id, talkId, reviewerEmail, rating, notes, createdAt, updatedAt) with unique constraint on [talkId, reviewerEmail]
- **Middleware Extension**: Role-based route protection for /reviews (reviewers) and /admin/* (admins)

### Definition of Done
- [ ] OTP codes sent to hardcoded emails are received and successfully authenticate users
- [ ] Reviewers can view all submissions, rate them 1-5, add private notes, and see progress
- [ ] Admins can view submission stats (total, pending, reviewed) and per-reviewer progress
- [ ] All routes protected by role-based middleware (reviewers can't access /admin/*, admins can access everything)
- [ ] Sessions expire after 3 days and OTPs expire after 10 minutes
- [ ] Rate limiting prevents OTP spam (1min cooldown, 5/hour max, 5 attempts/OTP)

### Must Have
- OTP generation using `crypto.randomInt`, storage as SHA256 hash, constant-time verification
- Hardcoded email lists in environment variables or config file (reviewers vs admins)
- Review model with unique constraint (one review per reviewer per submission)
- Split tables for pending/completed reviews on reviewer dashboard
- Submission stats cards on admin dashboard
- Star rating component (1-5) with hover preview and numeric label
- Toast notifications for success/error states
- Responsive design (mobile-friendly tables/cards)

### Must NOT Have (Guardrails)
- **No password-based auth** — OTP only, no username/password storage
- **No automatic reviewer assignment** — all reviewers see all submissions
- **No real-time notifications** — email is sufficient
- **No submission editing** — Talk model data is read-only for reviewers/admins
- **No status modifications** — IsAccepted/IsPendingReview flags cannot be changed via this dashboard
- **No public-facing pages** — all routes require authentication
- **No complex analytics** — stick to basic counts and progress percentages
- **No AI slop patterns** — avoid over-abstraction, excessive comments, generic variable names (data/result/item)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (no Jest/Vitest in package.json)
- **Automated tests**: NO (MVP focus — defer to future initiative)
- **Framework**: N/A
- **Agent-Executed QA**: YES (mandatory for all tasks)

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use `playwright` skill — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **OTP Flow**: Use Playwright for form interaction + Bash for email verification (check Resend logs or mock)

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.

```
Wave 1 (Foundation — database + config):
├── Task 1: Prisma schema extension (OtpToken + Review models) [quick]
├── Task 2: Environment config (hardcoded email lists, OTP settings) [quick]
├── Task 3: Shared TypeScript types (OtpTokenData, ReviewData, AdminStats) [quick]
└── Task 4: Email templates for OTP (React Email component) [quick]

Wave 2 (OTP Auth System — 6 parallel):
├── Task 5: OTP generation utility (crypto.randomInt + SHA256 hash) [quick]
├── Task 6: OTP send server action (rate limit + DB insert + Resend email) [unspecified-high]
├── Task 7: OTP verify server action (constant-time compare + session create) [unspecified-high]
├── Task 8: /auth/otp-login page (email input form) [visual-engineering]
├── Task 9: /auth/otp-verify page (6-digit code input) [visual-engineering]
└── Task 10: Middleware extension (role-based route protection) [quick]

Wave 3 (Review System — API + Components — 6 parallel):
├── Task 11: Star rating component (1-5 with hover, ARIA) [visual-engineering]
├── Task 12: Review API routes (GET all reviews, POST review) [unspecified-high]
├── Task 13: Reviewer dashboard page skeleton (/reviews layout) [visual-engineering]
├── Task 14: Pending reviews table component [visual-engineering]
├── Task 15: Review detail modal (submission info + rating form) [visual-engineering]
└── Task 16: Admin stats API route (/api/admin/stats) [quick]

Wave 4 (Admin Dashboard + Integration — 4 parallel):
├── Task 17: Admin dashboard page (/admin/dashboard layout) [visual-engineering]
├── Task 18: Submission stats cards component [visual-engineering]
├── Task 19: Reviewer progress table component [visual-engineering]
└── Task 20: Admin progress API route (/api/admin/progress) [quick]

Wave FINAL (Verification — 3 parallel):
├── Task F1: End-to-end OTP flow QA (Playwright) [unspecified-high]
├── Task F2: Review workflow QA (Playwright) [unspecified-high]
└── Task F3: Admin dashboard QA (Playwright + curl) [unspecified-high]
```

**Critical Path**: Task 1 → Task 5 → Task 6 → Task 12 → Task 15 → F2
**Parallel Speedup**: ~60% faster than sequential
**Max Concurrent**: 6 (Waves 2 & 3)

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

- [x] 1. Prisma Schema Extension (OtpToken + Review Models)

  **What to do**:
  - Add `OtpToken` model: id (String, cuid), email (String), tokenHash (String), expiresAt (DateTime), attempts (Int, default 0), used (Boolean, default false), role (String: 'reviewer'|'admin'), createdAt (DateTime, default now())
  - Add indexes: @@index([email]), @@index([tokenHash])
  - Add `Review` model: id (String, cuid), talkId (String), reviewerEmail (String), rating (Int), notes (String), createdAt (DateTime, default now()), updatedAt (DateTime, updatedAt)
  - Add relation: `talk Talk @relation(fields: [talkId], references: [id])`
  - Add unique constraint: @@unique([talkId, reviewerEmail])
  - Add `reviews Review[]` to existing `Talk` model
  - Run `npx prisma migrate dev --name add-review-system`
  - Run `npx prisma generate`

  **Must NOT do**:
  - Do NOT modify existing Talk model fields (only add `reviews` relation)
  - Do NOT add default values to rating/notes (should be explicit)
  - Do NOT forget indexes (critical for query performance)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Reason**: Schema changes are straightforward database modeling

  **Parallelization**:
  - **Can Run In Parallel**: NO (blocks all Wave 2+ tasks)
  - **Parallel Group**: Wave 1 kickoff (must complete first)
  - **Blocks**: Tasks 5-20 (all depend on DB models)
  - **Blocked By**: None

  **References**:
  - `prisma/schema.prisma:26-46` - Existing Talk model structure
  - `src/actions/call-for-speakers/create.ts:128-141` - Resend integration pattern
  - Research: OTP security requires tokenHash (SHA256), not plaintext

  **Acceptance Criteria**:
  - [ ] `npx prisma format` runs without errors
  - [ ] `npx prisma migrate dev` creates migration file successfully
  - [ ] `npx prisma generate` creates client types
  - [ ] Migration applied to database

  **QA Scenarios**:

  ```
  Scenario: Schema validation and migration
    Tool: Bash
    Preconditions: Prisma CLI installed, DATABASE_URL configured
    Steps:
      1. Run `npx prisma format` → assert exit code 0
      2. Run `npx prisma migrate dev --name add-review-system --create-only` → assert migration file created in prisma/migrations/
      3. Read migration SQL → assert CREATE TABLE "OtpToken" and CREATE TABLE "Review" present
      4. Run `npx prisma migrate deploy` → assert "Database is up to date"
      5. Run `npx prisma generate` → assert src/generated/prisma/ contains OtpToken and Review types
    Expected Result: All commands succeed, types generated
    Failure Indicators: Syntax errors, missing indexes, generation failure
    Evidence: .sisyphus/evidence/task-1-schema-migration.log

  Scenario: Type checking
    Tool: Bash
    Preconditions: Migration applied, types generated
    Steps:
      1. Run `npx tsc --noEmit` → assert exit code 0
      2. Create test file: `const otp: OtpToken = { id: '1', email: 'test@example.com', tokenHash: 'abc', expiresAt: new Date(), attempts: 0, used: false, role: 'reviewer', createdAt: new Date() }`
      3. Assert TypeScript recognizes OtpToken type
    Expected Result: No type errors
    Evidence: .sisyphus/evidence/task-1-type-check.log
  ```

  **Commit**: YES
  - Message: `feat(schema): add OtpToken and Review models for review system`
  - Files: `prisma/schema.prisma`, `prisma/migrations/*`
  - Pre-commit: `npx prisma format && npx prisma generate`

- [x] 2. Environment Configuration (Email Lists + OTP Settings)

  **What to do**:
  - Create `.env.local` (if not exists) or update existing
  - Add `REVIEWER_EMAILS="email1@example.com,email2@example.com,email3@example.com"` (comma-separated)
  - Add `ADMIN_EMAILS="admin1@example.com,admin2@example.com"` (comma-separated)
  - Add `OTP_EXPIRY_MINUTES="10"` (10 minutes as per requirements)
  - Add `SESSION_EXPIRY_DAYS="3"` (3 days as per requirements)
  - Create `src/lib/config.ts` to parse and export these values:
    ```typescript
    export const REVIEWER_EMAILS = process.env.REVIEWER_EMAILS?.split(',').map(e => e.trim()) || [];
    export const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
    export const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
    export const SESSION_EXPIRY_DAYS = parseInt(process.env.SESSION_EXPIRY_DAYS || '3', 10);
    ```
  - Add validation: throw error if emails are empty on app startup

  **Must NOT do**:
  - Do NOT commit `.env.local` to git (add to .gitignore if not already)
  - Do NOT use hardcoded emails in code (only in env)
  - Do NOT skip validation (empty lists should fail fast)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Reason**: Simple configuration file creation

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 3, 4)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 6, 7 (OTP actions need config)
  - **Blocked By**: None

  **References**:
  - `.env.local` or `.env.example` - Existing env pattern
  - `src/lib/auth.ts` - Config pattern for NextAuth
  - Research: User specified two separate lists (reviewers vs admins)

  **Acceptance Criteria**:
  - [ ] `.env.local` contains all four variables
  - [ ] `src/lib/config.ts` exports parsed arrays and numbers
  - [ ] Validation throws error if REVIEWER_EMAILS or ADMIN_EMAILS empty

  **QA Scenarios**:

  ```
  Scenario: Config parsing
    Tool: Bash (Node REPL)
    Preconditions: .env.local configured, config.ts created
    Steps:
      1. Run `node -e "require('dotenv').config({path: '.env.local'}); const {REVIEWER_EMAILS} = require('./src/lib/config'); console.log(REVIEWER_EMAILS);"`
      2. Assert output is array of emails: ["email1@example.com", "email2@example.com", ...]
      3. Test empty env: `REVIEWER_EMAILS="" node -e "..."`
      4. Assert throws error: "REVIEWER_EMAILS must be configured"
    Expected Result: Valid emails parsed as array, empty throws error
    Failure Indicators: Undefined, wrong type, no validation error
    Evidence: .sisyphus/evidence/task-2-config-parsing.log

  Scenario: Config validation on server start
    Tool: Bash
    Preconditions: .env.local empty REVIEWER_EMAILS
    Steps:
      1. Modify .env.local: REVIEWER_EMAILS=""
      2. Run `npm run dev`
      3. Assert server startup fails with error message
      4. Restore .env.local with valid emails
      5. Run `npm run dev` → assert server starts successfully
    Expected Result: Invalid config prevents startup, valid config allows startup
    Evidence: .sisyphus/evidence/task-2-validation.log
  ```

  **Commit**: YES
  - Message: `feat(config): add email lists and OTP settings`
  - Files: `src/lib/config.ts`, `.env.example` (not .env.local)
  - Pre-commit: `npx tsc --noEmit`

- [x] 3. Shared TypeScript Types (OtpTokenData, ReviewData, AdminStats)

  **What to do**:
  - Create `src/types/otp.ts`:
    ```typescript
    export interface OtpTokenData {
      id: string;
      email: string;
      tokenHash: string;
      expiresAt: Date;
      attempts: number;
      used: boolean;
      role: 'reviewer' | 'admin';
      createdAt: Date;
    }
    export interface OtpSendRequest { email: string; }
    export interface OtpVerifyRequest { email: string; otp: string; }
    export interface OtpFormState { errors?: { email?: string[]; otp?: string[]; _form?: string[]; }; success?: boolean; }
    ```
  - Create `src/types/review.ts`:
    ```typescript
    export interface ReviewData {
      id: string;
      talkId: string;
      reviewerEmail: string;
      rating: number; // 1-5
      notes: string;
      createdAt: Date;
      updatedAt: Date;
    }
    export interface ReviewWithTalk extends ReviewData {
      talk: {
        id: string;
        talkTitle: string;
        talkDescription: string;
        fullName: string;
        // ... other Talk fields
      };
    }
    export interface ReviewFormState { errors?: { rating?: string[]; notes?: string[]; _form?: string[]; }; success?: boolean; }
    ```
  - Create `src/types/admin.ts`:
    ```typescript
    export interface AdminStats {
      total: number;
      pending: number;
      reviewed: number;
      accepted: number;
      rejected: number;
    }
    export interface ReviewerProgress {
      reviewerEmail: string;
      reviewsCompleted: number;
      totalSubmissions: number;
      percentageComplete: number;
    }
    ```

  **Must NOT do**:
  - Do NOT duplicate existing types from `src/types/talk.ts` (reuse if needed)
  - Do NOT use `any` types
  - Do NOT add optional fields that should be required

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Reason**: TypeScript interface definitions

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 2, 4)
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 5-20 (all use these types)
  - **Blocked By**: None

  **References**:
  - `src/types/talk.ts` - Existing SpeakerFormData pattern
  - `src/actions/call-for-speakers/create.ts:40-60` - Form state pattern
  - Research: Review model has rating (1-5), notes, timestamps

  **Acceptance Criteria**:
  - [ ] `npx tsc --noEmit` runs without errors
  - [ ] All interfaces exported with correct field types
  - [ ] No `any` types used

  **QA Scenarios**:

  ```
  Scenario: Type checking
    Tool: Bash
    Preconditions: Type files created
    Steps:
      1. Run `npx tsc --noEmit` → assert exit code 0
      2. Create test usage: `const review: ReviewData = { id: '1', talkId: 't1', reviewerEmail: 'r@e.com', rating: 5, notes: 'Great', createdAt: new Date(), updatedAt: new Date() }`
      3. Assert no type errors
      4. Test invalid rating: `rating: 6` → assert TypeScript error (if using literal type)
    Expected Result: Valid types compile, invalid fail
    Failure Indicators: Type errors, missing exports
    Evidence: .sisyphus/evidence/task-3-types.log
  ```

  **Commit**: YES
  - Message: `feat(types): add OTP, Review, and Admin interfaces`
  - Files: `src/types/otp.ts`, `src/types/review.ts`, `src/types/admin.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 4. Email Templates for OTP (React Email Component)

  **What to do**:
  - Create `src/notification/email/templates/otp-verification.tsx`:
    ```typescript
    interface OtpEmailProps { otp: string; expiresInMinutes: number; }
    export function OtpEmail({ otp, expiresInMinutes }: OtpEmailProps) {
      return (
        <div>
          <h3>Your GopherCon Africa Sign-In Code</h3>
          <p>Use this code to sign in to the review dashboard:</p>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '8px' }}>{otp}</h1>
          <p>This code expires in {expiresInMinutes} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      );
    }
    ```
  - Follow existing pattern from `talk-submission-success.tsx`
  - Use same styling conventions (inline styles, simple HTML)

  **Must NOT do**:
  - Do NOT use external CSS (inline styles only for email compatibility)
  - Do NOT add complex React Email components (keep it simple)
  - Do NOT hardcode expiry time (use prop)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Reason**: Simple React Email template

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 2, 3)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 6 (OTP send action uses this template)
  - **Blocked By**: None

  **References**:
  - `src/notification/email/templates/talk-submission-success.tsx` - Existing template pattern
  - `src/actions/call-for-speakers/create.ts:128-141` - Resend email sending with React template
  - Research: OTP validity is 10 minutes

  **Acceptance Criteria**:
  - [ ] Template file created with OtpEmailProps interface
  - [ ] OTP displayed prominently (large font, letter-spacing)
  - [ ] Expiry time shown using prop
  - [ ] `npx tsc --noEmit` passes

  **QA Scenarios**:

  ```
  Scenario: Template rendering
    Tool: Bash (Node REPL)
    Preconditions: Template created, @react-email/render installed
    Steps:
      1. Run: `node -e "const {render} = require('@react-email/render'); const {OtpEmail} = require('./src/notification/email/templates/otp-verification'); console.log(render(OtpEmail({otp: '123456', expiresInMinutes: 10})));"`
      2. Assert output contains HTML string with "123456" and "10 minutes"
      3. Assert no React errors
    Expected Result: HTML rendered successfully with OTP code
    Failure Indicators: React errors, missing OTP, malformed HTML
    Evidence: .sisyphus/evidence/task-4-template-render.log
  ```

  **Commit**: NO (groups with Task 6 - OTP send action)

- [x] 5. OTP Generation Utility (crypto.randomInt + SHA256 Hash)

  **What to do**:
  - Create `src/lib/otp.ts`:
    ```typescript
    import crypto from 'crypto';
    export function generateOtp(): string {
      return crypto.randomInt(100000, 999999).toString();
    }
    export function hashOtp(otp: string): string {
      return crypto.createHash('sha256').update(otp).digest('hex');
    }
    export function verifyOtp(otp: string, hash: string): boolean {
      const otpHash = hashOtp(otp);
      const expectedBuf = Buffer.from(hash, 'hex');
      const actualBuf = Buffer.from(otpHash, 'hex');
      if (expectedBuf.length !== actualBuf.length) return false;
      return crypto.timingSafeEqual(expectedBuf, actualBuf);
    }
    ```
  - Add unit test-style self-validation in comments (no test framework needed)

  **Must NOT do**:
  - Do NOT use `Math.random()` (not cryptographically secure)
  - Do NOT store plaintext OTP (always hash before DB insert)
  - Do NOT use simple string comparison (timing attack vulnerable)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Reason**: Utility functions with crypto APIs

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 6-10, all Wave 2)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 6, 7 (OTP actions use these utilities)
  - **Blocked By**: None (crypto is Node.js built-in)

  **References**:
  - Research: Use `crypto.randomInt(100000, 999999)` for 6-digit OTP
  - Research: Store SHA256 hash, verify with `crypto.timingSafeEqual`

  **Acceptance Criteria**:
  - [ ] `generateOtp()` returns 6-digit string (100000-999999 range)
  - [ ] `hashOtp()` returns 64-character hex string (SHA256)
  - [ ] `verifyOtp()` uses constant-time comparison
  - [ ] `npx tsc --noEmit` passes

  **QA Scenarios**:

  ```
  Scenario: OTP generation validity
    Tool: Bash (Node REPL)
    Preconditions: otp.ts created
    Steps:
      1. Run: `node -e "const {generateOtp} = require('./src/lib/otp'); for (let i=0; i<100; i++) { const otp = generateOtp(); if (otp.length !== 6 || parseInt(otp) < 100000 || parseInt(otp) > 999999) throw new Error('Invalid OTP: ' + otp); } console.log('OK');"`
      2. Assert output: "OK"
    Expected Result: All 100 OTPs are 6-digit numbers
    Failure Indicators: Length ≠ 6, out of range
    Evidence: .sisyphus/evidence/task-5-otp-generation.log

  Scenario: Hash consistency and verification
    Tool: Bash (Node REPL)
    Preconditions: otp.ts created
    Steps:
      1. Run: `node -e "const {hashOtp, verifyOtp} = require('./src/lib/otp'); const otp = '123456'; const hash = hashOtp(otp); console.log(hash.length, verifyOtp(otp, hash), verifyOtp('123457', hash));"`
      2. Assert output: "64 true false"
      3. Test timing safety: same-length OTPs should not leak timing info
    Expected Result: Hash is 64 chars, correct OTP verifies, wrong OTP fails
    Failure Indicators: Hash length ≠ 64, wrong OTP verifies, timing leak
    Evidence: .sisyphus/evidence/task-5-otp-verify.log
  ```

  **Commit**: NO (groups with Tasks 6-7)

- [x] 6. OTP Send Server Action (Rate Limit + DB Insert + Resend Email)

  **What to do**:
  - Create `src/actions/auth/otp.ts` (server action file)
  - Implement `sendOtp(formData: FormData): Promise<OtpFormState>`:
    - Extract email from formData
    - Validate email is in REVIEWER_EMAILS or ADMIN_EMAILS (use config from Task 2)
    - Rate limit: Check DB for recent OTP (last 1 minute) → return error if exists
    - Rate limit: Check DB for hourly count (last hour) → return error if ≥ 5
    - Invalidate old unused OTPs for this email (set `used=true`)
    - Generate OTP using `generateOtp()` from Task 5
    - Hash OTP using `hashOtp()`
    - Calculate expiresAt: `new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)`
    - Insert to DB: `prisma.otpToken.create({ data: { email, tokenHash, expiresAt, role: (ADMIN_EMAILS.includes(email) ? 'admin' : 'reviewer') } })`
    - Send email via Resend: use `OtpEmail` template from Task 4
    - Return `{ success: true }` or `{ errors: { _form: ['Error message'] } }`
  - Add Zod schema for validation

  **Must NOT do**:
  - Do NOT send OTP to emails not in hardcoded lists
  - Do NOT store plaintext OTP in database
  - Do NOT skip rate limiting (critical for security)
  - Do NOT proceed if Resend fails (return error to user)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Reason**: Complex server action with multiple validation layers

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7-10, Wave 2)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 8 (OTP login page calls this action)
  - **Blocked By**: Tasks 1 (Prisma), 2 (config), 4 (template), 5 (utils)

  **References**:
  - `src/actions/call-for-speakers/create.ts` - Server action pattern with Zod + Prisma + Resend
  - `src/lib/config.ts` - Email lists and expiry config
  - `src/lib/otp.ts` - generateOtp, hashOtp functions
  - Research: 3-layer rate limiting (1min cooldown, 5/hour, 5 attempts per OTP)

  **Acceptance Criteria**:
  - [ ] Email validation against hardcoded lists
  - [ ] Rate limiting: 1min cooldown enforced
  - [ ] Rate limiting: 5/hour max enforced
  - [ ] OTP hashed before DB insert
  - [ ] Resend email sent successfully
  - [ ] Zod schema validation for email field

  **QA Scenarios**:

  ```
  Scenario: Successful OTP send to reviewer email
    Tool: Bash (curl)
    Preconditions: Server running, DB migrated, .env.local configured
    Steps:
      1. POST to /api/auth/otp/send: `curl -X POST http://localhost:3000/api/auth/otp/send -H "Content-Type: application/json" -d '{"email":"reviewer@example.com"}'`
      2. Assert response: {"success":true}
      3. Check DB: `npx prisma studio` → assert OtpToken record exists with role='reviewer', used=false
      4. Check Resend logs/dashboard → assert email sent to reviewer@example.com
    Expected Result: OTP created in DB, email sent
    Failure Indicators: Error response, no DB record, no email
    Evidence: .sisyphus/evidence/task-6-otp-send-success.log

  Scenario: Rate limiting - 1min cooldown
    Tool: Bash (curl)
    Preconditions: Previous OTP sent < 1min ago
    Steps:
      1. Send first OTP: `curl ...`
      2. Immediately send second OTP (< 60s): `curl ...`
      3. Assert response: {"errors":{"_form":["Please wait 60 seconds..."]}}
      4. Wait 61 seconds, send again → assert {"success":true}
    Expected Result: Second request within 1min rejected, after 1min succeeds
    Failure Indicators: Rate limit not enforced
    Evidence: .sisyphus/evidence/task-6-rate-limit-cooldown.log

  Scenario: Rate limiting - 5/hour max
    Tool: Bash (curl loop)
    Preconditions: Clean DB or different email
    Steps:
      1. Loop 5 times with 61s delay: send OTP → assert success
      2. Send 6th OTP → assert {"errors":{"_form":["Too many OTP requests. Try again in an hour."]}}
    Expected Result: First 5 succeed, 6th rejected
    Failure Indicators: 6th request succeeds
    Evidence: .sisyphus/evidence/task-6-rate-limit-hourly.log

  Scenario: Unauthorized email rejection
    Tool: Bash (curl)
    Preconditions: Email not in REVIEWER_EMAILS or ADMIN_EMAILS
    Steps:
      1. POST with unauthorized email: `curl ... -d '{"email":"hacker@evil.com"}'`
      2. Assert response: {"errors":{"email":["Email not authorized"]}}
      3. Check DB → assert no OtpToken created
    Expected Result: Request rejected, no DB record
    Failure Indicators: OTP sent to unauthorized email
    Evidence: .sisyphus/evidence/task-6-unauthorized-email.log
  ```

  **Commit**: YES
  - Message: `feat(auth): implement OTP send with rate limiting and email`
  - Files: `src/actions/auth/otp.ts`, `src/lib/otp.ts`, `src/notification/email/templates/otp-verification.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

- [x] 7. OTP Verify Server Action (Constant-Time Compare + Session Create)

  **What to do**:
  - In `src/actions/auth/otp.ts`, implement `verifyOtp(formData: FormData): Promise<OtpFormState>`:
    - Extract email + otp from formData
    - Find most recent unused, unexpired OtpToken for email: `prisma.otpToken.findFirst({ where: { email, used: false, expiresAt: { gte: new Date() } }, orderBy: { createdAt: 'desc' } })`
    - If not found: return `{ errors: { _form: ['Invalid or expired code'] } }`
    - Increment attempts BEFORE checking (prevents timing oracle): `prisma.otpToken.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } })`
    - If attempts ≥ 5: mark as used, return error
    - Verify OTP using `verifyOtp(otp, record.tokenHash)` from Task 5
    - If invalid: return `{ errors: { _form: ['Incorrect code'] } }`
    - If valid: mark as used, create NextAuth session (call `signIn('credentials', { email, role: record.role })` or use custom session logic)
    - Return `{ success: true }`

  **Must NOT do**:
  - Do NOT check OTP before incrementing attempts (timing attack)
  - Do NOT use simple string comparison (use utility from Task 5)
  - Do NOT allow unlimited attempts (5 max per OTP)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Reason**: Security-critical verification logic

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 6, 8-10, Wave 2)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 9 (OTP verify page calls this)
  - **Blocked By**: Tasks 1, 5

  **References**:
  - `src/lib/otp.ts` - verifyOtp function
  - `src/lib/auth.ts` - NextAuth setup, signIn pattern
  - Research: Constant-time comparison, attempt limiting

  **Acceptance Criteria**:
  - [ ] Expired OTPs rejected
  - [ ] After 5 attempts, OTP invalidated
  - [ ] Constant-time comparison used
  - [ ] Valid OTP creates session with role claim

  **QA Scenarios**:

  ```
  Scenario: Valid OTP verification and session creation
    Tool: Bash (curl)
    Preconditions: OTP sent and DB record exists
    Steps:
      1. Extract OTP from DB or email logs
      2. POST to /api/auth/otp/verify: `curl ... -d '{"email":"reviewer@example.com","otp":"123456"}'`
      3. Assert response includes success + session cookie
      4. Check DB: OtpToken.used = true
      5. Use session cookie to access protected route: `curl http://localhost:3000/reviews -H "Cookie: ..."`
      6. Assert 200 OK (not redirect)
    Expected Result: Session created, protected route accessible
    Failure Indicators: No session, OTP not marked used, 401 response
    Evidence: .sisyphus/evidence/task-7-otp-verify-valid.log

  Scenario: Invalid OTP rejection
    Tool: Bash (curl)
    Preconditions: OTP sent
    Steps:
      1. POST with wrong OTP: `curl ... -d '{"email":"reviewer@example.com","otp":"000000"}'`
      2. Assert response: {"errors":{"_form":["Incorrect code"]}}
      3. Check DB: OtpToken.attempts incremented, used=false
      4. No session cookie in response
    Expected Result: Request rejected, attempts incremented
    Evidence: .sisyphus/evidence/task-7-otp-verify-invalid.log

  Scenario: Attempt limit (5 max)
    Tool: Bash (curl loop)
    Preconditions: OTP sent
    Steps:
      1. Loop 5 times: POST wrong OTP → assert "Incorrect code"
      2. 6th attempt: POST wrong OTP → assert "Too many attempts. Request a new code."
      3. Check DB: OtpToken.used = true, attempts = 5
      4. Try 7th attempt with CORRECT OTP → still rejected (OTP invalidated)
    Expected Result: After 5 failures, OTP permanently invalidated
    Evidence: .sisyphus/evidence/task-7-attempt-limit.log

  Scenario: Expired OTP rejection
    Tool: Bash (manual DB manipulation or time mock)
    Preconditions: OTP sent
    Steps:
      1. Update DB: set expiresAt to past time
      2. POST with valid OTP: `curl ...`
      3. Assert response: {"errors":{"_form":["Invalid or expired code"]}}
    Expected Result: Expired OTP rejected
    Evidence: .sisyphus/evidence/task-7-expired-otp.log
  ```

  **Commit**: YES (groups with Task 6 or separate)
  - Message: `feat(auth): implement OTP verification with attempt limiting`
  - Files: `src/actions/auth/otp.ts`
  - Pre-commit: `npx tsc --noEmit`

- [x] 8-10. OTP Auth Pages (/auth/otp-login, /auth/otp-verify, Middleware)

  *[Abbreviated for space - follow same pattern as Tasks 1-7: What to do, Must NOT, Agent Profile, Parallelization, References, Acceptance Criteria, QA Scenarios, Commit]*

  **Tasks 8-10 summary**:
  - Task 8: `/auth/otp-login` page (email input form, server action form pattern, toast on success/error, redirect to /auth/otp-verify on success)
  - Task 9: `/auth/otp-verify` page (6-digit code input, masked/formatted input, submit on 6th digit auto-submit option, redirect to /reviews or /admin on success based on role)
  - Task 10: Middleware extension (add `/reviews/*` to reviewer-protected routes, `/admin/*` to admin-protected routes, read role from JWT token, redirect unauthorized users)

- [x] 11. Star Rating Component (1-5 with Hover, ARIA)

  **What to do**:
  - Create `src/components/common/StarRating.tsx`:
    ```typescript
    interface StarRatingProps {
      value: number;
      name: string;
      onChange: (value: number) => void;
      label?: string;
      required?: boolean;
      readonly?: boolean;
    }
    export function StarRating({ value, name, onChange, label, required, readonly }: StarRatingProps) {
      const [hoverRating, setHoverRating] = useState(0);
      // Render 5 star buttons, highlight based on value/hover
      // Use lucide-react Star icon
      // ARIA: role="radiogroup", aria-label, focus rings
      // Color: yellow filled (#FFC107), gray outline for empty
      // Show numeric label: {hoverRating || value}/5
    }
    ```
  - Follow Redprints research pattern: button-based stars, hover scale, focus rings, readonly mode
  - Match existing codebase Tailwind conventions (#006B3F focus ring)

  **Must NOT do**:
  - Do NOT use radio inputs (use buttons for better styling control)
  - Do NOT remove focus indicators (accessibility critical)
  - Do NOT allow ratings outside 1-5 range

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []
  - **Reason**: UI component with interaction design

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 12-16, Wave 3)
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 15 (review modal uses this component)
  - **Blocked By**: None (only uses React + lucide-react)

  **References**:
  - Research: Redprints StarRating.tsx - button-based, hover preview, readonly mode
  - `src/components/common/Modal.tsx` - Reusable component pattern
  - Tailwind conventions: `#006B3F` primary, `rounded-lg`, `shadow-md`

  **Acceptance Criteria**:
  - [ ] 5 star buttons rendered
  - [ ] Hover preview shows which stars would be selected
  - [ ] Click sets rating value
  - [ ] Numeric label shows "X/5"
  - [ ] Readonly mode renders spans instead of buttons
  - [ ] Focus ring visible on keyboard navigation
  - [ ] ARIA labels for screen readers

  **QA Scenarios**:

  ```
  Scenario: Star rating interaction
    Tool: Playwright
    Preconditions: Component integrated in test page or Storybook
    Steps:
      1. Launch browser, navigate to test page
      2. Hover over 3rd star → assert first 3 stars highlighted
      3. Click 3rd star → assert value=3, numeric label shows "3/5"
      4. Hover over 5th star → assert all 5 highlighted
      5. Mouse leave → assert back to 3 stars highlighted (value=3)
      6. Keyboard: Tab to star group, Arrow Right → assert focus moves, can select with Enter
    Expected Result: Hover preview works, click sets value, keyboard accessible
    Failure Indicators: No hover effect, click doesn't set value, no keyboard nav
    Evidence: .sisyphus/evidence/task-11-star-rating.png (screenshot)

  Scenario: Readonly mode
    Tool: Playwright
    Preconditions: Component with readonly=true
    Steps:
      1. Navigate to readonly star rating (value=4)
      2. Assert 4 stars filled, 1 empty
      3. Try to click stars → assert value doesn't change
      4. Inspect DOM → assert no <button> elements (should be <span>)
    Expected Result: Stars displayed but not interactive
    Evidence: .sisyphus/evidence/task-11-readonly-stars.png
  ```

  **Commit**: NO (groups with Task 15)

- [x] 12. Review API Routes (GET all reviews, POST review)

  **What to do**:
  - Create `src/app/api/reviews/route.ts`:
    - GET handler: Fetch all talks with current user's reviews joined:
      ```typescript
      const talks = await prisma.talk.findMany({
        where: { eventYear: currentYear },
        include: {
          reviews: {
            where: { reviewerEmail: session.user.email }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(talks);
      ```
    - POST handler: Upsert review (unique constraint on [talkId, reviewerEmail]):
      ```typescript
      const { talkId, rating, notes } = await request.json();
      await prisma.review.upsert({
        where: { talkId_reviewerEmail: { talkId, reviewerEmail: session.user.email } },
        update: { rating, notes, updatedAt: new Date() },
        create: { talkId, reviewerEmail: session.user.email, rating, notes }
      });
      return NextResponse.json({ success: true });
      ```
  - Add middleware auth check (reviewer role required)
  - Validate rating (1-5 range with Zod)

  **Must NOT do**:
  - Do NOT allow reviewers to see other reviewers' feedback (only their own)
  - Do NOT allow ratings outside 1-5
  - Do NOT skip authentication check

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - **Reason**: API route with Prisma queries and validation

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 11, 13-16, Wave 3)
  - **Parallel Group**: Wave 3
  - **Blocks**: Tasks 14, 15 (UI components call this API)
  - **Blocked By**: Task 1 (Prisma models)

  **References**:
  - `src/app/api/auth/[...nextauth]/route.ts` - API route pattern
  - `src/actions/call-for-speakers/create.ts` - Prisma upsert pattern
  - Research: Unique constraint on [talkId, reviewerEmail]

  **Acceptance Criteria**:
  - [ ] GET returns talks with user's reviews
  - [ ] POST upserts review (creates or updates)
  - [ ] Rating validated (1-5)
  - [ ] Authentication required (401 if not logged in)

  **QA Scenarios**:

  ```
  Scenario: Fetch all talks with reviews
    Tool: Bash (curl)
    Preconditions: Authenticated as reviewer, some talks exist
    Steps:
      1. GET /api/reviews with session cookie: `curl http://localhost:3000/api/reviews -H "Cookie: next-auth.session-token=..."`
      2. Assert response is array of talks: [{ id, talkTitle, reviews: [{rating, notes}] }]
      3. Assert only current user's reviews included (not other reviewers')
      4. Test without cookie → assert 401 Unauthorized
    Expected Result: Talks fetched with user's reviews, auth enforced
    Failure Indicators: Other reviewers' data exposed, no auth check
    Evidence: .sisyphus/evidence/task-12-get-reviews.log

  Scenario: Submit new review
    Tool: Bash (curl)
    Preconditions: Authenticated, talk exists, no review yet
    Steps:
      1. POST /api/reviews: `curl -X POST http://localhost:3000/api/reviews -H "Cookie: ..." -H "Content-Type: application/json" -d '{"talkId":"abc","rating":5,"notes":"Excellent"}'`
      2. Assert response: {"success":true}
      3. Check DB: Review record created
      4. GET /api/reviews → assert new review appears
    Expected Result: Review created in DB
    Evidence: .sisyphus/evidence/task-12-post-review.log

  Scenario: Update existing review
    Tool: Bash (curl)
    Preconditions: Review already exists
    Steps:
      1. POST same talkId with different rating: `curl ... -d '{"talkId":"abc","rating":3,"notes":"Updated"}'`
      2. Check DB: Review updated (not duplicated)
      3. Assert only 1 review record exists for this talkId + reviewerEmail
    Expected Result: Review updated, unique constraint enforced
    Evidence: .sisyphus/evidence/task-12-update-review.log

  Scenario: Invalid rating rejection
    Tool: Bash (curl)
    Preconditions: Authenticated
    Steps:
      1. POST with rating=6: `curl ... -d '{"talkId":"abc","rating":6,"notes":""}'`
      2. Assert response: {"errors":{"rating":["Rating must be between 1 and 5"]}}
      3. Test rating=0 → same error
    Expected Result: Out-of-range ratings rejected
    Evidence: .sisyphus/evidence/task-12-invalid-rating.log
  ```

  **Commit**: YES
  - Message: `feat(api): add review GET and POST endpoints`
  - Files: `src/app/api/reviews/route.ts`
  - Pre-commit: `npx tsc --noEmit`

*[Tasks 13-20 continue with same detailed structure: UI pages, admin API routes, admin dashboard components, etc.]*

*[Each task includes: What to do, Must NOT, Agent Profile, Parallelization, References, Acceptance Criteria, 2-4 QA Scenarios, Commit strategy]*

*[Total plan: 20 implementation tasks + 3 final verification tasks = 23 tasks]*

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 3 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **End-to-End OTP Flow QA** — `unspecified-high` + `playwright` skill
  Start browser with Playwright. Navigate to /auth/otp-login. Enter hardcoded reviewer email. Submit form. Verify Resend sent email (check logs or mock). Extract OTP from email/logs. Navigate to /auth/otp-verify. Enter OTP. Assert redirected to /reviews with session cookie. Test session persistence (refresh page, still authenticated). Test expiry (wait 3+ days or mock time). Test invalid OTP (wrong code, expired code). Save screenshots to `.sisyphus/evidence/final-qa/otp-flow-*.png`.
  Output: `Scenarios [N/N pass] | VERDICT: APPROVE/REJECT`

- [x] F2. **Review Workflow QA** — `unspecified-high` + `playwright` skill
  Authenticate as reviewer via OTP. Navigate to /reviews. Assert pending table shows all unreviewed submissions. Click submission row. Assert modal opens with submission details. Rate submission 1-5 stars. Add notes. Save. Assert toast success. Assert submission moves to completed table. Refresh page. Assert review persisted. Test multiple reviews. Test progress bar updates. Save evidence to `.sisyphus/evidence/final-qa/review-workflow-*.png`.
  Output: `Workflows [N/N pass] | VERDICT: APPROVE/REJECT`

- [x] F3. **Admin Dashboard QA** — `unspecified-high` + `playwright` skill
  Authenticate as admin via OTP. Navigate to /admin/dashboard. Assert stats cards show correct counts (curl /api/admin/stats to verify). Assert reviewer progress table shows all reviewers with completion percentages. Test filtering by submission status. Test sorting by review count. Save screenshots to `.sisyphus/evidence/final-qa/admin-dashboard-*.png`. Curl /api/admin/progress and verify JSON response matches UI.
  Output: `API [PASS/FAIL] | UI [PASS/FAIL] | VERDICT: APPROVE/REJECT`

---

## Commit Strategy

- **Wave 1**: `feat(schema): add OtpToken and Review models`
- **Wave 2**: `feat(auth): implement OTP authentication system`
- **Wave 3**: `feat(reviews): add reviewer dashboard and API`
- **Wave 4**: `feat(admin): add admin dashboard and stats`
- **Final**: `test(qa): verify end-to-end flows`

---

## Success Criteria

### Verification Commands
```bash
# Check Prisma schema migration
npx prisma migrate status
# Expected: All migrations applied

# Check environment variables
cat .env.local | grep -E "REVIEWER_EMAILS|ADMIN_EMAILS|OTP_"
# Expected: Lists configured

# Start dev server
npm run dev
# Expected: Server running on http://localhost:3000

# Test OTP send (manual curl)
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"reviewer@example.com"}'
# Expected: {"success":true}

# Test admin stats API
curl http://localhost:3000/api/admin/stats \
  -H "Cookie: next-auth.session-token=<token>"
# Expected: {"total":50,"pending":30,"reviewed":20,...}
```

### Final Checklist
- [ ] All "Must Have" features present
- [ ] All "Must NOT Have" guardrails respected
- [ ] OTP codes expire after 10 minutes
- [ ] Sessions expire after 3 days
- [ ] Rate limiting prevents spam
- [ ] All routes protected by middleware
- [ ] Responsive UI on mobile/desktop
- [ ] Accessibility: ARIA labels, focus rings, keyboard navigation
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (`npm run lint`)
