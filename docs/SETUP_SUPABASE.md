# Supabase Setup Guide

1) Create Supabase project
- Note `project URL` and `anon/service_role` keys
- Set Auth → Email: verification required; Session: 7 days
- OAuth: enable Google if needed

2) Storage
- Create bucket `paisaka-receipts` (private)
- Allowed types: jpeg, png, webp, pdf

3) Apply SQL (SQL Editor)
- Run `supabase/schema.sql`
- Run `supabase/policies.sql`
- Run `supabase/seed.sql`

4) Environment
- Set in `.env.local`:
```
SUPABASE_PROJECT_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_BUCKET_NAME=paisaka-receipts
DEFAULT_TIMEZONE=Asia/Kolkata
SUPPORTED_LANGUAGES=en,hi
```

5) Verify
- `npm run dev`
- Open `/api/user` (should return profile when logged in)
- Test `/api/files` POST for signed upload URL

6) Production
- Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` to hosting env
- Lock down RLS and rotate keys before go-live
