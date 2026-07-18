# Onboarding Checklist & Credentials Inventory

This checklist details every credential, configuration, domain setup, and environment variable needed to build, configure, run, and deploy the portfolio application.

---

## 1. Project Information

| Parameter | Required/Optional | Description | Status |
|---|---|---|---|
| Project Name | Required | Namespace identifier of the application. | ✅ Received (`temp-next`) |
| Portfolio Owner | Required | Owner name rendered in logos and headers. | ✅ Received (`Dhruv Dobariya`) |
| Contact Email | Required | Inbound contact forms destination. | ✅ Received (`dhruv.dobariya0641@gmail.com`) |
| Git Repository | Required | Code version control repository url. | ✅ Received (`d:\portfolio`) |
| Package Manager| Required | Workspace dependency compiler. | ✅ Received (`npm`) |
| Branch Strategy| Required | Git development pipeline convention. | ✅ Received (`main`) |

---

## 2. Supabase Configuration

| Parameter | Required/Optional | Description | Status |
|---|---|---|---|
| Supabase URL | Required | REST API ingress endpoint for queries. | ✅ Received (`your-project-ref.supabase.co`) |
| Anon/Public Key | Required | Public client permission signature token. | ✅ Received |
| Service Role Key| Required | Server-only bypass write credentials. | ✅ Received |
| Schema Execution| Required | Database migrations table initialization. | ✅ Received (automatic via SQL migration scripts) |
| Storage Buckets | Required | Public buckets (`resume`, `projects`, etc.). | ✅ Received (preconfigured in migrations) |

---

## 3. Authentication Configurations

| Parameter | Required/Optional | Description | Status |
|---|---|---|---|
| Admin Account | Required | Primary admin email map. | ✅ Received (`admin@vance.engineering`) |
| Auth Method | Required | Login verification flow (Email + Password). | ✅ Received |
| Session Timeout | Required | Token lease time lengths (24 hours / 30 days). | ✅ Received |
| Password Reset | Required | Callback verification route. | ✅ Received (`/admin/reset-password`) |

---

## 4. Environment Variables Checklist

| Variable Name | Required | Purpose | Status |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase client database endpoint. | ✅ Received |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public database queries token. | ✅ Received |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only administrative updates token.| ✅ Received |
| `ADMIN_JWT_SECRET` | Yes | Client cookie verification key. | ✅ Received |
| `CONTACT_FORM_ENDPOINT` | No | Forwarder mail endpoint (Formspree). | 🟡 Will Provide Later |

---

## 5. Visual Branding & Colors

| Parameter | Required/Optional | Preference | Status |
|---|---|---|---|
| Primary Color | Required | Dark mode background HSL values (`#030303`). | ✅ Received |
| Accent Color | Required | Highlight components color HSL values (`#2A56DE`). | ✅ Received |
| Typography | Required | Plus Jakarta Sans, Instrument Serif. | ✅ Received |
| Theme Style | Required | Minimalist dark console grids. | ✅ Received |

---

## 6. Onboarding Parameters Verification

| Item | Status | Required | Received |
|------|--------|----------|----------|
| Supabase URL | ✅ Received | Yes | Yes |
| Anon Key | ✅ Received | Yes | Yes |
| Service Key | ✅ Received | Yes | Yes |
| JWT Secret | ✅ Received | Yes | Yes |
| Mail Endpoint | 🟡 Will Provide Later | No | No |
| Domain DNS | 🟡 Will Provide Later | No | No |
