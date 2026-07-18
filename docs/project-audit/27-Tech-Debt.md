# Project Audit: 27 - Technical Debt

This report identifies, categorizes, and estimates remediation effort for technical debt in the codebase.

## 1. Technical Debt Classification

We group technical debt into four priority categories:

### 1.1 Critical Debt (Immediate Action Required)
- **Inactive Global Route Middleware Protection**:
  - **Issue**: [src/proxy.ts](file:///d:/portfolio/src/proxy.ts) is not loaded as a Next.js middleware, leaving admin layout views exposed to unauthorized visitors.
  - **Risk**: High. Relies entirely on manual page-level security checks.
  - **Remediation**: Rename `src/proxy.ts` to `src/middleware.ts` to enable global routing protection.
  - **Remediation Effort**: **Low (5-10 minutes)**.

### 1.2 High Debt (Must Address before scaling)
- **Lack of API Rate Limiting**:
  - **Issue**: Form submission server actions are exposed to API flooding.
  - **Risk**: Database exhaustion or spam entry loops.
  - **Remediation**: Implement sliding-window limiters using Upstash Redis or client IP trackers inside SQLite database tables.
  - **Remediation Effort**: **Medium (2-4 hours)**.
- **Manual Regex Markdown Parser**:
  - **Issue**: Blog detail rendering uses custom regex replacement patterns.
  - **Risk**: Formatting errors when rendering complex tables, lists, or syntax elements in technical posts.
  - **Remediation**: Replace the regex code with a standardized markdown compiler (e.g., `marked` or `mdx`).
  - **Remediation Effort**: **Medium (1-2 hours)**.

### 1.3 Medium Debt (Should address for clean codebase)
- **Fallback Secret Credentials**:
  - **Issue**: Session encryption falls back to a hardcoded JWT key if `ADMIN_JWT_SECRET` is missing.
  - **Risk**: Exposing keys in version control if the code is shared publicly.
  - **Remediation**: Raise an exception during initialization if key environment variables are missing, blocking execution.
  - **Remediation Effort**: **Low (15 minutes)**.
- **Unoptimized Image Loading**:
  - **Issue**: Portfolio screenshots use standard HTML `<img>` tags.
  - **Risk**: Poor performance from loading unoptimized images on mobile devices.
  - **Remediation**: Replace `<img>` tags with Next.js's `<Image>` component to automate size scaling and format optimizations.
  - **Remediation Effort**: **Medium (1 hour)**.

### 1.4 Low Debt (Optimizations)
- **TypeScript `any` Overrides**:
  - **Issue**: ESLint configuration turns off type checking for variables cast as `any`.
  - **Risk**: Reduces overall type safety across inputs.
  - **Remediation**: Define explicit schemas and strict types for Server Action payloads.
  - **Remediation Effort**: **Medium (2-3 hours)**.
- **Sequential Database Queries**:
  - **Issue**: Database reads execute sequentially in `page.tsx`, causing waterfall latencies.
  - **Remediation**: Combine queries using `Promise.all()` to fetch settings, projects, and posts in parallel.
  - **Remediation Effort**: **Low (20 minutes)**.
