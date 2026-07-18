# Environment Configuration Manual

## Overview
This document specifies the variable namespaces, security boundaries, and secrets isolation settings across environments.

## Environment Variables Grid

| Key Name | Scope | Production Value | Verification Guard |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Custom Supabase domain | Client-safe |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Client & Server | Custom Anon token | Client-safe |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Service key | Must exclude `NEXT_PUBLIC_` prefix |
| `ADMIN_JWT_SECRET` | Server-Only | 256-bit secure key | Kept in server runtime env |
| `CONTACT_FORM_ENDPOINT` | Server-Only | Formspree / Web3Forms URL | Kept in server runtime env |

## Environment Isolation Checklist

- [ ] **Credential Separation**: Dev, staging, and production environments must use distinct Supabase project databases to isolate test data.
- [ ] **Audit Key Lengths**: Ensure `ADMIN_JWT_SECRET` has a length of at least 32 characters to prevent token brute-forcing.
- [ ] **No Hardcoded Tokens**: Verify that `.env` files are added to `.gitignore` to prevent leaking secrets in version control.
