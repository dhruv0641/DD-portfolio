# Project Audit: 22 - Dependencies

This report audits the dependencies defined in package.json.

## 1. Production Dependencies

| Package | Version | Purpose | Used By | Risk Level / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`next`** | `16.2.10` | Core meta-framework host server. | Application router compile paths. | **Low-Medium**: Next.js 16 includes breaking changes compared to older versions. Ensure code compatibility before upgrading. |
| **`react`** & **`react-dom`** | `19.2.4` | Component framework. | Layout components and views. | **Low**: Standard runtime dependencies. |
| **`drizzle-orm`** | `0.45.2` | Type-safe SQL query client. | [src/db/index.ts](file:///d:/portfolio/src/db/index.ts). | **Low**: Reliable query builder. |
| **`@libsql/client`** | `^0.17.4` | LibSQL SQLite connector client. | [src/db/index.ts](file:///d:/portfolio/src/db/index.ts). | **Low**: Supports standard SQLite database files. |
| **`bcryptjs`** | `^3.0.3` | Password hashing library. | [src/lib/auth.ts](file:///d:/portfolio/src/lib/auth.ts). | **Low**: Standard hashing utility. |
| **`jose`** | `^6.2.3` | JWT generation and verification. | [src/lib/auth.ts](file:///d:/portfolio/src/lib/auth.ts) and [src/proxy.ts](file:///d:/portfolio/src/proxy.ts). | **Low**: Performance-optimized token signer. |
| **`framer-motion`** | `^12.42.2` | Physics-based animation library. | UI page visual blocks. | **Low**: High quality animations. |
| **`lenis`** | `^1.3.25` | Smooth scrolling framework. | [src/components/LenisProvider.tsx](file:///d:/portfolio/src/components/LenisProvider.tsx). | **Low**: Apple-style scrolling physics. |
| **`clsx`** & **`tailwind-merge`** | `^2.1.1` & `^3.6.0` | Helper classes compiler tools. | [src/lib/utils.ts](file:///d:/portfolio/src/lib/utils.ts). | **Low**: Prevents CSS class conflicts. |
| **`sharp`** | `^0.35.3` | Image optimizer engine. | Next.js dynamic image compiler. | **Low**: Optimized image processing. |
| **`lucide-react`** | `^1.24.0` | Vector icon asset library. | UI elements layout. | **Low**: Standard icons set. |

---

## 2. Dev Dependencies

- **`drizzle-kit` (`0.31.10`)**: CLI utility for managing database schemas and generating migrations.
- **`typescript` (`^5`)**: Compiles typed syntax trees.
- **`tailwindcss` (`^4`)**: Enforces layout styles rules.
- **`eslint` & `eslint-config-next`**: Standard code quality checkers.

---

## 3. Deprecated / Unused / Alternatives Analysis

- **Unused Packages**: `next.svg`, `vercel.svg`, and other standard template assets in `public/` are unused by custom views.
- **Alternatives**:
  - `bcryptjs` is written in pure JavaScript, which is slower than compiled C++ alternatives. Swapping it for `bcrypt` (native bindings) or using newer web APIs like `crypto.subtle` can improve hashing performance.
  - Using a dedicated markdown parsing library (like `marked` or `mdx`) instead of the custom regex parser in [src/app/blog/[slug]/page.tsx](file:///d:/portfolio/src/app/blog/[slug]/page.tsx) will increase rendering reliability for complex markdown structures.
