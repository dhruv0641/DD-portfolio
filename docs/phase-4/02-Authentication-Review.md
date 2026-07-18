# Authentication Architecture Review

## Overview
This document reviews the custom JWT-based authentication mechanism, session lifecycle management, cookie flags, password resets, and session duration variables.

## Session Lifecycle Management

### 1. Credentials Verification
- Admin login uses `signIn()` from `authService.ts`.
- Submits inputs to Supabase Auth (`signInWithPassword`) using email formatting mapping `${username}@vance.engineering`.

### 2. Session Cookies
- A HS256 JWT cookie is signed with `ADMIN_JWT_SECRET` and stored in `dd_session`.
- **Cookie Security Flags**:
  - `HttpOnly`: true (protects against XSS token harvesting)
  - `Secure`: true in production (forces HTTPS transport)
  - `SameSite`: Lax (prevents CSRF token transmissions)
  - `Path`: `/` (scope restricted to current domain)

### 3. Session Expiration & Remember Me
- Standard session: Expires in **24 hours** (`maxAge: 60 * 60 * 24`).
- Remember Me session: Expires in **30 days** (`maxAge: 60 * 60 * 24 * 30`) signed with a `30d` JWT lease.

## Password Reset & Recovery
- **Forgot Password**: Requests reset link via `resetPasswordForEmail()` which sends an update callback target to `/admin/reset-password`.
- **Reset Form**: Updates credentials securely using `updatePassword()` via Server Action.
- **Access Limits**: Forgot Password endpoints are protected by a strict rate limit of `3 requests per hour` to prevent mail flood abuse.
