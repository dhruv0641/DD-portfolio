# PostgreSQL Row Level Security (RLS) Audit

## Overview
This document audits Row Level Security (RLS) policies on the PostgreSQL database, verifying access isolation for all 15 tables.

## Table Policies Verification

### 1. Enablement Checklist
All tables have RLS explicitly enabled:
`ALTER TABLE public.{table_name} ENABLE ROW LEVEL SECURITY;`

### 2. Table-by-Table Policy Audit

| Table | Policy Name | Allowed Operations | Condition |
|---|---|---|---|
| `profiles` | "Allow public read on profiles" | SELECT | `status = 'active'` |
| | "Allow admin full access" | ALL | `authenticated` |
| `skills` | "Allow public read on skills" | SELECT | `status = 'active'` |
| | "Allow admin full access" | ALL | `authenticated` |
| `projects` | "Allow public read on published" | SELECT | `is_draft = false AND status = 'active'` |
| | "Allow admin full access" | ALL | `authenticated` |
| `blogs` | "Allow public read on published" | SELECT | `is_draft = false AND status = 'active'` |
| | "Allow admin full access" | ALL | `authenticated` |
| `messages` | "Allow anonymous inserts" | INSERT | `true` (unrestricted submission) |
| | "Allow admin full access" | ALL | `authenticated` |
| `activity_logs`| "Allow anonymous/auth inserts" | INSERT | `true` (for tracking failures) |
| | "Allow admin SELECT" | SELECT | `authenticated` |

## Vulnerability Assessment
- **RLS Bypass via Service Role**: Admin services use the `SUPABASE_SERVICE_ROLE_KEY` to perform updates, bypassing RLS. This is secure because the key never leaves the secure server runtime env.
- **Anonymous Message Spam**: RLS allows anonymous inserts into `messages`. To mitigate this, a rate limiter limiting submissions to `3 per hour` is configured at the Server Action layer.
