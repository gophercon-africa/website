
## Task 3: URL Migration (2026-03-15)
- When moving Next.js route directories, must update ALL references: middleware publicExact set, redirect logic, auth config pages.signIn, server actions, and client-side router.push calls
- The `grep -r ... --include="*.ts" --include="*.tsx"` pattern returns exit code 1 when no matches found (not 0) — this is correct grep behavior
- next.config.ts redirects() array is the right place for permanent backward-compat redirects
- Always read files before editing with the Edit tool (tool enforces this)
- Copy files first, then edit the copies — avoids editing files that will be deleted
