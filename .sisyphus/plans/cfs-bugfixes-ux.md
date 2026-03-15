# CFS Review Dashboard — Bug Fixes & UX Improvements

## TL;DR

> **Quick Summary**: Fix 6 bugs and UX gaps in the CFS Review Dashboard: simplify URLs, add escape key + overflow handling to modal, add logout to header, add submissions table to admin dashboard, and remove OTP 1-minute cooldown.
> 
> **Deliverables**:
> - Simplified routes: `/otp-login`, `/otp-verify`, `/admin` (from `/auth/otp-login`, `/auth/otp-verify`, `/admin/dashboard`)
> - Modal escape key handler + content overflow scrolling
> - Logout button in Header (session-aware, visible only when authenticated)
> - Admin submissions overview table with average ratings and review counts
> - OTP 1-minute cooldown removed (hourly + attempts limits preserved)
> - Old URL redirects in next.config.ts
> 
> **Estimated Effort**: Medium (6 tasks across 3 waves)
> **Parallel Execution**: YES — 3 waves with up to 3 parallel tasks per wave
> **Critical Path**: Modal fix + OTP fix (Wave 1, parallel) → URL migration (Wave 2) → Header logout + Admin submissions (Wave 3, parallel)

---

## Context

### Original Request
User identified 6 bugs/missing features in the CFS Review Dashboard after initial build:
1. URLs too verbose (`/auth/otp-login`, `/admin/dashboard`)
2. No redirect to OTP login when accessing protected routes while logged out (partly works via middleware but uses old paths)
3. No logout button anywhere
4. Review modal: Escape key doesn't close it, long content overflows bounds
5. Admin dashboard missing submissions list
6. OTP 1-minute cooldown is annoying and unnecessary

### Interview Summary
**Key Discussions**:
- **URL scheme**: Ditch `/auth/` prefix for OTP pages, flatten `/admin/dashboard` to `/admin`. Reviews URL stays.
- **Logout placement**: Extend existing Header.tsx with session awareness — show logout button only when authenticated. No separate nav bar. No login button (reviewers/admins have direct links).
- **Admin submissions table**: Show all submissions with average rating and review count (ranked view). Unreviewed talks display "—".
- **Modal fixes**: Apply to shared Modal.tsx so all 3 consumers benefit (reviews, speakers, schedule).
- **OTP rate limiting**: Remove only the 1-min cooldown. Keep 5/hour max and 5 attempts per OTP.

### Metis Review
**Identified Gaps** (addressed):
- URL reference count is 12 across 5 files (not 9) — all mapped
- Modal.tsx has 3 consumers — all must be verified after fix
- `.next` cache must be deleted after route directory moves
- Prisma `_avg` returns `null` for unreviewed talks — handle as "—"
- Header.tsx currently has no session awareness — needs `useSession()` from next-auth/react
- Old URLs should redirect (not 404) for internal tool bookmarks

---

## Work Objectives

### Core Objective
Fix 6 user-reported bugs and UX gaps in the existing CFS Review Dashboard to improve usability.

### Concrete Deliverables
- `src/components/common/Modal.tsx` — escape key handler + overflow scrolling
- `src/actions/auth/otp.ts` — 1-minute cooldown removed
- Route directories moved: `src/app/otp-login/`, `src/app/otp-verify/`, `src/app/admin/page.tsx`
- 12 hardcoded URL references updated across 5 files
- 3 redirect rules in `next.config.ts`
- `src/components/header/Header.tsx` — session-aware logout button
- `src/app/api/admin/submissions/route.ts` — new API endpoint
- `src/app/admin/page.tsx` — submissions overview table added

### Definition of Done
- [ ] All 6 reported issues resolved and agent-verified
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] All old URLs redirect to new URLs (not 404)
- [ ] Modal closes on Escape in all 3 consumer contexts
- [ ] Logout button visible when authenticated, hidden when not

### Must Have
- Escape key closes Modal (shared component, benefits all consumers)
- Modal content scrollable when exceeding viewport height
- Logout button in Header using `signOut({ callbackUrl: '/otp-login' })`
- Admin submissions table with columns: Title, Speaker, Category, Avg Rating, Reviews
- Handle `null` average rating for unreviewed talks (display "—")
- Old URL redirects in next.config.ts (3 rules)
- Delete `.next` cache after route file moves
- Delete empty `src/app/auth/` directory after migration

