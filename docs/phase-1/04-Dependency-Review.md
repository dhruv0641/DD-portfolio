# Phase 1: 04 - Dependency Review

This report audits the dependencies in `package.json` and evaluates security risks, deprecations, and potential optimizations.

## 1. Dependency Analysis

All major packages were audited for stability and footprint:

- **Framework Core**: Next.js `16.2.10` and React `19.2.4`. Both represent modern frontend stack capabilities.
- **ORM & DB Drivers**: `drizzle-orm` (`0.45.2`) and `@libsql/client` (`^0.17.4`). Provides low-overhead SQL queries.
- **Security Utilities**: `bcryptjs` (`^3.0.3`) and `jose` (`^6.2.3`). Secure password hashing and token generation.
- **Visuals & Motion**: `framer-motion` (`^12.42.2`) and `lenis` (`^1.3.25`). Provides smooth scrolling and micro-animations.

---

## 2. Identified Risks & Recommendations

1. **`bcryptjs` vs Native `bcrypt`**:
   - `bcryptjs` is written in pure JavaScript, which makes it easier to install across environments but slower during password verification.
   - For higher-traffic systems, replacing it with the native C++ wrapper `bcrypt` or migration to Supabase Auth handles password security off-server.
2. **Unused Icons and Fonts**:
   - Standard template icons (like `vercel.svg` and `globe.svg`) exist in `public/` but are not referenced in the project components. These can be removed before production deployments.
3. **TypeScript Typings**:
   - Dev dependencies include `@types/node` and `@types/react` which are kept aligned with the compiler version settings in `tsconfig.json`.
