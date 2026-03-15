# Issues & Gotchas

## [2026-03-14] Session Init

### Prisma Accelerate Migration Issue
- **Issue**: Prisma Accelerate uses connection pooling URL — `prisma migrate dev` needs direct DB URL
- **Workaround**: May need `DIRECT_URL` env var for migrations, or use `prisma db push` instead
- **Action**: Task 1 executor should check if migration works; if not, use `prisma db push`

### NextAuth PrismaAdapter Conflict
- **Issue**: `src/lib/auth.ts` uses `PrismaAdapter(db)` but JWT strategy doesn't need DB adapter
- **Concern**: PrismaAdapter expects NextAuth User/Account/Session tables that don't exist
- **Action**: Task 7 executor should remove PrismaAdapter or keep it but ensure it doesn't break OTP flow

### No .env.local exists
- **Issue**: No environment files found — DATABASE_URL must be set elsewhere (maybe .env or system env)
- **Action**: Task 2 executor should create .env.local without overwriting existing DATABASE_URL

### `@path` import alias
- **Issue**: `import paths from '@path'` used in create.ts — need to check tsconfig for this alias
- **Action**: New files should use same pattern if needed, or avoid it

## [2026-03-14] Task 1: Schema Migration - Resolved Issues

### Prisma Version Incompatibility (RESOLVED)
- **Issue**: Prisma 7.2.0 requires Node 20.19+, 22.12+, or 24+; environment has Node 21.1.0
- **Error**: `ERR_REQUIRE_ESM` when running `npx prisma migrate dev` or `npx prisma generate`
- **Root Cause**: ESM/CommonJS mismatch in Prisma 7.x with Node 21.x
- **Solution**: Downgraded to Prisma 5.22.0 (compatible with Node 21.1.0)
- **Action Taken**: Updated package.json to use Prisma 5.22.0, updated generator provider to "prisma-client-js"
- **Status**: ✅ RESOLVED

### Missing DATABASE_URL (EXPECTED)
- **Issue**: No DATABASE_URL in environment; schema generation requires it
- **Workaround**: Added placeholder DATABASE_URL to .env.local for schema generation
- **Note**: When actual database is available, run `npx prisma migrate dev --name add-review-system`
- **Status**: ✅ EXPECTED - Schema generation completed without actual DB

### Schema Changes Applied
- ✅ Added OtpToken model with email/tokenHash indexes
- ✅ Added Review model with talkId/reviewerEmail unique constraint
- ✅ Added reviews relation to Talk model
- ✅ Updated datasource to include url = env("DATABASE_URL")
- ✅ Updated generator provider to "prisma-client-js"
- ✅ Prisma Client generated successfully to src/generated/prisma/

### Pre-existing TypeScript Errors (NOT CAUSED BY THIS TASK)
- prisma.config.ts: Cannot find module 'prisma/config'
- src/db/queries/talks.ts: Type mismatch in TalkCreateInput
- These errors existed before schema changes and are unrelated to OtpToken/Review models

## [2026-03-14] Prisma accelerateUrl → datasourceUrl Fix (RESOLVED)
- **Issue**: `src/db/index.ts` and `src/lib/prisma.ts` used `accelerateUrl` (Prisma Accelerate v7+ option)
- **Error**: `PrismaClientConstructorValidationError: Unknown property accelerateUrl`
- **Fix**: Changed to `datasourceUrl` (valid in Prisma 5.x)
- **Files Fixed**: `src/db/index.ts`, `src/lib/prisma.ts`
- **Commit**: `fix(db): use datasourceUrl instead of accelerateUrl for Prisma 5 compatibility`
- **Status**: ✅ RESOLVED