### Must NOT Have (Guardrails)
- **Must NOT modify `SpeakerModal.tsx` or `TalkDetailModal.tsx`** — they consume Modal.tsx; changes cascade automatically
- **Must NOT modify `src/app/api/reviews/route.ts`** — working correctly
- **Must NOT modify `verifyOtpAction` or `authorize` in auth.ts** — only `sendOtp` cooldown is in scope
- **Must NOT change Prisma schema or create migrations** — all needed models exist
- **Must NOT add pagination, sorting, filtering, or search** to any table
- **Must NOT add focus trap or animations** to Modal
- **Must NOT fix `/payment-*` redirects** in next.config.ts (pre-existing, out of scope)
- **Must NOT add `callbackUrl` consumption** to OTP flow (pre-existing gap, out of scope)
- **Must NOT touch `src/app/signin/`, `src/app/signup/`, or `[...nextauth]/route.ts`**
- **Must NOT create a separate protected layout component** — extend Header.tsx instead
- **Must NOT add a login button** to Header — reviewers/admins have direct links

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO (no test framework in project)
- **Framework**: N/A
- **Agent-Executed QA**: YES (mandatory for all tasks)

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use `playwright` skill — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use Bash (curl) — Send requests, assert status + response fields
- **Code verification**: Use `ast_grep_search` / `grep` to verify no stale references remain

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — independent fixes):
├── Task 1: Modal escape key + overflow fix [quick]
├── Task 2: OTP 1-minute cooldown removal [quick]
└── (independent, no shared files)

Wave 2 (After Wave 1 — URL migration, atomic):
├── Task 3: Route directory moves + URL reference updates + redirects [unspecified-high]
└── (single atomic task — all 12 references + 3 directory moves + redirects)

Wave 3 (After Wave 2 — features using new URLs):
├── Task 4: Header logout button (session-aware) [quick]
├── Task 5: Admin submissions API endpoint [quick]
├── Task 6: Admin submissions table UI [quick]
└── (Tasks 4-5 independent; Task 6 depends on Task 5)

