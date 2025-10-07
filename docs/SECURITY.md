# Security Checklist

- Enforce RLS on all tables; test unauthorized access
- Use signed URLs for file access; private buckets only
- Store secrets only in server env (not exposed to client)
- Rotate Supabase keys before production
- Validate inputs on API routes; limit rates if exposed
- Use HTTPS everywhere; set secure cookies if using cookies
- Audit logs: enable activity feed and server logs
