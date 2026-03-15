# Architectural Decisions

## [2026-03-14] Session Init

### OTP Auth Integration
- **Decision**: Extend existing NextAuth CredentialsProvider to accept OTP credentials
- **Rationale**: Preserves existing middleware (getToken), session shape, and JWT strategy
- **Implementation**: Replace password credential with otp credential in authorize()
- **Session**: Add `role` claim to JWT token (reviewer|admin)

### DB Client Choice
- **Decision**: Use `db` from `src/db/index.ts` in all new server actions
- **Rationale**: Matches existing pattern in `src/actions/call-for-speakers/create.ts`

### Email Lists Storage
- **Decision**: Environment variables in `.env.local` (comma-separated)
- **Rationale**: Simple, no DB needed, easy to update

### Review Uniqueness
- **Decision**: @@unique([talkId, reviewerEmail]) + upsert pattern
- **Rationale**: One review per reviewer per submission, updates allowed

### Session Duration
- **Decision**: 3 days (SESSION_EXPIRY_DAYS=3)
- **OTP Validity**: 10 minutes (OTP_EXPIRY_MINUTES=10)
