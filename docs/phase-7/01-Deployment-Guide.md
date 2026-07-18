# Deployment Guide

## Overview
This guide provides the steps to deploy the portfolio to serverless cloud providers (e.g., Vercel, Netlify) and link it to the production Supabase database.

## Step-by-Step Deployment

### 1. Supabase Project Setup
1. Create a new project in the Supabase Dashboard.
2. Under **SQL Editor**, paste and run the migration scripts:
   - [0001_init_schema.sql](file:///d:/portfolio/supabase/migrations/0001_init_schema.sql)
   - [0002_activity_logs.sql](file:///d:/portfolio/supabase/migrations/0002_activity_logs.sql)
3. Under **Storage**, create the following buckets and set them to **Public**:
   - `profile-images`, `hero-images`, `projects`, `blog-images`, `certificates`, `resume`, `site-assets`, `logos`, `icons`
4. Under **Auth Settings**, disable "Confirm email" to allow direct admin sign-in via custom email map.

### 2. Provider Environment Setup (Vercel example)
Configure the following keys in Vercel project environment settings:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase API endpoint.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anonymous client key.
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role database write key.
- `ADMIN_JWT_SECRET`: A secure randomly-generated string (min 32 characters) to sign cookies.
- `CONTACT_FORM_ENDPOINT`: Web3Forms/Formspree API endpoint to forward messages.

### 3. DNS & SSL Domain Mappings
1. Point your domain A records to your hosting provider (e.g. Vercel ingress IPs).
2. Configure **www** redirection to the apex root domain (canonical).
3. The provider automatically provisions SSL certs via Let's Encrypt, enforcing HTTPS transport.
