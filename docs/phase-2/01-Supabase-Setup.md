# Supabase Setup Guide

## Overview

This portfolio uses **Supabase** as its backend-as-a-service (BaaS) platform, replacing the previous SQLite/Drizzle ORM stack. Supabase provides a hosted PostgreSQL database, built-in authentication, file storage, and auto-generated REST APIs.

## Prerequisites

- A Supabase account at [supabase.com](https://supabase.com)
- A Supabase project created in the dashboard
- Node.js 18+ and npm installed

## Environment Variables

The following environment variables must be configured in `.env` (or `.env.local`):

| Variable | Description | Source |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project API URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous/public API key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (admin bypass) | Supabase Dashboard → Settings → API |
| `ADMIN_JWT_SECRET` | Secret for signing admin session JWTs | Custom, user-defined |

> [!CAUTION]
> The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security. It must **never** be exposed to the client. It is only used in server-side Server Actions.

## Client Architecture

Two Supabase client instances are configured in `src/lib/supabase.ts`:

### 1. Anonymous Client (`supabase`)
- Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Respects RLS policies
- Used for all public read operations and anonymous inserts (messages, analytics)
- Session persistence is disabled for server-side compatibility

### 2. Admin Client (`getSupabaseAdmin()`)
- Uses `SUPABASE_SERVICE_ROLE_KEY`
- Bypasses RLS policies
- Used exclusively in authenticated Server Actions for admin write operations
- Created on-demand via factory function to avoid accidental misuse

## Database Schema Deployment

Run the migration SQL against your Supabase project:

1. Navigate to Supabase Dashboard → SQL Editor
2. Paste the contents of `supabase/migrations/0001_init_schema.sql`
3. Execute the script

This will create all 14 tables, enable RLS, create policies, set up indexes, and configure 11 storage buckets.

## Post-Setup Verification

After deploying the schema:

1. Verify all tables appear under "Table Editor" in the Supabase Dashboard
2. Confirm RLS is enabled on every table (padlock icon visible)
3. Check "Storage" section for the 11 configured buckets
4. Test a public read query from the SQL Editor: `SELECT * FROM public.site_settings WHERE status = 'active';`
