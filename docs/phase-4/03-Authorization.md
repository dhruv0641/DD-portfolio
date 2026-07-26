# Authorization & Route Guards Audit

## Overview
This document assesses route validation boundaries, client-side guards, API request protection, and role permissions checks.

## Guard Implementations

### 1. Route Proxy Guard (`src/proxy.ts`)
- Runs at edge rendering boundary.
- Intercepts `/admin/*` routes.
- Decrypts and validates the session cookie. Redirects directly on invalid signature or expired timestamp.

### 2. Server Action Guards
- Server Actions enforce explicit identity verification internally:
  ```typescript
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized.' };
  }
  ```
- Prevents malicious operators from triggering actions via direct terminal tools (e.g. curl) bypassing page routing.

### 3. API/Action Matrix

| Endpoint / Action | Role Required | Guard Mechanism | Action on Failure |
|---|---|---|---|
| `/admin/*` views | Authenticated | Edge Middleware | Redirect to `/admin/login` |
| `submitContactForm` | Anonymous | Honeypot & Rate Limiter | Reject request |
| `uploadMediaFile` | Authenticated | Server Session & Size Check | Return 401 Unauthorized |
| `deleteMediaFile` | Authenticated | Server Session & Path Check | Return 401 Unauthorized |
| `saveProject` | Authenticated | Server Session & Slug Check | Return 401 Unauthorized |
| `saveBlogPost` | Authenticated | Server Session & Slug Check | Return 401 Unauthorized |
