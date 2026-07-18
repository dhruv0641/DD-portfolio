# Project Audit: 04 - Backend Audit

This report details the backend infrastructure, API design, and transaction handling.

## 1. Architectural Strategy

The backend runs entirely inside Next.js serverless execution environments. Instead of classical web MVC frameworks (e.g. Express, NestJS), transactions are routed via **React Server Actions** inside [src/app/actions/](file:///d:/portfolio/src/app/actions/).

### 1.1 Action Controllers
The system utilizes 6 specialized Server Action controllers:
1. **`login.ts`**: Governs operator sessions and password validation.
2. **`contact.ts`**: Coordinates visitor form validations, database logs, and external endpoint fetch loops.
3. **`blog.ts`**: Implements creation, updates, and deletion logic for engineering journal articles.
4. **`projects.ts`**: Manages case study listings, ordering sequences, and project parameter changes.
5. **`messages.ts`**: Handles inbox leads management (updating status indicators and executing permanent message deletion).
6. **`settings.ts`**: Persists layout styling hex parameters and animation toggle settings.

---

## 2. Request Pipelines & Middlewares

### 2.1 The Proxy Security Layer (Anomalous Middleware)
- **File Location**: [src/proxy.ts](file:///d:/portfolio/src/proxy.ts)
- **Functionality**: Contains configuration rules to matching `/admin/:path*` targets, reads session cookies, decrypts JWT sessions using `jose`, and redirects unauthorized operators to `/admin/login`.
- **CRITICAL AUDIT FINDING**: 
  > [!WARNING]
  > Since this file is named `proxy.ts` and not `middleware.ts`, it is **completely ignored** by Next.js's routing compilation system. The application currently has **no active global HTTP middleware boundary**. 
  > Authentication relies entirely on manual `verifyAuthSession()` redirects at the top of page server functions (e.g. [src/app/admin/dashboard/page.tsx:L10](file:///d:/portfolio/src/app/admin/dashboard/page.tsx#L10)), and inside individual mutation Server Actions.

---

## 3. Operations & Integrations

### 3.1 Background Jobs & Queue Workers
- **None**: SQLite is a single-process embedded database, and no asynchronous queue workers (like BullMQ, Celery, or Redis queues) are configured. All contact transactions and database inserts execute synchronously inside the lifecycle of the Server Action request.

### 3.2 External Email Forwarding
- **Service**: Integrated with external form processing gateways (like Formspree or Web3Forms) via standard API POST requests.
- **Resilience**: Configured with a `10-second` timeout boundary using `AbortController` in [src/app/actions/contact.ts](file:///d:/portfolio/src/app/actions/contact.ts) to prevent hanging requests when external email endpoints fail to respond.
- **Fail-Safe**: If the API call fails or times out, the message remains safely logged in the local SQLite database inbox.

### 3.3 Log Management
- Standard `console.log` and `console.error` functions are printed directly into Node.js stdout. There is no structured JSON logger (e.g., Winston, Pino) or external APM observability system integrated.
