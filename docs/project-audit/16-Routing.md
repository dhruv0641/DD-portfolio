# Project Audit: 16 - Routing System

This report audits folder routing layout systems and dynamic route configurations.

## 1. Routing Model

The application utilizes Next.js App Router conventions:

- **Static Pages**: Handled by file-based subdirectories containing server/client views:
  - `/` -> [src/app/page.tsx](file:///d:/portfolio/src/app/page.tsx)
  - `/blog` -> [src/app/blog/page.tsx](file:///d:/portfolio/src/app/blog/page.tsx)
- **Dynamic Routing**: Dynamic variables are mapped using square brackets:
  - `/blog/[slug]` -> [src/app/blog/[slug]/page.tsx](file:///d:/portfolio/src/app/blog/[slug]/page.tsx)
- **Nested Pages Layout**: Grouped under `/admin/`:
  - `/admin/dashboard`
  - `/admin/login`
  - `/admin/projects`
  - `/admin/blog`
  - `/admin/messages`
  - `/admin/settings`

---

## 2. Layout nesting

```mermaid
graph TD
    subgraph Viewport [Root Layout]
        RL[src/app/layout.tsx]
    end

    subgraph Pages [Public Views]
        RL -->|renders| PL[/]
        RL -->|renders| BL[/blog]
        RL -->|renders| BD[/blog/slug]
    end

    subgraph Admins [Admin Views]
        RL -->|renders| AL[src/app/admin/layout.tsx]
        AL -->|renders| AD[/admin/dashboard]
        AL -->|renders| AP[/admin/projects]
        AL -->|renders| AB[/admin/blog]
        AL -->|renders| AM[/admin/messages]
        AL -->|renders| AS[/admin/settings]
    end
```

### 2.1 Root Layout
Defined in [src/app/layout.tsx](file:///d:/portfolio/src/app/layout.tsx). Sets global font configurations, initializes database theme contexts, registers Lenis smooth scrolling, mounts the visual spotlight aura tracking canvas, and displays the public header navigation.

### 2.2 Admin Layout
Defined in [src/app/admin/layout.tsx](file:///d:/portfolio/src/app/admin/layout.tsx). Renders an operations sidebar when an authenticated session is detected. Otherwise, it bypasses the sidebar layout to display nested child elements (e.g., rendering `/admin/login`).

---

## 3. Performance & Compilation Configs

- **Dynamic Routing Execution**: Admin panel modules are forced to run dynamically via:
  ```typescript
  export const dynamic = 'force-dynamic';
  ```
  This bypasses static generation cache overrides to serve the latest database records on dashboard reload.
- **Cache Revalidation**: Changes submitted via Server Actions execute `revalidatePath` to refresh cached templates on matching routes immediately.
- **Middleware Integration**: As documented, [src/proxy.ts](file:///d:/portfolio/src/proxy.ts) is currently bypassed because it is not named `middleware.ts`, leaving `/admin` routes dependent on page-level auth checks.
