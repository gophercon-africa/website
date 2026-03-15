HANDOFF CONTEXT
===============

USER REQUESTS (AS-IS)
---------------------
- "I'd like to build a basic tool that supports 1) reviewing submissions by reviewers and 2) a dashboard that allows the review committee to see a list of submissions, as well as track the progress of reviewers reviewing these submissions"
- "I also wouldn't like to introduce auth, i would like a simple otp based auth flow for both reviewers and admins"
- "Both features can be guarded by a hardcoded list of emails and auth sessions would be generated after an otp sent to the email is verified"
- "All reviewers review all submissions (free-for-all, not assigned). Rating scale 1-5 + private committee notes"
- "OTP can be valid for 10m, session can be 3 days, yes two separate lists, otp format is numeric"
- "All info can be visible, and no status modifications. Keep submissions read-only for now"

GOAL
----
Run the Final Verification Wave (F1, F2, F3) — end-to-end Playwright QA of OTP flow, review workflow, and admin dashboard — once a live DATABASE_URL is available; until then, the codebase is fully implemented and TypeScript-clean.

WORK COMPLETED
--------------
- Extended Prisma schema with OtpToken and Review models (commit 8ece747)
- Created src/lib/config.ts parsing REVIEWER_EMAILS, ADMIN_EMAILS, OTP_EXPIRY_MINUTES, SESSION_EXPIRY_DAYS from .env.local (commit da17713)
- Created TypeScript types in src/types/otp.ts, src/types/review.ts, src/types/admin.ts (commit 31b4c4e)
- Created OTP email template at src/notification/email/templates/otp-verification.tsx
- Created src/lib/otp.ts: generateOtp (crypto.randomInt 100000-999999), hashOtp (SHA256), verifyOtp (timingSafeEqual) (commit c6274c9)
- Created src/actions/auth/otp.ts: sendOtp + verifyOtpAction with 3-layer rate limiting (1min cooldown, 5/hr max, 5 attempts/OTP) (commit 1e5197f, b919dff)
- Created /auth/otp-login and /auth/otp-verify pages (commit 7ffb2ce)
- Extended middleware.ts with role-based route protection: /reviews requires reviewer role, /admin/* requires admin role (commit 4939427)
- Created src/components/common/StarRating.tsx — 1-5 stars with hover preview and ARIA labels (commit e4fdea2)
- Created src/app/api/reviews/route.ts — GET (talks + current user's reviews joined) and POST (upsert review by talkId+reviewerEmail) (commit afd546c)
- Created src/app/reviews/page.tsx — reviewer dashboard with submissions table and review modal (commit 5b40420)
- Created src/app/api/admin/stats/route.ts — submission statistics endpoint (commit 796a0df)
- Created src/app/api/admin/progress/route.ts — per-reviewer progress endpoint (commit 750d298)
- Created src/app/admin/dashboard/page.tsx — stats cards + reviewer progress table (commit 7aeaee5)
- Fixed critical Prisma client: changed accelerateUrl to datasourceUrl in src/db/index.ts and src/lib/prisma.ts (commit 1500f5b)
- Fixed 3 TypeScript errors (uncommitted):
  - src/lib/auth.ts line 29: orderBy { updatedAt } → orderBy { createdAt } (updatedAt not on OtpToken)
  - src/app/auth/otp-verify/page.tsx line 13: searchParams.get() → searchParams?.get() (null guard)
  - prisma.config.ts: replaced Prisma 7-only 'prisma/config' import with empty export (incompatible with Prisma 5.x)
- Confirmed npx tsc --noEmit passes with zero errors after fixes

CURRENT STATE
-------------
- All 20 implementation tasks are complete and committed (commits da17713 through 7aeaee5)
- 3 TypeScript fixes are applied but NOT yet committed (uncommitted changes in src/lib/auth.ts, src/app/auth/otp-verify/page.tsx, prisma.config.ts)
- npx tsc --noEmit → PASSES (zero errors)
- npm run lint → pre-existing project bug unrelated to our code: next lint treats 'lint' as a directory argument; this failure exists on main before our changes
- DATABASE_URL is present in .env.local (value redacted) — unknown if it points to a live DB
- RESEND_API_KEY is present in .env.local — needed for OTP email sending
- .env.local has real or placeholder emails in REVIEWER_EMAILS and ADMIN_EMAILS — verify before QA
- Dev server starts cleanly on port 3002 (port 3000 was occupied by another process)
- Plan file checkboxes for tasks 13-20 were NOT marked [x] — they were completed but the plan file was not updated
- Final Verification Wave tasks F1, F2, F3 remain at [ ] in the plan file

PENDING TASKS
-------------
- Commit the 3 TypeScript fixes: git add src/lib/auth.ts src/app/auth/otp-verify/page.tsx prisma.config.ts && git commit -m "fix(ts): resolve type errors in auth, otp-verify, and prisma config"
- Mark plan checkboxes [x] for tasks 13-20 in .sisyphus/plans/cfs-review-dashboard.md (lines 953 area — tasks were collapsed into a summary note, may need manual update)
- F1: Playwright — navigate /auth/otp-login, enter reviewer email, submit, get OTP from email, navigate /auth/otp-verify, enter code, assert redirect to /reviews, test session persistence, test invalid OTP rejection. Save screenshots to .sisyphus/evidence/final-qa/otp-flow-*.png
- F2: Playwright — authenticate as reviewer, assert submissions table loads, open review modal, click star rating, fill notes, submit, assert toast success, refresh and assert persistence. Save to .sisyphus/evidence/final-qa/review-workflow-*.png
- F3: Playwright + curl — authenticate as admin, assert stats cards, curl /api/admin/stats and cross-check values, assert reviewer progress table, curl /api/admin/progress and cross-check. Save to .sisyphus/evidence/final-qa/admin-dashboard-*.png
- npx prisma migrate dev --name add-review-system (only if DATABASE_URL points to a writable DB — check first with npx prisma migrate status)

KEY FILES
---------
- .sisyphus/plans/cfs-review-dashboard.md - Work plan; F1/F2/F3 tasks at lines 965-975
- src/lib/auth.ts - NextAuth config with OTP CredentialsProvider; orderBy fix applied here
- src/app/auth/otp-verify/page.tsx - OTP verify page; searchParams null guard fix applied here
- prisma.config.ts - Replaced Prisma 7 config API with empty export (Prisma 5 compat fix)
- src/actions/auth/otp.ts - sendOtp + verifyOtpAction server actions with rate limiting
- src/app/reviews/page.tsx - Reviewer dashboard (248 lines): submissions table + review modal
- src/app/admin/dashboard/page.tsx - Admin dashboard (177 lines): stats cards + progress table
- src/app/api/reviews/route.ts - GET talks with reviews / POST upsert review
- src/app/api/admin/stats/route.ts - Submission statistics API
- src/app/api/admin/progress/route.ts - Per-reviewer progress API

IMPORTANT DECISIONS
-------------------
- OTP integrates with existing NextAuth CredentialsProvider — role (reviewer|admin) stored as JWT claim
- DB client: import db from '@/src/db' (default export) — check usage in each file before importing
- Review uniqueness at DB level: @@unique([talkId, reviewerEmail]) + upsert pattern in POST handler
- Prisma 5.22.0 (not 7.x) — downgraded due to Node 21.1.0 incompatibility; use datasourceUrl not accelerateUrl
- OTP stored as SHA256 hash only — plaintext never persisted
- Email lists in .env.local as comma-separated strings, parsed in src/lib/config.ts

EXPLICIT CONSTRAINTS
--------------------
- No password-based auth — OTP only, no username/password storage
- No automatic reviewer assignment — all reviewers see all submissions
- No real-time notifications — email is sufficient
- No submission editing — Talk model data is read-only for reviewers/admins
- No status modifications — IsAccepted/IsPendingReview flags cannot be changed via this dashboard
- No public-facing pages — all routes require authentication
- No complex analytics — stick to basic counts and progress percentages
- No AI slop patterns — avoid over-abstraction, excessive comments, generic variable names (data/result/item)

CONTEXT FOR CONTINUATION
------------------------
- Before running F1-F3: run npx prisma migrate status to confirm DB is reachable and migrations applied; if not, run npx prisma migrate dev --name add-review-system first
- The OTP happy-path flow requires a real DB write (OtpToken insert) and a real Resend API call — both will fail without live credentials
- If DB is not available, limit QA to: static page rendering (pages load without 500 errors), route protection (unauthenticated requests redirect to /auth/otp-login), and API shape (endpoints return expected JSON structure)
- Port 3000 may be occupied — use PORT=3002 npm run dev if needed
- The plan file has a collapsed note at line 953 ("Tasks 13-20 continue with same detailed structure") — these tasks exist as files but their checkboxes are not in the plan; treat them as complete
- Playwright is available via npx (version 1.58.2) even though @playwright/test is not in package.json
- Use skill_mcp with mcp_name="playwright" for direct browser automation without spawning a subagent
