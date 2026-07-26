# Security Architecture Overview

## Executive Summary
This document reviews the security architecture of the portfolio CMS, mapping the defense layers, authentication boundaries, and access protection mechanisms implemented to prevent unauthorized compromise.

## Security Layers

```
                       ┌─────────────────────────┐
                       │   Client Web Browser    │
                       └────────────┬────────────┘
                                    │
                                    ▼ [HTTPS / Secure Cookies]
                       ┌─────────────────────────┐
                       │   Edge Middleware       │
                       │   (Session Validation)  │
                       └────────────┬────────────┘
                                    │
                                    ▼ [Server Actions / Rate Limits]
                       ┌─────────────────────────┐
                       │   Next.js Server Side   │
                       │   (Input Validation)    │
                       └────────────┬────────────┘
                                    │
                                    ▼ [Supabase Client / Service Role]
                       ┌─────────────────────────┐
                       │   Supabase Service Layer│
                       └────────────┬────────────┘
                                    │
                                    ▼ [PostgreSQL RLS Rules]
                       ┌─────────────────────────┐
                       │   PostgreSQL Database   │
                       └─────────────────────────┘
```

### 1. Edge Layer (Next.js Middleware/Proxy)
- **Role**: Validates JWT session tokens on edge routes before components render.
- **Paths**: Protects all paths matching `/admin/*` except `/admin/login` and `/admin/reset-password`.
- **Action**: Redirects unauthenticated operators directly to login page.

### 2. Application Layer (Next.js Server Actions)
- **Role**: Acts as the API boundary for database mutations and file operations.
- **Action**: Validates administrator authorization sessions, sanitizes inputs, enforces token-bucket rate limits, and throws obfuscated errors.

### 3. Database Layer (Supabase PostgreSQL RLS)
- **Role**: Restricts row updates and reads at the engine level.
- **Action**: Explicit policies only allow anonymous reads on published items and restrict CRUD access exclusively to authenticated roles.

### 4. Storage Layer (Supabase Storage RLS)
- **Role**: Blocks unauthorized media assets uploads, metadata poisoning, and file deletion.
- **Action**: Validates MIME types, restricts file sizes to 5MB, and maps buckets to explicit user permissions.
