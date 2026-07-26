# Project Audit: 28 - Roadmap

This roadmap outlines recommended milestones for immediate, weekly, monthly, and quarterly updates to improve the platform's stability, security, and user experience.

## 1. Phase 1: Immediate Security Fixes (Immediate)

- **Secure Admin Subpaths**:
  - **Action**: Rename `src/proxy.ts` to `src/middleware.ts` to register it as Next.js's global routing middleware.
  - **Goal**: Lock down the `/admin` routes.
- **Enforce Environment Variable Checks**:
  - **Action**: Modify [src/lib/auth.ts](file:///d:/portfolio/src/lib/auth.ts) to throw errors during system startup if `ADMIN_JWT_SECRET` is not set, preventing fallback to the static key in production.

---

## 2. Phase 2: Refactoring & Visual Optimizations (Next Week)

- **Standardize Markdown Processing**:
  - **Action**: Replace the custom regex code inside [src/app/blog/[slug]/page.tsx](file:///d:/portfolio/src/app/blog/[slug]/page.tsx) with a standard parsing library like `marked` or `mdx`.
- **Implement Parallel Queries**:
  - **Action**: Combine sequential data requests in [src/app/page.tsx](file:///d:/portfolio/src/app/page.tsx) using `Promise.all()`.
  - **Goal**: Reduce waterfall loading times and improve page speed.
- **Optimize Image Elements**:
  - **Action**: Swap traditional `<img>` tags for Next.js's native `<Image>` components to enable responsive sizing and format optimization.

---

## 3. Phase 3: Validation, Rate Limiting, & Draft Previews (Next Month)

- **Implement Rate Limiting**:
  - **Action**: Add sliding-window rate limiters to public Server Actions (like `submitContactForm`).
  - **Goal**: Protect the SQLite database from spam attacks.
- **Create a Draft Preview Route**:
  - **Action**: Add a new route at `/blog/preview/[slug]` that allows operators to inspect and format draft posts before publishing them.
- **Add Dynamic XML Sitemaps**:
  - **Action**: Implement automated sitemap generators (`sitemap.xml`) to improve index coverage in search engine crawlers.

---

## 4. Phase 4: Automated Testing & Monitoring (Quarterly)

- **Add Automated Tests**:
  - **Action**: Install testing packages like Vitest and Playwright to cover critical server actions and forms.
  - **Goal**: Catch regressions early during future framework updates.
- **Set Up Structured Logging**:
  - **Action**: Integrate a structured logging library (like Winston or Pino) to monitor runtime logs and database errors.
