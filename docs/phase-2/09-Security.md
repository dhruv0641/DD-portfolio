# Security Analysis

## Overview

This document assesses the security posture of the Phase 2 Supabase migration, identifying implemented controls, known gaps, and recommendations.

## Implemented Security Controls

### 1. Row Level Security (RLS)
- ✅ Enabled on all 14 tables
- ✅ Anonymous users can only read published/active records
- ✅ Write operations require authenticated role
- ✅ Service role key used only in server-side code

### 2. Authentication
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens signed with HS256 algorithm
- ✅ 24-hour session expiration
- ✅ HTTP-only cookie storage (prevents XSS token theft)
- ✅ Edge middleware verifies sessions before page render

### 3. Client Separation
- ✅ Anonymous client (`supabase`) respects RLS policies
- ✅ Admin client (`getSupabaseAdmin()`) is a factory function, not a global singleton
- ✅ Service role key is server-only environment variable (no `NEXT_PUBLIC_` prefix)

### 4. Input Handling
- ✅ Server Actions validate required fields before database insertion
- ✅ Contact form sanitizes user inputs

## Known Security Gaps

### High Priority

| Gap | Risk | Mitigation |
|---|---|---|
| No rate limiting on contact form | Spam/DDoS on `messages` table | Implement rate limiting in `contact.ts` Server Action |
| No rate limiting on login attempts | Brute-force password attacks | Add attempt counting and lockout |
| Fallback JWT secret in source code | Token forgery if default secret used | Enforce `ADMIN_JWT_SECRET` in production |

### Medium Priority

| Gap | Risk | Mitigation |
|---|---|---|
| No CSRF protection on Server Actions | Cross-site request forgery | Next.js has built-in CSRF for Server Actions, verify configuration |
| Analytics allows unlimited anonymous inserts | Storage abuse on `analytics_events` | Add server-side validation and rate limiting |
| No content security policy (CSP) headers | XSS attack surface | Add CSP headers in `next.config.ts` |

### Low Priority

| Gap | Risk | Mitigation |
|---|---|---|
| Legacy `src/db/` folder still exists | Confusion, potential accidental use | Remove after Phase 2 is fully validated |
| `console.warn` for missing Supabase creds | Info leak in server logs | Use structured logging in production |

## Environment Variable Audit

| Variable | Exposure | Risk Level |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side (public) | 🟢 Low — URL is public by design |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side (public) | 🟢 Low — restricted by RLS policies |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | 🔴 Critical — full database access |
| `ADMIN_JWT_SECRET` | Server-only | 🔴 Critical — session forgery if leaked |

## Recommendations for Phase 3

1. **Implement rate limiting** on contact form and login endpoints
2. **Add CSP headers** to `next.config.ts`
3. **Remove legacy `src/db/` folder** after confirming all SQLite references are gone
4. **Rotate fallback secrets** — remove hardcoded fallback JWT secret
5. **Add audit logging** for admin write operations
6. **Implement CAPTCHA** on contact form for bot prevention
