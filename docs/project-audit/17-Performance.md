# Project Audit: 17 - Performance Audit

This report details rendering speeds, database execution overhead, asset optimization, and caching.

## 1. Client-Side Rendering & Animation Performance

- **Largest UI Renderers**:
  - **`ThoughtWave.tsx`**: Uses a canvas running custom rendering logic on an active canvas loop. It can trigger CPU spikes on low-end hardware if frame render sizes are not constrained.
  - **`LightProbe.tsx`**: Triggers calculations on every `mousemove` event. Performance is maintained by using Linear Interpolation (Lerp: `0.08`) and offloading transformations to GPU threads with `translate3d` and `will-change-transform`.
- **Reduced Motion Safety**: Toggling `reduceMotion` disables both animation loops and smooth scrolling, preventing unnecessary CPU and GPU load.

---

## 2. Server & Query Execution Latencies

- **Database Performance**:
  - **Engine**: SQLite reads data directly from the local file system. Latency is typically `<2ms` per query.
  - **Complexity**: Queries in [src/app/page.tsx](file:///d:/portfolio/src/app/page.tsx) run sequential database requests rather than parallel execution (e.g., awaiting all queries using `Promise.all`):
    ```typescript
    // sequential reads:
    const dbSettings = await db.select().from(schema.settings);
    const dbProjects = await db.select().from(schema.projects)...
    ```
    This sequential structure adds waterfall latency, though total database response time is low enough that visual impact is minor.
- **On-Demand Cache Revalidation**: Uses `revalidatePath` to refresh cached routes instantly when database updates are submitted, maintaining high performance for public visitors by serving pre-rendered static content.

---

## 3. Bundle Sizing & Assets Delivery

- **Font Delivery**: Uses `next/font/google` in `layout.tsx` to compile subset variables into local CSS classes. This prevents flashes of unstyled text (FOUT) by eliminating external Google Font queries at run time.
- **Dependency Audit**:
  - **Main Libraries**: Framer Motion (`framer-motion`), Lenis smooth scroll (`lenis`), Lucide Icons (`lucide-react`).
  - **Optimization**: Standard tree-shaking is handled by the Next.js bundle compiler.
- **Image Optimization**: Case study screenshots use standard `<img>` tags instead of Next.js's optimized `<Image>` component. While functional, using standard tags misses benefits like auto-generation of source-set responsive sizes and modern format conversions (e.g., WebP).
- **Code Splitting / Lazy Loading**: None of the client CMS layouts are dynamically imported (`next/dynamic` or lazy loading). The bundle size for `/admin/` views includes all CMS code, though this is restricted to authenticated operators and does not impact public visitors.
