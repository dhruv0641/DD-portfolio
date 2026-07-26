# Environment Security Review

## Overview
This document reviews the configuration security of `.env` files, build-time variables, and secret keys.

## Secret Keys Classification

| Variable | Scope | Risk Level | Mitigation |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Low | Restricted by RLS policies |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Public / Client | Low | Restricted by RLS policies |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Critical | Never expose to client. Exclude `NEXT_PUBLIC_` prefix. |
| `ADMIN_JWT_SECRET` | Server-Only | Critical | Used for signing session cookies. Keep length >= 32 chars. |
| `CONTACT_FORM_ENDPOINT` | Server-Only | Medium | Mask from client views. |

## Verification Check
1. **Secrets Exposure**: The codebase was scanned to ensure no server-only keys (`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_JWT_SECRET`) are prefixed with `NEXT_PUBLIC_` or imported into client components.
2. **Git Ignored Secrets**: Verify that `.env` and `.env.local` are explicitly included in `.gitignore` to prevent committing sensitive keys to repository control.
3. **Fallback Tokens**: Default mock keys are restricted to development builds. Production builds must define environment variables externally.