Wave FINAL (After ALL tasks — verification):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | F3 | 1 |
| 2 | — | 3 | 1 |
| 3 | 1, 2 | 4, 5, 6, F1-F4 | 2 |
| 4 | 3 | F1-F4 | 3 |
| 5 | 3 | 6, F1-F4 | 3 |
| 6 | 5 | F1-F4 | 3 |
| F1-F4 | ALL | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 2 tasks — T1 → `quick`, T2 → `quick`
- **Wave 2**: 1 task — T3 → `unspecified-high`
- **Wave 3**: 3 tasks — T4 → `quick`, T5 → `quick`, T6 → `quick`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [x] 1. Fix Modal: Add Escape Key Handler + Content Overflow Scrolling

  **What to do**:
  - In `src/components/common/Modal.tsx`, add a `useEffect` that listens for `keydown` events on `document`:
    - If `event.key === 'Escape'` and `isOpen` is true, call `onClose()`
    - Clean up the listener in the useEffect return
    - Import `useEffect` from React (currently not imported)
  - Add content overflow handling to the modal content area:
    - On the content wrapper div (line 29, the `relative w-full` div), add `max-h-[calc(100vh-8rem)]` and `flex flex-col`
    - Keep the header (title + X button, lines 30-38) outside the scrollable area
    - Wrap `{children}` (line 39) in a `<div className="overflow-y-auto flex-1">` so content scrolls within the modal while header stays pinned
  - Do NOT add a `preventClose` prop — keep it simple (Metis suggested this but it's scope creep)

  **Must NOT do**:
  - Do NOT modify SpeakerModal.tsx, TalkDetailModal.tsx, or any consumer of Modal
  - Do NOT add focus trap, animation, or transition logic
  - Do NOT change the existing size classes or backdrop behavior

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file change, straightforward React pattern (useEffect + keydown)
  - **Skills**: []
    - No specialized skills needed — standard React component edit
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for implementation, only for QA (handled by QA scenarios)
    - `frontend-ui-ux`: Overkill for a targeted bug fix

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3 (URL migration), F1-F4
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL):

  **Pattern References**:
  - `src/components/common/Modal.tsx` (entire file, 46 lines) — The file to modify. Currently has no `useEffect`, no keyboard handling. Backdrop click close is on line 27. X button close is on line 33.

  **Consumer References** (for understanding impact, NOT for modification):
  - `src/app/reviews/page.tsx:168` — Uses `<Modal isOpen={true} onClose={closeModal} title="Review Submission">` with long content (description, bio, experience fields)
  - `src/components/speakers/SpeakerModal.tsx` — Speaker bio modal (read to understand content patterns)
  - `src/components/schedule/TalkDetailModal.tsx` — Schedule talk detail modal

  **WHY Each Reference Matters**:
  - `Modal.tsx` is the ONLY file to edit — understand current structure before adding useEffect
  - Consumer files show what content goes inside — reviews modal has the most content (5 text sections + rating + textarea + buttons), confirming overflow is a real issue
  - SpeakerModal and TalkDetailModal are NOT edited but MUST work correctly after changes

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Escape key closes review modal
    Tool: Playwright
    Preconditions: Dev server running, /reviews page loaded with at least 1 submission
    Steps:
      1. Navigate to /reviews (may need auth — if redirected, note this and test on a public modal consumer instead)
      2. Click first table row to open review modal
      3. Assert modal is visible: page.locator('.fixed.inset-0.z-100').isVisible()
      4. Press Escape: page.keyboard.press('Escape')
      5. Assert modal is gone: page.locator('.fixed.inset-0.z-100').isHidden()
    Expected Result: Modal disappears after Escape key press
    Failure Indicators: Modal remains visible, or JS error in console
    Evidence: .sisyphus/evidence/task-1-escape-key-review.png

  Scenario: Modal content scrolls when exceeding viewport
    Tool: Playwright
    Preconditions: Dev server running, page with modal that has long content
    Steps:
      1. Navigate to page with modal (reviews or schedule)
      2. Open a modal with long content
      3. Assert the children wrapper div has overflow-y-auto class
      4. Assert the modal container has max-h constraint
      5. Screenshot showing scrollable content area
    Expected Result: Content area scrolls, header stays pinned, buttons accessible
    Failure Indicators: Content overflows modal bounds, Save/Cancel buttons hidden below viewport
    Evidence: .sisyphus/evidence/task-1-modal-overflow.png

  Scenario: Backdrop click still works after changes
    Tool: Playwright
    Preconditions: Same as Scenario 1
    Steps:
      1. Open modal
      2. Click the backdrop overlay (outside modal content)
      3. Assert modal closes
    Expected Result: Existing close behavior preserved
    Failure Indicators: Backdrop click no longer closes modal
    Evidence: .sisyphus/evidence/task-1-backdrop-click.png
  ```

  **Evidence to Capture:**
  - [ ] task-1-escape-key-review.png — Screenshot before/after Escape key
  - [ ] task-1-modal-overflow.png — Screenshot showing scrollable content
  - [ ] task-1-backdrop-click.png — Screenshot verifying backdrop click

  **Commit**: YES
  - Message: `fix(modal): add escape key handler and content overflow scrolling`
  - Files: `src/components/common/Modal.tsx`
  - Pre-commit: `npx tsc --noEmit`

- [x] 2. Remove OTP 1-Minute Cooldown from Send OTP

  **What to do**:
  - In `src/actions/auth/otp.ts`, delete the 1-minute cooldown check (lines 33-45):
    - Remove the `oneMinuteAgo` variable declaration (line 33)
    - Remove the `recentOtp` query (lines 34-40)
    - Remove the `if (recentOtp)` block with the remaining seconds calculation (lines 42-45)
  - Keep everything else intact:
    - The hourly rate limit (lines 47-57) — `hourlyCount >= 5` check stays
    - The invalidation of old OTPs (lines 59-65) stays
    - The OTP generation, hashing, creation, and email sending stays
  - The `try {` on line 32 stays — the hourly check (currently line 47) becomes the first thing inside the try block

  **Must NOT do**:
  - Do NOT modify `verifyOtpAction` function (lines 103-175)
  - Do NOT change the hourly rate limit (5/hour) or per-OTP attempt limit (5 attempts)
  - Do NOT modify the Zod schema or email validation
  - Do NOT change the email sending logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file, delete 13 lines, no new code needed
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None applicable — this is a deletion task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3 (URL migration touches this file too)
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL):

  **Pattern References**:
  - `src/actions/auth/otp.ts:32-57` — The rate limiting section. Lines 33-45 are the cooldown to DELETE. Lines 47-57 are the hourly limit to KEEP.

  **WHY Each Reference Matters**:
  - Lines 33-45 are the exact code to remove — executor must identify these precisely
  - Lines 47-57 must NOT be touched — they are the remaining rate limit that stays

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: No more "Please wait" error on rapid OTP sends
    Tool: Bash (code verification)
    Preconditions: File saved after deletion
    Steps:
      1. grep -n "oneMinuteAgo" src/actions/auth/otp.ts → expect 0 matches
      2. grep -n "recentOtp" src/actions/auth/otp.ts → expect 0 matches
      3. grep -n "Please wait" src/actions/auth/otp.ts → expect 0 matches
      4. grep -n "hourlyCount" src/actions/auth/otp.ts → expect 1 match (hourly limit preserved)
      5. grep -n "Too many OTP" src/actions/auth/otp.ts → expect 1 match (hourly error preserved)
    Expected Result: All cooldown code removed, hourly limit intact
    Failure Indicators: Any of the removed patterns still present, or hourly limit accidentally deleted
    Evidence: .sisyphus/evidence/task-2-cooldown-removed.txt

  Scenario: TypeScript compiles cleanly
    Tool: Bash
    Steps:
      1. npx tsc --noEmit
    Expected Result: Exit code 0, zero errors
    Failure Indicators: Type errors related to removed code (unreachable variables, etc.)
    Evidence: .sisyphus/evidence/task-2-tsc-check.txt
  ```

  **Evidence to Capture:**
  - [ ] task-2-cooldown-removed.txt — grep output confirming removal
  - [ ] task-2-tsc-check.txt — TypeScript compilation output

  **Commit**: YES
  - Message: `fix(otp): remove 1-minute cooldown from send OTP requests`
  - Files: `src/actions/auth/otp.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 3. Simplify Auth and Admin URL Paths (Atomic Migration)

  **What to do**:

  **Step A — Move route directories:**
  1. Move `src/app/auth/otp-login/page.tsx` → `src/app/otp-login/page.tsx` (create `src/app/otp-login/` directory)
  2. Move `src/app/auth/otp-verify/page.tsx` → `src/app/otp-verify/page.tsx` (create `src/app/otp-verify/` directory)
  3. Move `src/app/admin/dashboard/page.tsx` → `src/app/admin/page.tsx` (move up one level into existing `src/app/admin/`)
  4. Delete empty `src/app/auth/` directory (should be empty after moves)
  5. Delete empty `src/app/admin/dashboard/` directory

  **Step B — Update all 12 hardcoded URL references:**

  | # | File | Old String | New String |
  |---|------|-----------|------------|
  | 1 | `middleware.ts` line 15 | `'/auth/otp-login'` | `'/otp-login'` |
  | 2 | `middleware.ts` line 16 | `'/auth/otp-verify'` | `'/otp-verify'` |
  | 3 | `middleware.ts` line 58 | `pathname === '/auth/otp-login' \|\| pathname === '/auth/otp-verify'` | `pathname === '/otp-login' \|\| pathname === '/otp-verify'` |
  | 4 | `middleware.ts` line 60 | `'/admin/dashboard'` | `'/admin'` |
  | 5 | `middleware.ts` line 67 | `new URL('/auth/otp-login', request.url)` | `new URL('/otp-login', request.url)` |
  | 6 | `middleware.ts` line 85 | `new URL('/auth/otp-login', request.url)` | `new URL('/otp-login', request.url)` |
  | 7 | `src/lib/auth.ts` line 74 | `signIn: "/auth/otp-login"` | `signIn: "/otp-login"` |
  | 8 | `src/app/otp-login/page.tsx` line 18 (after move) | `'/auth/otp-verify?email='` | `'/otp-verify?email='` |
  | 9 | `src/app/otp-verify/page.tsx` line 48 (after move) | `'/admin/dashboard'` | `'/admin'` |
  | 10 | `src/app/otp-verify/page.tsx` line 96 (after move) | `href="/auth/otp-login"` | `href="/otp-login"` |
  | 11 | `src/actions/auth/otp.ts` line 162 | `'/admin/dashboard'` | `'/admin'` |

  Note: Reference #3 and #4 in the original Metis analysis counted a single-line conditional as 2 references. The actual edit count is 11 string changes but be thorough — use `grep` to find ALL occurrences.

  **Step C — Add redirects for old URLs in `next.config.ts`:**
  Add 3 redirect rules to the existing `redirects()` array (after the payment redirects):
  ```
  { source: '/auth/otp-login', destination: '/otp-login', permanent: true },
  { source: '/auth/otp-verify', destination: '/otp-verify', permanent: true },
  { source: '/admin/dashboard', destination: '/admin', permanent: true },
  ```

  **Step D — Clear build cache:**
  Run `rm -rf .next` to clear stale route cache artifacts.

  **Step E — Verify zero stale references:**
  Run: `grep -r "/auth/otp-login\|/auth/otp-verify\|/admin/dashboard" src/ middleware.ts --include="*.ts" --include="*.tsx"`
  Expected: 0 results (only next.config.ts redirect rules should contain old paths, and that's in the root not src/).

  **Must NOT do**:
  - Do NOT update API route paths (`/api/auth/`, `/api/admin/`, `/api/reviews`) — these stay as-is
  - Do NOT change the middleware matcher config (line 96-99)
  - Do NOT modify the `publicPrefixes` array (line 19-21, `/api/auth` stays)
  - Do NOT touch `[...nextauth]/route.ts`
  - Do NOT rename `src/actions/auth/otp.ts` file path — only change the string inside it

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multi-file atomic change with 11 string edits, 3 directory operations, and verification. Risk of partial update breaking auth redirects.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed — standard commit, no complex git operations

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential — must follow Wave 1)
  - **Blocks**: Tasks 4, 5, 6, F1-F4 (all subsequent tasks use new URL paths)
  - **Blocked By**: Tasks 1, 2 (Task 2 modifies otp.ts which this task also edits)

  **References** (CRITICAL):

  **Files to Edit (read ALL before any edits):**
  - `middleware.ts` (100 lines) — Lines 15, 16, 58, 60, 67, 85 contain old paths
  - `src/lib/auth.ts` (101 lines) — Line 74 `signIn: "/auth/otp-login"`
  - `src/actions/auth/otp.ts` (175 lines) — Line 162 `'/admin/dashboard'`
  - `src/app/auth/otp-login/page.tsx` (66 lines) — Line 18 `'/auth/otp-verify?email='` (move file first, then edit)
  - `src/app/auth/otp-verify/page.tsx` (113 lines) — Lines 48, 96 contain old paths (move file first, then edit)
  - `next.config.ts` (45 lines) — Add redirects to existing `redirects()` array at line 29

  **Files to Move:**
  - `src/app/auth/otp-login/page.tsx` → `src/app/otp-login/page.tsx`
  - `src/app/auth/otp-verify/page.tsx` → `src/app/otp-verify/page.tsx`
  - `src/app/admin/dashboard/page.tsx` → `src/app/admin/page.tsx`

  **Directories to Delete (after moves):**
  - `src/app/auth/` — becomes empty
  - `src/app/admin/dashboard/` — becomes empty

  **WHY Each Reference Matters**:
  - `middleware.ts` is the central routing authority — if ANY path is wrong here, auth breaks completely
  - `src/lib/auth.ts` line 74 is easily missed — it's NextAuth's built-in redirect-to-signin config, not a page file
  - `next.config.ts` redirects prevent 404s for bookmarked old URLs
  - Order matters: move files FIRST, then edit them at their new locations

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: New URLs resolve correctly
    Tool: Bash
    Preconditions: Files moved and edited, .next cache cleared
    Steps:
      1. Verify directory structure:
         - ls src/app/otp-login/page.tsx → exists
         - ls src/app/otp-verify/page.tsx → exists
         - ls src/app/admin/page.tsx → exists
         - ls src/app/auth/ 2>&1 → "No such file or directory"
         - ls src/app/admin/dashboard/ 2>&1 → "No such file or directory"
      2. Verify zero stale references:
         - grep -r "/auth/otp-login\|/auth/otp-verify\|/admin/dashboard" src/ middleware.ts --include="*.ts" --include="*.tsx" → 0 results
      3. Verify next.config.ts has 3 new redirect rules:
         - grep "otp-login" next.config.ts → shows redirect rule
         - grep "otp-verify" next.config.ts → shows redirect rule
         - grep "admin/dashboard" next.config.ts → shows redirect rule
      4. npx tsc --noEmit → passes
    Expected Result: All files moved, all references updated, TypeScript clean
    Failure Indicators: Stale path found in any file, missing directory, TypeScript error
    Evidence: .sisyphus/evidence/task-3-migration-verify.txt

  Scenario: Middleware redirects work with new paths
    Tool: Playwright
    Preconditions: Dev server running with new routes
    Steps:
      1. Navigate to /otp-login (unauthenticated) → assert page loads, h1 contains "Review Dashboard"
      2. Navigate to /admin (unauthenticated) → assert redirect to /otp-login (URL contains "otp-login")
      3. Navigate to /reviews (unauthenticated) → assert redirect to /otp-login
    Expected Result: All new URL paths work, unauthenticated redirects go to /otp-login
    Failure Indicators: 404 on any new path, redirect to old /auth/otp-login path
    Evidence: .sisyphus/evidence/task-3-new-routes.png

  Scenario: Old URLs redirect to new URLs
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /auth/otp-login → assert final URL is /otp-login
      2. Navigate to /auth/otp-verify → assert final URL is /otp-verify
      3. Navigate to /admin/dashboard → assert final URL is /admin
    Expected Result: All old URLs permanently redirect to new URLs (not 404)
    Failure Indicators: 404 page shown, or redirect to wrong destination
    Evidence: .sisyphus/evidence/task-3-old-redirects.png
  ```

  **Evidence to Capture:**
  - [ ] task-3-migration-verify.txt — Directory structure + grep output + tsc output
  - [ ] task-3-new-routes.png — Screenshots of new URL pages loading
  - [ ] task-3-old-redirects.png — Screenshots confirming old URL redirects

  **Commit**: YES
  - Message: `refactor(routes): simplify auth and admin URL paths`
  - Files: `middleware.ts`, `src/lib/auth.ts`, `src/actions/auth/otp.ts`, `src/app/otp-login/page.tsx`, `src/app/otp-verify/page.tsx`, `src/app/admin/page.tsx`, `next.config.ts`
  - Deleted: `src/app/auth/`, `src/app/admin/dashboard/`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 4. Add Session-Aware Logout Button to Header

  **What to do**:
  - In `src/components/header/Header.tsx`:
    - Import `useSession` and `signOut` from `next-auth/react`
    - Call `const { data: session } = useSession()` inside the component
    - Add a logout button that is ONLY visible when `session` exists (user is authenticated)
    - The button calls `signOut({ callbackUrl: '/otp-login' })` on click
    - Place the logout button in the desktop nav area (after the Sponsors link, line 38) and in the mobile menu (after the Sponsors link, line 65)
    - Style: Simple text button matching existing nav link style — `text-gray-600 hover:text-[#006B3F] transition-colors font-medium`
    - Label: "Sign out" (matching the OTP auth context)
  - Do NOT add a login button — reviewers/admins have direct links
  - Do NOT add a role indicator — keep it minimal (just "Sign out")
  - The `SessionProvider` already wraps the app in `src/app/providers.tsx`, so `useSession()` will work

  **Must NOT do**:
  - Do NOT create a separate ProtectedNav or UserMenu component
  - Do NOT add any other links to the header (no "Dashboard" or "Reviews" links)
  - Do NOT modify the existing nav links (About, Workshops, Sponsors)
  - Do NOT add role indicator or user email display — just the sign out button
  - Do NOT modify `src/app/providers.tsx` or `src/lib/auth.ts`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file edit, add ~10 lines of conditional rendering
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Overkill — copying existing link styling pattern

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 5, 6)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 3 (uses new `/otp-login` path in signOut callbackUrl)

  **References** (CRITICAL):

  **Pattern References**:
  - `src/components/header/Header.tsx` (76 lines) — The file to edit. Desktop nav: lines 35-38. Mobile menu: lines 49-71. Existing link style: `text-gray-600 hover:text-[#006B3F] transition-colors font-medium`.
  - `src/app/providers.tsx` — Contains `<SessionProvider>` wrapping the app (DO NOT EDIT, just confirms `useSession()` will work)

  **API References**:
  - `signOut` from `next-auth/react` — Call as `signOut({ callbackUrl: '/otp-login' })`. Clears cookies automatically.
  - `useSession` from `next-auth/react` — Returns `{ data: session, status }`. `session` is null when not authenticated.

  **WHY Each Reference Matters**:
  - `Header.tsx` is the ONLY file to edit — must understand existing structure to place logout correctly
  - `providers.tsx` confirms SessionProvider availability (no changes needed)
  - `signOut` callbackUrl must use the NEW `/otp-login` path (not old `/auth/otp-login`)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Logout button visible when authenticated
    Tool: Playwright
    Preconditions: Dev server running, user authenticated (may need OTP flow or manual cookie)
    Steps:
      1. Navigate to /reviews (authenticated)
      2. Assert element with text "Sign out" is visible in header area
      3. Screenshot the header showing Sign out button
    Expected Result: "Sign out" button visible in header nav
    Failure Indicators: No logout button visible, or button present but not in header
    Evidence: .sisyphus/evidence/task-4-logout-visible.png

  Scenario: Logout button hidden when not authenticated
    Tool: Playwright
    Preconditions: Dev server running, no auth cookies
    Steps:
      1. Navigate to / (public homepage, unauthenticated)
      2. Assert element with text "Sign out" does NOT exist in DOM
      3. Navigate to /otp-login (unauthenticated)
      4. Assert element with text "Sign out" does NOT exist in DOM
    Expected Result: No "Sign out" button on public pages when logged out
    Failure Indicators: Sign out button visible without authentication
    Evidence: .sisyphus/evidence/task-4-logout-hidden.png

  Scenario: Sign out redirects to /otp-login
    Tool: Playwright
    Preconditions: User authenticated
    Steps:
      1. Navigate to /reviews (authenticated)
      2. Click "Sign out" button
      3. Wait for navigation to complete (timeout 10s)
      4. Assert current URL contains "/otp-login"
      5. Assert session cookie is cleared (page.context().cookies() should not contain next-auth.session-token)
    Expected Result: User logged out, redirected to /otp-login, session cleared
    Failure Indicators: Redirect to wrong page, session cookie persists
    Evidence: .sisyphus/evidence/task-4-signout-redirect.png
  ```

  **Evidence to Capture:**
  - [ ] task-4-logout-visible.png — Header with Sign out button (authenticated)
  - [ ] task-4-logout-hidden.png — Header without Sign out button (unauthenticated)
  - [ ] task-4-signout-redirect.png — Post-logout page showing /otp-login

  **Commit**: YES
  - Message: `feat(header): add session-aware logout button`
  - Files: `src/components/header/Header.tsx`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 5. Add Admin Submissions Overview API Endpoint

  **What to do**:
  - Create `src/app/api/admin/submissions/route.ts` with a GET handler:
    - Follow the exact pattern from `src/app/api/admin/stats/route.ts`: `getToken` → role check (admin only) → Prisma query → JSON response
    - Return 401 if no token, 403 if not admin role
    - Query: Fetch all Talk records for current year with review aggregation
    - Use `db.talk.findMany()` with `include: { reviews: { select: { rating: true } } }` to get all talks with their review ratings
    - Compute aggregates in JS (not Prisma groupBy — simpler and matches existing stats route pattern):
      ```
      talks.map(talk => ({
        id: talk.id,
        talkTitle: talk.talkTitle,
        fullName: talk.fullName,
        talkCategory: talk.talkCategory,
        averageRating: talk.reviews.length > 0
          ? talk.reviews.reduce((sum, r) => sum + r.rating, 0) / talk.reviews.length
          : null,
        reviewCount: talk.reviews.length,
      }))
      ```
    - `averageRating` is `null` when no reviews (not 0) — frontend handles display as "—"
    - Sort by `reviewCount` descending (most reviewed first), then by `averageRating` descending as tiebreaker
    - Filter by `eventYear: currentYear` (same as stats endpoint)

  **Must NOT do**:
  - Do NOT add pagination, sorting params, or filtering query params
  - Do NOT modify the Prisma schema
  - Do NOT use Prisma `groupBy` or `_avg` — use `findMany` + JS compute for simplicity
  - Do NOT add any write operations (POST/PUT/DELETE) to this endpoint

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single new file following exact existing pattern (stats/route.ts)
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - None — straightforward API route creation

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4, 6 — but Task 6 depends on this)
  - **Blocks**: Task 6, F1-F4
  - **Blocked By**: Task 3 (no direct code dependency, but wave ordering ensures clean state)

  **References** (CRITICAL):

  **Pattern References**:
  - `src/app/api/admin/stats/route.ts` (77 lines) — EXACT pattern to follow: getToken (line 8), role check (lines 10-17), try/catch with error logging (lines 19-76), currentYear filter (line 20), JSON response.
  - `src/app/api/admin/progress/route.ts` — Secondary pattern reference for admin API conventions.

  **API/Type References**:
  - `src/types/admin.ts` — Check if `AdminSubmission` interface exists. If not, define the response type inline or add to this file.
  - `src/db/index.ts` — DB import: `import { db } from '@/src/db'`

  **External References**:
  - Prisma `findMany` with `include` and `select` — standard Prisma pattern for relation loading

  **WHY Each Reference Matters**:
  - `stats/route.ts` is the template — copy its auth pattern exactly (import style, error format, response shape)
  - `admin.ts` types file determines if a new interface is needed
  - DB import must match the existing `import { db } from '@/src/db'` pattern (named export)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Admin can fetch submissions with ratings
    Tool: Bash (curl)
    Preconditions: Dev server running, valid admin session cookie available
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/admin/submissions → expect 200 (with auth cookie) or 401 (without)
      2. If 401 (no cookie available): verify the endpoint file exists and TypeScript compiles:
         - ls src/app/api/admin/submissions/route.ts → exists
         - npx tsc --noEmit → passes
         - grep "getToken" src/app/api/admin/submissions/route.ts → match found
         - grep "admin" src/app/api/admin/submissions/route.ts → role check found
    Expected Result: Endpoint exists, compiles, follows auth pattern
    Failure Indicators: File missing, TypeScript errors, no auth check
    Evidence: .sisyphus/evidence/task-5-submissions-api.txt

  Scenario: Response shape includes required fields
    Tool: Bash (code verification)
    Steps:
      1. grep "talkTitle" src/app/api/admin/submissions/route.ts → found
      2. grep "fullName" src/app/api/admin/submissions/route.ts → found
      3. grep "talkCategory" src/app/api/admin/submissions/route.ts → found
      4. grep "averageRating" src/app/api/admin/submissions/route.ts → found
      5. grep "reviewCount" src/app/api/admin/submissions/route.ts → found
      6. grep "null" src/app/api/admin/submissions/route.ts → found (null avg for unreviewed)
    Expected Result: All required response fields present in endpoint code
    Failure Indicators: Missing fields, no null handling for averageRating
    Evidence: .sisyphus/evidence/task-5-response-shape.txt

  Scenario: Unauthorized access returns proper errors
    Tool: Bash (code verification)
    Steps:
      1. grep "401" src/app/api/admin/submissions/route.ts → found
      2. grep "403" src/app/api/admin/submissions/route.ts → found
    Expected Result: Both 401 (no auth) and 403 (wrong role) error codes present
    Failure Indicators: Missing error handling for unauthorized access
    Evidence: .sisyphus/evidence/task-5-auth-check.txt
  ```

  **Evidence to Capture:**
  - [ ] task-5-submissions-api.txt — Endpoint existence + TypeScript compilation
  - [ ] task-5-response-shape.txt — Response fields verification
  - [ ] task-5-auth-check.txt — Auth/role check verification

  **Commit**: YES
  - Message: `feat(admin): add submissions overview API with review aggregation`
  - Files: `src/app/api/admin/submissions/route.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 6. Add Submissions Table to Admin Dashboard

  **What to do**:
  - In `src/app/admin/page.tsx` (the moved admin dashboard page):
    - Add a new state variable for submissions: `const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);`
    - Define `AdminSubmission` interface inline (or import from types):
      ```
      interface AdminSubmission {
        id: string;
        talkTitle: string;
        fullName: string;
        talkCategory: string;
        averageRating: number | null;
        reviewCount: number;
      }
      ```
    - Add fetch for `/api/admin/submissions` in the existing `loadData()` function — add to the `Promise.all` array (alongside stats and progress fetches)
    - Add a new table section BELOW the existing Reviewer Progress table:
      - Section title: "Submissions Overview"
      - Table columns: Title, Speaker, Category, Avg Rating, Reviews
      - For `averageRating`: display `rating.toFixed(1)` when not null, display "—" when null
      - For `reviewCount`: display as plain number
      - Style: Match existing Reviewer Progress table exactly (same `bg-white rounded-lg shadow overflow-hidden` wrapper, same `min-w-full divide-y` table, same header/row styles)
      - Empty state: "No submissions found" (same pattern as "No reviewer data available")

  **Must NOT do**:
  - Do NOT add sorting, filtering, pagination, or search to the table
  - Do NOT add click-to-view-details on submission rows
  - Do NOT modify the existing stats cards or reviewer progress table
  - Do NOT import Modal or add any modal interaction
  - Do NOT add color coding based on rating values

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file edit, adding a table section following existing patterns in the same file
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Not needed — copying exact table pattern from same file
    - `playwright`: Only for QA, not implementation

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 5 for API endpoint)
  - **Parallel Group**: Wave 3 (runs after Task 5 completes)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 5 (needs `/api/admin/submissions` endpoint to exist)

  **References** (CRITICAL):

  **Pattern References**:
  - `src/app/admin/page.tsx:107-154` (after move from dashboard/) — The existing Reviewer Progress table. Copy this EXACT structure for the submissions table: same wrapper classes, same table/thead/tbody pattern, same hover styles, same empty state.
  - `src/app/admin/page.tsx:30-61` — The existing `loadData()` function with `Promise.all`. Add submissions fetch here.
  - `src/app/admin/page.tsx:79-105` — The stats cards grid. Submissions table goes BELOW the progress table (at the bottom of the page).

  **API References**:
  - `src/app/api/admin/submissions/route.ts` (created in Task 5) — Returns JSON array of `{ id, talkTitle, fullName, talkCategory, averageRating, reviewCount }`

  **WHY Each Reference Matters**:
  - Lines 107-154 are the template — copy table structure, header style, row hover, empty state pattern
  - Lines 30-61 show where to add the fetch — extend the existing Promise.all
  - API response shape determines the interface and rendering logic

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Submissions table renders on admin dashboard
    Tool: Playwright
    Preconditions: Dev server running, authenticated as admin
    Steps:
      1. Navigate to /admin (authenticated as admin)
      2. Assert h2 "Submissions Overview" is visible
      3. Assert table headers visible: "Title", "Speaker", "Category", "Avg Rating", "Reviews"
      4. Screenshot the full admin dashboard showing stats + progress + submissions
    Expected Result: Three sections visible: stats cards, reviewer progress, submissions overview
    Failure Indicators: Missing table, wrong column headers, JS error
    Evidence: .sisyphus/evidence/task-6-submissions-table.png

  Scenario: Null average rating displays as "—"
    Tool: Bash (code verification)
    Preconditions: File saved
    Steps:
      1. grep -n "—\|toFixed" src/app/admin/page.tsx → expect both patterns present
      2. Verify null check: grep "null\|averageRating" src/app/admin/page.tsx → expect conditional rendering
    Expected Result: Code handles null averageRating with "—" display and uses toFixed for non-null
    Failure Indicators: No null handling (would crash on .toFixed()), or always shows 0
    Evidence: .sisyphus/evidence/task-6-null-handling.txt

  Scenario: TypeScript compiles cleanly
    Tool: Bash
    Steps:
      1. npx tsc --noEmit → passes
    Expected Result: Zero TypeScript errors
    Failure Indicators: Type errors from new interface or fetch logic
    Evidence: .sisyphus/evidence/task-6-tsc-check.txt
  ```

  **Evidence to Capture:**
  - [ ] task-6-submissions-table.png — Admin dashboard with all 3 sections
  - [ ] task-6-null-handling.txt — Code verification for null averageRating handling
  - [ ] task-6-tsc-check.txt — TypeScript compilation output

  **Commit**: YES
  - Message: `feat(admin): add submissions table with average ratings to dashboard`
  - Files: `src/app/admin/page.tsx`
  - Pre-commit: `npx tsc --noEmit`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Verify no stale URL references remain: `grep -r "/auth/otp-login\|/auth/otp-verify\|/admin/dashboard" src/ middleware.ts --include="*.ts" --include="*.tsx"` should return 0 results.
  Output: `Build [PASS/FAIL] | Stale URLs [CLEAN/N found] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: navigate old URLs and verify redirect, open review modal and press Escape, verify logout appears in header when authenticated. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Order | Commit Message | Files | Pre-commit |
|-------|---------------|-------|------------|
| 1 | `fix(modal): add escape key handler and content overflow scrolling` | `src/components/common/Modal.tsx` | `npx tsc --noEmit` |
| 2 | `fix(otp): remove 1-minute cooldown from send OTP requests` | `src/actions/auth/otp.ts` | `npx tsc --noEmit` |
| 3 | `refactor(routes): simplify auth and admin URL paths` | `middleware.ts`, `src/lib/auth.ts`, `src/actions/auth/otp.ts`, `src/app/otp-login/page.tsx` (moved), `src/app/otp-verify/page.tsx` (moved), `src/app/admin/page.tsx` (moved), `next.config.ts`, delete `src/app/auth/`, delete `src/app/admin/dashboard/` | `npx tsc --noEmit` |
| 4 | `feat(header): add session-aware logout button` | `src/components/header/Header.tsx` | `npx tsc --noEmit` |
| 5 | `feat(admin): add submissions overview API with review aggregation` | `src/app/api/admin/submissions/route.ts` | `npx tsc --noEmit` |
| 6 | `feat(admin): add submissions table with average ratings to dashboard` | `src/app/admin/page.tsx` | `npx tsc --noEmit` |

---

## Success Criteria

### Verification Commands
```bash
npx tsc --noEmit              # Expected: zero errors
grep -r "/auth/otp-login\|/auth/otp-verify\|/admin/dashboard" src/ middleware.ts --include="*.ts" --include="*.tsx"  # Expected: 0 results
ls src/app/auth/ 2>&1          # Expected: "No such file or directory"
ls src/app/admin/dashboard/ 2>&1  # Expected: "No such file or directory"
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All old URLs redirect to new URLs
- [ ] Modal closes on Escape in reviews, speakers, and schedule contexts
- [ ] Header shows logout when authenticated, nothing extra when not
- [ ] Admin dashboard shows stats + reviewer progress + submissions table
- [ ] OTP can be sent twice rapidly without cooldown error
