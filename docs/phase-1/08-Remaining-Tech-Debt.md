# Phase 1: 08 - Remaining Technical Debt

This report outlines the remaining technical debt to be addressed before Supabase integration or UI redesigns in Phase 2.

## 1. Key Remaining Tech Debt Items

### 1.1 Lack of Automated Testing Suite
- **Issue**: No testing frameworks (such as Jest or Vitest) are configured.
- **Risk**: High risk of regression errors when refactoring database tables or auth flows.
- **Remediation**: Add Vitest to cover server actions, and Playwright for E2E form testing.

### 1.2 Unprotected Public API Actions
- **Issue**: Public Server Actions (like `submitContactForm`) lack rate limiting.
- **Risk**: Exposed to spam submissions or brute-force requests.
- **Remediation**: Implement sliding-window rate limiters.

### 1.3 Regex-Based Markdown Parsing
- **Issue**: The blog page renders posts using regex replacement loops.
- **Risk**: Prone to layout bugs if posts include complex tables or syntax tags.
- **Remediation**: Replace custom regex logic with a markdown parser library like `marked` or `mdx`.

### 1.4 Unoptimized Image Tags
- **Issue**: Portfolio snapshots use traditional `<img>` tags.
- **Risk**: Misses benefits like auto-generation of responsive sizes and modern format conversions (e.g., WebP).
- **Remediation**: Replace `<img>` tags with Next.js's `<Image>` components.
