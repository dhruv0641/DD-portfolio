# Phase 1: 09 - Developer Guidelines

This guide establishes coding standards and architectural principles for developers working on Phase 2.

## 1. Architectural Guidelines

1. **Keep Next.js Middleware (Proxy) Active**:
   - Ensure all route interception policies are declared inside [src/proxy.ts](file:///d:/portfolio/src/proxy.ts). In Next.js 16, the `middleware.ts` convention is deprecated in favor of `proxy.ts`.
   - Use the config matcher array to exclude static files or select paths.
2. **Type Safety Conventions**:
   - Do not use `any` when defining inputs or return signatures.
   - Centralize all shared interfaces inside [src/types/index.ts](file:///d:/portfolio/src/types/index.ts).
3. **KISS & DRY Principles**:
   - Avoid adding bloated state management systems.
   - Use helper utilities in `lib/` and shared constants in `lib/constants.ts` to keep code DRY.

---

## 2. Server Action Mappings

- Keep Server Actions inside [src/app/actions/](file:///d:/portfolio/src/app/actions/).
- Verify admin sessions at the start of all write operations using `verifyAuthSession()`:
  ```typescript
  const session = await verifyAuthSession();
  if (!session) {
    return { success: false, error: 'Unauthorized operation.' };
  }
  ```
- Always execute `revalidatePath` to refresh cached views immediately when modifying database values.
