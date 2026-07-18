# Vercel Production Deployment Checklist

This checklist outlines the step-by-step procedures to deploy the Dynamic portfolio application to Vercel and establish DNS mappings.

---

## 1. GitHub Repository Setup
- [ ] Initialize local repository as Git repository if not done: `git init`.
- [ ] Add all source files to staging: `git add .`.
- [ ] Commit source files: `git commit -m "feat: initial premium release"`.
- [ ] Create a new private repository on GitHub (`github.com/dhruv0641/DD-portfolio`).
- [ ] Link local repository to GitHub:
  ```bash
  git remote add origin https://github.com/dhruv0641/DD-portfolio.git
  ```
- [ ] Push to master branch: `git push -u origin main`.

---

## 2. Vercel Project Creation
- [ ] Sign in to Vercel Console (`vercel.com`).
- [ ] Click **Add New** -> **Project**.
- [ ] Import the GitHub repository `DD-portfolio`.
- [ ] Under **Build & Development Settings**, confirm the default settings (Framework: Next.js).

---

## 3. Environment Variables Configuration in Vercel
In the project settings under **Environment Variables**, add the following production variables:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase API domain (e.g., `https://xxxx.supabase.co`).
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous client key.
- [ ] `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role database write key.
- [ ] `ADMIN_JWT_SECRET`: A secure randomly-generated string (minimum 32 characters) to sign cookies.
- [ ] `CONTACT_FORM_ENDPOINT`: Optional endpoint to forward message queries (e.g. Formspree/Web3Forms).

---

## 4. Supabase Production Configurations
- [ ] Navigate to your Supabase Dashboard.
- [ ] In the SQL Editor, copy and execute database schemas:
  - [0001_init_schema.sql](file:///d:/portfolio/supabase/migrations/0001_init_schema.sql)
  - [0002_activity_logs.sql](file:///d:/portfolio/supabase/migrations/0002_activity_logs.sql)
- [ ] Verify RLS policies are enabled on all tables.
- [ ] Create public storage buckets matching the inventory list (`resume`, `projects`, etc.).
- [ ] Deactivate "Confirm email" in Auth Settings.

---

## 5. Custom Domain Connection
- [ ] In the Vercel project dashboard, navigate to **Settings** -> **Domains**.
- [ ] Add your apex domain (e.g., `vance.engineering`) and select the option to automatically redirect `www.vance.engineering` to `vance.engineering`.

---

## 6. DNS Configuration
In your DNS provider panel (e.g., GoDaddy, Cloudflare, Namecheap), configure the following records:

- [ ] **Apex Domain (A Record)**:
  - Host: `@`
  - Value: `76.76.21.21` (Vercel IP)
- [ ] **Subdomain (CNAME Record)**:
  - Host: `www`
  - Value: `cname.vercel-dns.com`

---

## 7. HTTPS Verification
- [ ] Wait for Vercel to verify DNS propagation (typically 1-15 minutes).
- [ ] Vercel will automatically provision a Let's Encrypt SSL certificate.
- [ ] Visit `https://vance.engineering` to verify the secure connection padlock icon.

---

## 8. Post-Deployment Verification
- [ ] Navigate to the login page: `/admin/login`.
- [ ] Log in using your admin credentials.
- [ ] Verify that you can edit profile details, create new projects, and browse uploaded media files successfully.
