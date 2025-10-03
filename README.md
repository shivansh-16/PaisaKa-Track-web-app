# PaisaKa Track - Web App

## Local Setup

1. Copy `.env.example` to `.env.local` and fill values:
   - `SUPABASE_PROJECT_URL`, `SUPABASE_ANON_KEY` (required to run)
   - Optional: `SUPABASE_SERVICE_ROLE_KEY` for server tasks
   - Keep `DEFAULT_TIMEZONE=Asia/Kolkata` and `DEFAULT_CURRENCY=INR`
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Run dev server:
```bash
npm run dev
   ```
4. Open http://localhost:3000

## CI
GitHub Actions runs lint, tests, and build on PRs to `main`. Configure repo secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Usage
The Supabase client is exposed via:
- `lib/db.ts` → `getBrowserSupabase()` and `getServerSupabase()`
- `lib/auth.ts` → `getUserFromRequest()` and `requireUser()`
- `lib/constants.ts` → environment-backed config (timezone, languages, limits)

## Database & RLS (Supabase)
Apply SQL in order using Supabase SQL editor:
1. `supabase/schema.sql`
2. `supabase/policies.sql`
3. `supabase/seed.sql`

## Storage (Supabase)
- Create bucket: `paisaka-receipts` (private)
- Allowed types: image/jpeg, image/png, image/webp, application/pdf
- API endpoints:
  - `POST /api/files` → returns `{ path, signedUrl, token }` for direct upload
  - `GET /api/files?path=...` → returns signed download URL

## Deployment
- Vercel:
  - Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Add server env vars as needed: `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - Set build command: `npm run build`; output: `.next`
- Supabase: ensure RLS enabled; rotate keys before go-live

## Docs
- See `docs/SETUP_SUPABASE.md` for backend setup

## Conventions
- Timezone default: Asia/Kolkata
- Supported languages: en, hi
- Storage bucket: `paisaka-receipts`

## Next steps
- Implement database schema and RLS in Supabase
- Integrate auth routes and secure API handlers
- Replace static data with live queries
