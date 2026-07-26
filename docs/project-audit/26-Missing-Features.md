# Project Audit: 26 - Missing Features

This report lists missing features, modules, and security policies that are not currently implemented.

## 1. Missing Security & Infrastructure Policies

1. **Active Next.js Routing Middleware**:
   - The application has [src/proxy.ts](file:///d:/portfolio/src/proxy.ts), but Next.js does not execute it because it is not named `middleware.ts`. Correcting this filename will enforce global authentication checks on all `/admin/` subpaths.
2. **API Rate Limiting Controls**:
   - The public contact form lacks rate-limiting mechanisms, leaving it vulnerable to automated spam loops or denial-of-service (DoS) attempts against the SQLite database.
3. **Structured Security Headers**:
   - The configuration [next.config.ts](file:///d:/portfolio/next.config.ts) does not specify HTTP security headers (e.g., `X-Frame-Options`, `Content-Security-Policy`, `Referrer-Policy`), exposing the app to clickjacking or cross-site scripting vulnerabilities.

---

## 2. Missing Platform Modules

1. **User Registration System**:
   - There are no registration pages (e.g., `/admin/register`). New admin accounts can only be provisioned using the database seed script [src/db/seed.ts](file:///d:/portfolio/src/db/seed.ts).
2. **Password Recovery Workflow**:
   - Features like password reset requests or security tokens are not implemented. Operators who lose their credentials must manually update database values using SQLite command-line tools.
3. **Multi-Factor Authentication (MFA)**:
   - Access control relies entirely on single-factor credentials (username and password).
4. **Draft Previews**:
   - The blog system excludes drafts from public directories. However, there is no preview layout (e.g. `/blog/preview/[slug]`), meaning operators cannot preview drafts before publishing them.

---

## 3. Missing UX and Interface States

1. **Skeleton Loaders / Loading Spinners**:
   - The admin panel transitions between pages without loading states, which can cause layout shifts when loading large tables.
2. **Dynamic Alert Banners**:
   - CMS views handle transaction messages with basic JavaScript dialogs (e.g., `confirm('Are you sure?')`). Implementing custom accessible modal confirmation dialogs will improve the operator experience.
3. **Dynamic XML Sitemaps (`sitemap.xml`)**:
   - The site lacks dynamic XML sitemaps or custom metadata generator files (`robots.txt`), which are necessary to ensure search engine crawlers index new posts automatically.
4. **Automated Testing Suite**:
   - Unit tests, API validation tests, and E2E test runs are missing, leaving the codebase vulnerable to regressions during upgrades.
